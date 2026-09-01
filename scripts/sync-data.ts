import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { portfolioSchema } from "./portfolio-schema.ts";

const TARGET = resolve("src/lib/portfolio-data.json");
const ASSETS_TARGET = resolve("public/assets");
const ASSET_PREFIX = "/assets/";
const ENV_KEY = "PORTFOLIO_DATA_URL";
const TOKEN_KEY = "PORTFOLIO_DATA_TOKEN";

const fromEnvOrDotenv = (key: string): string | undefined => {
  if (process.env[key] !== undefined) return process.env[key];
  for (const file of [".env.local", ".env"]) {
    const path = resolve(file);
    if (!existsSync(path)) continue;
    const match = readFileSync(path, "utf8").match(
      new RegExp(`^${key}=(.*)$`, "m")
    );
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
};

const isGitHubApi = (target: string): boolean =>
  target.startsWith("https://api.github.com/");

const acceptFor = (target: string, kind: "raw" | "json"): Record<string, string> => {
  if (!isGitHubApi(target)) return {};
  return {
    Accept: kind === "raw" ? "application/vnd.github.raw" : "application/vnd.github+json",
  };
};

const assetsUrlFrom = (dataUrl: string): string | undefined => {
  const match = dataUrl.match(/^(.+)\/portfolio\.json(\?.*)?$/);
  return match ? `${match[1]}/assets${match[2] ?? ""}` : undefined;
};

const withinUrl = (base: string, name: string): string => {
  const [path, query] = base.split("?");
  return query ? `${path}/${name}?${query}` : `${path}/${name}`;
};

type RemoteEntry = { name: string; type: string };

const listRemoteAssets = async (
  base: string,
  headers: Record<string, string>
): Promise<RemoteEntry[]> => {
  const response = await fetch(base, {
    headers: { ...headers, ...acceptFor(base, "json") },
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${base}`);

  const listing = await response.json();
  if (!Array.isArray(listing)) {
    throw new Error(`expected a directory listing at ${base}`);
  }
  return listing as RemoteEntry[];
};

const downloadAsset = async (
  base: string,
  name: string,
  headers: Record<string, string>
): Promise<void> => {
  const target = withinUrl(base, name);
  const response = await fetch(target, {
    headers: { ...headers, ...acceptFor(target, "raw") },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${target}`);

  writeFileSync(
    resolve(ASSETS_TARGET, name),
    Buffer.from(await response.arrayBuffer())
  );
};

const mirrorAssets = async (
  base: string,
  headers: Record<string, string>
): Promise<number> => {
  const files = (await listRemoteAssets(base, headers)).filter(
    (entry) => entry.type === "file"
  );
  if (files.length === 0) return 0;

  mkdirSync(ASSETS_TARGET, { recursive: true });
  await Promise.all(files.map((file) => downloadAsset(base, file.name, headers)));
  return files.length;
};

type ImageBearing = { projects: { image?: string | null }[] };

const missingImages = (config: ImageBearing): string[] =>
  config.projects
    .map((project) => project.image)
    .filter((image): image is string => !!image && image.startsWith(ASSET_PREFIX))
    .filter(
      (image) =>
        !existsSync(resolve(ASSETS_TARGET, image.slice(ASSET_PREFIX.length)))
    );

const url = fromEnvOrDotenv(ENV_KEY);
const token = fromEnvOrDotenv(TOKEN_KEY);

if (!url) {
  if (!existsSync(TARGET)) {
    writeFileSync(TARGET, "null\n");
    console.log(`sync-data: ${ENV_KEY} not set, using placeholder data.config.example.ts`);
  } else {
    console.log(`sync-data: ${ENV_KEY} not set, keeping existing ${TARGET}`);
  }
  process.exit(0);
}

try {
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(url, {
    headers: { ...headers, ...acceptFor(url, "raw") },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const data = await response.json();

  const result = portfolioSchema.safeParse(data);
  if (!result.success) {
    console.error("sync-data: remote portfolio data failed validation:");
    for (const line of z.prettifyError(result.error).split("\n")) {
      console.error(`  ${line}`);
    }
    process.exit(1);
  }

  writeFileSync(TARGET, JSON.stringify(data, null, 2) + "\n");
  const { learnings = [], projects, bookmarks = [] } = result.data;
  const bookmarkCount = bookmarks.reduce((n, folder) => n + folder.bookmarks.length, 0);
  console.log(
    `sync-data: fetched ${url} (${learnings.length} learnings, ${projects.length} projects, ${bookmarkCount} bookmarks)`
  );

  const assetsUrl = assetsUrlFrom(url);
  if (assetsUrl) {
    const mirrored = await mirrorAssets(assetsUrl, headers);
    console.log(`sync-data: mirrored ${mirrored} assets from ${assetsUrl}`);
  } else {
    console.log(
      `sync-data: ${ENV_KEY} does not end in portfolio.json, leaving public/assets as committed`
    );
  }

  const missing = missingImages(result.data);
  if (missing.length > 0) {
    console.error("sync-data: project images referenced but not present in public/assets:");
    for (const image of missing) console.error(`  ${image}`);
    process.exit(1);
  }
} catch (error) {
  console.error(`sync-data: failed to fetch portfolio data: ${(error as Error).message}`);
  process.exit(1);
}

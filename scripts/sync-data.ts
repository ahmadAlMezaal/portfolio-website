import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { portfolioSchema } from "./portfolio-schema.ts";

const TARGET = resolve("src/lib/portfolio-data.json");
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

const url = fromEnvOrDotenv(ENV_KEY);
const token = fromEnvOrDotenv(TOKEN_KEY);

if (!url) {
  if (!existsSync(TARGET)) {
    writeFileSync(TARGET, "null\n");
    console.log(`sync-data: ${ENV_KEY} not set — using placeholder data.config.example.ts`);
  } else {
    console.log(`sync-data: ${ENV_KEY} not set — keeping existing ${TARGET}`);
  }
  process.exit(0);
}

try {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (url.startsWith("https://api.github.com/")) {
    headers.Accept = "application/vnd.github.raw";
  }

  const response = await fetch(url, { headers });
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
} catch (error) {
  console.error(`sync-data: failed to fetch portfolio data: ${(error as Error).message}`);
  process.exit(1);
}

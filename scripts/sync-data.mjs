
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const TARGET = resolve("src/lib/portfolio-data.json");
const ENV_KEY = "PORTFOLIO_DATA_URL";
const TOKEN_KEY = "PORTFOLIO_DATA_TOKEN";

const fromEnvOrDotenv = (key) => {
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

const REQUIRED = {
  siteMetadata: "object",
  personalInfo: "object",
  roles: "array",
  stats: "array",
  skills: "array",
  experiences: "array",
  projects: "array",
  education: "array",
  certifications: "array",
};

const BOOKMARK_KINDS = ["article", "repo", "package", "docs", "video", "tool"];

const validate = (data) => {
  const errors = [];
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return ["root is not an object"];
  }
  for (const [key, kind] of Object.entries(REQUIRED)) {
    const value = data[key];
    const ok = kind === "array" ? Array.isArray(value) : typeof value === "object" && value !== null;
    if (!ok) errors.push(`"${key}" must be ${kind === "array" ? "an array" : "an object"}`);
  }
  if (typeof data.siteMetadata?.siteUrl !== "string" || !/^https?:\/\//.test(data.siteMetadata.siteUrl)) {
    errors.push('"siteMetadata.siteUrl" must be an absolute http(s) URL');
  }
  if (data.focusAreas !== undefined && (!Array.isArray(data.focusAreas) || data.focusAreas.some((a) => typeof a !== "string"))) {
    errors.push('"focusAreas" must be an array of strings when present');
  }
  for (const [i, folder] of (data.bookmarks ?? []).entries()) {
    if (typeof folder?.name !== "string" || folder.name.length === 0) {
      errors.push(`bookmarks[${i}] is missing a "name"`);
    }
    if (!Array.isArray(folder?.bookmarks) || folder.bookmarks.length === 0) {
      errors.push(`bookmarks[${i}] ("${folder?.name}") must have a non-empty "bookmarks" array`);
      continue;
    }
    for (const [j, bookmark] of folder.bookmarks.entries()) {
      const where = `bookmarks[${i}].bookmarks[${j}] ("${bookmark?.title}")`;
      if (typeof bookmark?.title !== "string") errors.push(`${where} is missing "title"`);
      if (typeof bookmark?.url !== "string" || !/^https?:\/\//.test(bookmark.url)) {
        errors.push(`${where} must have an absolute http(s) "url"`);
      }
      if (!BOOKMARK_KINDS.includes(bookmark?.kind)) {
        errors.push(`${where} has kind "${bookmark?.kind}" — expected one of ${BOOKMARK_KINDS.join(", ")}`);
      }
    }
  }
  for (const [i, learning] of (data.learnings ?? []).entries()) {
    for (const lang of ["typescript", "go", "python"]) {
      if (typeof learning?.code?.[lang] !== "string") {
        errors.push(`learnings[${i}] ("${learning?.title}") is missing code.${lang}`);
      }
    }
  }
  return errors;
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
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (url.startsWith("https://api.github.com/")) {
    headers.Accept = "application/vnd.github.raw";
  }

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const data = await response.json();

  const errors = validate(data);
  if (errors.length > 0) {
    console.error("sync-data: remote portfolio data failed validation:");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  writeFileSync(TARGET, JSON.stringify(data, null, 2) + "\n");
  const bookmarkCount = (data.bookmarks ?? []).reduce((n, f) => n + (f.bookmarks?.length ?? 0), 0);
  console.log(`sync-data: fetched ${url} (${(data.learnings ?? []).length} learnings, ${data.projects.length} projects, ${bookmarkCount} bookmarks)`);
} catch (error) {
  console.error(`sync-data: failed to fetch portfolio data: ${error.message}`);
  process.exit(1);
}

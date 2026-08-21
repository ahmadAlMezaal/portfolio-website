import type { Project, ProjectPlatform, ProjectStatus } from "@/types";
import { fieldScore, queryTokens, wordsOf } from "@/lib/search";

export const sortProjects = (projectList: Project[]): Project[] => {
  const statusOrder: Record<ProjectStatus | "undefined", number> = {
    live: 1,
    in_progress: 2,
    private: 3,
    undefined: 1,
  };

  return [...projectList].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    const statusA = a.status || "live";
    const statusB = b.status || "live";
    const orderA = statusOrder[statusA] ?? statusOrder["undefined"];
    const orderB = statusOrder[statusB] ?? statusOrder["undefined"];

    return orderA - orderB;
  });
};

export const shouldHideLinks = (project: Project): boolean =>
  project.status === "private" || project.links.length === 0;

const MOBILE_TAGS = new Set([
  "mobile",
  "react native",
  "expo",
  "ios",
  "android",
  "swift",
  "swiftui",
  "kotlin",
  "flutter",
  "dart",
]);

const TOOL_TAGS = new Set([
  "cli",
  "mcp",
  "agent",
  "agents",
  "ai agents",
  "ai tools",
  "automation",
  "developer tools",
  "devtools",
]);

const STORE_LINKS = new Set(["appstore", "playstore"]);

const hasTag = (project: Project, tags: Set<string>): boolean =>
  project.tags.some((tag) => tags.has(tag.toLowerCase()));

export const projectPlatform = (project: Project): ProjectPlatform => {
  if (project.platform) return project.platform;
  if (project.links.some((link) => STORE_LINKS.has(link.type))) return "mobile";
  if (hasTag(project, MOBILE_TAGS)) return "mobile";
  if (hasTag(project, TOOL_TAGS)) return "tools";
  return "web";
};

export const filterByPlatform = (
  projectList: Project[],
  platform: ProjectPlatform
): Project[] =>
  projectList.filter((project) => projectPlatform(project) === platform);

const TITLE = 4;
const TAGS = 3;
const STATUS = 2;
const DESCRIPTION = 1;

type IndexedProject = {
  project: Project;
  order: number;
  fields: { words: string[]; weight: number }[];
};

const indexProjects = (projectList: Project[]): IndexedProject[] =>
  projectList.map((project, order) => ({
    project,
    order,
    fields: [
      { words: wordsOf(project.title), weight: TITLE },
      { words: project.tags.flatMap(wordsOf), weight: TAGS },
      { words: wordsOf(project.status || "live"), weight: STATUS },
      { words: wordsOf(project.description), weight: DESCRIPTION },
    ],
  }));

export const searchProjects = (
  projectList: Project[],
  query: string
): Project[] => {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  const scored: { entry: IndexedProject; score: number }[] = [];

  for (const entry of indexProjects(projectList)) {
    let total = 0;
    let matchedEvery = true;

    for (const token of tokens) {
      let best = 0;
      for (const field of entry.fields) {
        best = Math.max(best, fieldScore(token, field.words, field.weight));
      }
      if (best === 0) {
        matchedEvery = false;
        break;
      }
      total += best;
    }

    if (matchedEvery) scored.push({ entry, score: total });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.order - b.entry.order)
    .map(({ entry }) => entry.project);
};

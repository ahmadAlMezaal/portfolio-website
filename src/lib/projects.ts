import type { Project, ProjectStatus } from "@/types";
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

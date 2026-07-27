import type { Project, ProjectStatus } from "@/types";

// Sort projects by: featured > live > in_progress > private (stable sort)
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

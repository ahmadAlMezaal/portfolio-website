import type { Variants } from "framer-motion";
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

export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

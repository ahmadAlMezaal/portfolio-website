"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { projects } from "@/lib/data";
import { searchProjects, sortProjects } from "@/lib/projects";
import {
  gridContainerVariants,
  cardVariants,
  useSectionInView,
} from "@/lib/motion";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectSearch } from "@/components/ProjectSearch";
import { SectionHeading } from "@/components/SectionHeading";

export const Projects = () => {
  const { ref, isInView } = useSectionInView();
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => sortProjects(projects), []);
  const featured = useMemo(
    () => sorted.filter((project) => project.featured),
    [sorted]
  );

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed ? searchProjects(sorted, trimmed) : []),
    [sorted, trimmed]
  );

  const isSearching = trimmed.length > 0;
  const railProjects = featured.length > 0 ? featured : sorted;

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={gridContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={cardVariants} className="text-center mb-8">
            <SectionHeading
              title="Featured Projects"
              subtitle="Some of my recent work that I'm proud of"
              cycle={3}
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <ProjectSearch
              value={query}
              onChange={setQuery}
              resultCount={isSearching ? results.length : null}
              totalCount={projects.length}
            />
          </motion.div>

          {isSearching ? (
            results.length > 0 ? (
              <motion.div
                key="results"
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {results.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    variant="compact"
                  />
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16 text-sm">
                No project matches{" "}
                <span className="text-[rgb(var(--accent-rgb))]">{trimmed}</span>
                .
              </p>
            )
          ) : (
            <ProjectCarousel
              projects={railProjects}
              remainingCount={projects.length - railProjects.length}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

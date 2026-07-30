"use client";

import { motion } from "motion/react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/data";
import type { ProjectStatus } from "@/types";
import { sortProjects } from "@/lib/projects";
import { gridContainerVariants } from "@/lib/motion";
import { ProjectCard } from "@/components/ProjectCard";
import { FilterPill } from "@/components/FilterPill";
import { SectionHeading } from "@/components/SectionHeading";

type FilterOption = "all" | ProjectStatus;

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "In Progress", value: "in_progress" },
  { label: "Private", value: "private" },
];

export const ProjectsShowcase = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const allProjectsSorted = useMemo(() => sortProjects(projects), []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return allProjectsSorted;
    return allProjectsSorted.filter(
      (p) => (p.status || "live") === activeFilter
    );
  }, [allProjectsSorted, activeFilter]);

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 mb-10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <SectionHeading
            title="All Projects"
            subtitle="A complete collection of my work"
            as="h1"
            cycle={2}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {FILTERS.map((filter) => (
            <FilterPill
              key={filter.value}
              label={filter.label}
              isActive={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            />
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <motion.div
            key={activeFilter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-16">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

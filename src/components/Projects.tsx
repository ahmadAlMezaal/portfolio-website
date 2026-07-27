"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";
import { sortProjects } from "@/lib/projects";
import { gridContainerVariants, cardVariants, useSectionInView } from "@/lib/motion";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";

// The home section shows only a glimpse; the full list lives at /projects.
const GLIMPSE_COUNT = 3;

export default function Projects() {
  const { ref, isInView } = useSectionInView();

  const glimpse = useMemo(
    () => sortProjects(projects).slice(0, GLIMPSE_COUNT),
    []
  );
  const hasMore = projects.length > glimpse.length;

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={gridContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={cardVariants} className="text-center mb-12">
            <SectionHeading
              title="Featured Projects"
              subtitle="Some of my recent work that I'm proud of"
              cycle={3}
            />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={gridContainerVariants}
          >
            {glimpse.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </motion.div>

          {hasMore && (
            <motion.div variants={cardVariants} className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                View all projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";
import { sortProjects, gridContainerVariants, cardVariants } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

// The home section shows only a glimpse; the full list lives at /projects.
const GLIMPSE_COUNT = 3;

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Some of my recent work that I&apos;m proud of
            </p>
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

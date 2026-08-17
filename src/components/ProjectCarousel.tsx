"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";
import { cardVariants, gridContainerVariants } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ProjectCard } from "@/components/ProjectCard";

const PRIORITY_COUNT = 4;
const CELL_CLASS =
  "snap-start shrink-0 basis-[86%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4.5rem)/4)]";

const SeeAllCard = ({ count }: { count: number }) => (
  <Link href="/projects" className="group block h-full">
    <div className="h-full flex flex-col gap-2 p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-[rgb(var(--accent-rgb)/0.07)] to-transparent group-hover:border-[rgb(var(--accent-rgb)/0.65)] group-hover:-translate-y-1.5 transition-all">
      <span className="text-xs text-[rgb(var(--accent-rgb))]">
        $ ls ~/projects
      </span>
      <span className="text-base font-bold text-gray-800 dark:text-white">
        {count} more {count === 1 ? "project" : "projects"}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Work in progress, side quests and the archive.
      </span>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-[rgb(var(--accent-rgb))]">
        See all
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </Link>
);

export const ProjectCarousel = ({
  projects,
  remainingCount,
}: {
  projects: Project[];
  remainingCount: number;
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    setPageCount(
      Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth - 0.02))
    );
    setActivePage(Math.round(rail.scrollLeft / rail.clientWidth));
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        sync();
      });
    };

    onScroll();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [sync]);

  const scrollToPage = (page: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollTo({
      left: page * rail.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const atStart = activePage <= 0;
  const atEnd = activePage >= pageCount - 1;

  return (
    <div>
      <motion.div
        ref={railRef}
        role="region"
        aria-label="Featured projects"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
        variants={gridContainerVariants}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            className={CELL_CLASS}
            variants={cardVariants}
          >
            <ProjectCard
              project={project}
              variant="compact"
              priority={index < PRIORITY_COUNT}
            />
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <motion.div className={CELL_CLASS} variants={cardVariants}>
            <SeeAllCard count={remainingCount} />
          </motion.div>
        )}
      </motion.div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => scrollToPage(activePage - 1)}
            disabled={atStart}
            aria-label="Previous projects"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-[rgb(var(--accent-rgb))] disabled:opacity-30 hover:border-[rgb(var(--accent-rgb)/0.7)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                onClick={() => scrollToPage(page)}
                aria-label={`Go to page ${page + 1}`}
                aria-current={page === activePage}
                className={`h-1 rounded-full transition-all ${
                  page === activePage
                    ? "w-7 bg-[rgb(var(--accent-rgb))]"
                    : "w-4 bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToPage(activePage + 1)}
            disabled={atEnd}
            aria-label="More projects"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-[rgb(var(--accent-rgb))] disabled:opacity-30 hover:border-[rgb(var(--accent-rgb)/0.7)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

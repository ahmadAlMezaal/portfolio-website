"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import {
  ExternalLink,
  Github,
  Star,
  Globe,
  FileText,
  Lock,
  Clock,
  Hammer,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import type { ProjectLinkType, Project, ProjectStatus } from "@/lib/data.types";
import { useIsMobile } from "@/lib/hooks";

// Custom brand icons (not available in lucide-react)
const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const AndroidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.523 15.341c-.5 0-.906-.406-.906-.906s.406-.906.906-.906.906.406.906.906-.406.906-.906.906zm-11.046 0c-.5 0-.906-.406-.906-.906s.406-.906.906-.906.906.406.906.906-.406.906-.906.906zm11.4-6.328l1.994-3.455a.416.416 0 00-.72-.416l-2.02 3.5a12.16 12.16 0 00-5.13-1.102c-1.85 0-3.58.398-5.131 1.102l-2.02-3.5a.416.416 0 00-.72.416l1.994 3.455C2.696 10.947.5 14.14.5 17.833h23c0-3.693-2.196-6.886-5.623-8.82zM.5 18.833v3.334c0 .92.746 1.666 1.667 1.666h1.666c.92 0 1.667-.746 1.667-1.666v-3.334H.5zm18 0v3.334c0 .92.746 1.666 1.667 1.666h1.666c.92 0 1.667-.746 1.667-1.666v-3.334H18.5z" />
  </svg>
);

// Icon mapping for project link types
const linkIcons: Record<
  ProjectLinkType,
  React.ComponentType<{ className?: string }>
> = {
  website: Globe,
  github: Github,
  appstore: AppleIcon,
  playstore: AndroidIcon,
  "case-study": FileText,
};

// Filter type
type FilterOption = "all" | ProjectStatus;

// Sort projects by: featured > live > in_progress > private (stable sort)
const sortProjects = (projectList: Project[]): Project[] => {
  const statusOrder: Record<ProjectStatus | "undefined", number> = {
    live: 1,
    in_progress: 2,
    private: 3,
    undefined: 1,
  };

  return [...projectList].sort((a, b) => {
    // Featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then by status
    const statusA = a.status || "live";
    const statusB = b.status || "live";
    const orderA = statusOrder[statusA] ?? statusOrder["undefined"];
    const orderB = statusOrder[statusB] ?? statusOrder["undefined"];

    return orderA - orderB;
  });
};

// Check if links should be hidden (private status or no links)
const shouldHideLinks = (project: Project): boolean => {
  return project.status === "private" || project.links.length === 0;
};

// Placeholder background component
const ProjectPlaceholder = ({ status }: { status: ProjectStatus }) => {
  if (status === "in_progress") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated diagonal stripes background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(251, 191, 36, 0.1) 10px,
              rgba(251, 191, 36, 0.1) 20px
            )`,
          }}
        />
        {/* Subtle icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Hammer className="w-16 h-16 text-amber-500/20" />
        </div>
      </div>
    );
  }

  if (status === "private") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Darker matte gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600/30 via-gray-700/25 to-gray-800/30" />
        {/* Subtle icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-16 h-16 text-gray-500/20" />
        </div>
      </div>
    );
  }

  // Default: "live" status
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Clean purple/pink/blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/15 to-blue-500/20" />
      {/* Mesh-style gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      {/* Subtle icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Layers className="w-16 h-16 text-purple-500/15" />
      </div>
    </div>
  );
};

// Filter pill component
const FilterPill = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${
        isActive
          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }
    `}
  >
    {label}
  </button>
);

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const isMobile = useIsMobile();

  // Featured projects for home page (max 3)
  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 3),
    []
  );

  // Sorted and filtered projects for "all" view
  const allProjectsSorted = useMemo(() => sortProjects(projects), []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return allProjectsSorted;
    return allProjectsSorted.filter(
      (p) => (p.status || "live") === activeFilter
    );
  }, [allProjectsSorted, activeFilter]);

  // Determine which projects to display
  const displayedProjects = showAll ? filteredProjects : featuredProjects;

  // Animation should play if: section is in view OR user has clicked show all
  const shouldAnimate = isInView || hasInteracted;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Reset filter when collapsing back to featured view
  const handleToggleShowAll = () => {
    setHasInteracted(true);
    if (showAll) {
      setActiveFilter("all"); // Reset filter when going back to featured
    }
    setShowAll(!showAll);
  };

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                {showAll ? "All Projects" : "Featured Projects"}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {showAll
                ? "A complete collection of my work"
                : "Some of my recent work that I'm proud of"}
            </p>
          </motion.div>

          {/* Filter Pills - only shown when viewing all projects */}
          {showAll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <FilterPill
                label="All"
                isActive={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              />
              <FilterPill
                label="Live"
                isActive={activeFilter === "live"}
                onClick={() => setActiveFilter("live")}
              />
              <FilterPill
                label="In Progress"
                isActive={activeFilter === "in_progress"}
                onClick={() => setActiveFilter("in_progress")}
              />
              <FilterPill
                label="Private"
                isActive={activeFilter === "private"}
                onClick={() => setActiveFilter("private")}
              />
            </motion.div>
          )}

          {/* Projects Grid - key forces re-animation when toggling */}
          <motion.div
            key={`${showAll ? "all" : "featured"}-${activeFilter}`}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedProjects.map((project) => {
              const hideLinks = shouldHideLinks(project);
              const imageFit = project.imageFit || "cover";

              return (
                <motion.div
                  key={project.title}
                  variants={itemVariants}
                  className="group relative"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                    {/* Project Image / Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10 overflow-hidden">
                      {/* Show actual image if available, otherwise show placeholder */}
                      {project.image ? (
                        <>
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className={
                              imageFit === "contain"
                                ? "object-contain p-6"
                                : "object-cover"
                            }
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            priority={project.featured}
                          />
                          {/* Unified dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15" />
                        </>
                      ) : (
                        <ProjectPlaceholder status={project.status || "live"} />
                      )}

                      {/* Badges - stacked in top-right */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            <Star className="w-3 h-3" />
                            Featured
                          </div>
                        )}

                        {/* Status badge - only for in_progress and private */}
                        {project.status === "in_progress" && (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
                            <Clock className="w-3 h-3" />
                            In Progress
                          </div>
                        )}
                        {project.status === "private" && (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
                            <Lock className="w-3 h-3" />
                            Private
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay with Links - Desktop only */}
                      {!isMobile && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-500/90 to-blue-500/90 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                        >
                          {!hideLinks ? (
                            // Render link buttons dynamically
                            project.links.map((link) => {
                              const IconComponent =
                                linkIcons[link.type] || ExternalLink;
                              return (
                                <motion.a
                                  key={`${link.type}-${link.url}`}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={link.label}
                                  className="p-3 bg-white rounded-full text-gray-800 hover:scale-110 transition-transform shadow-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </motion.a>
                              );
                            })
                          ) : (
                            // Private or no links - show "available on request"
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                              <Lock className="w-4 h-4" />
                              Available on request
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Mobile: Show link buttons inline */}
                      {isMobile && !hideLinks && project.links.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {project.links.map((link) => {
                            const IconComponent =
                              linkIcons[link.type] || ExternalLink;
                            return (
                              <a
                                key={`mobile-${link.type}-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white text-xs font-medium rounded-full shadow-md active:scale-95 transition-transform"
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* "Available on request" line for private/no links - shown below tags */}
                      {hideLinks && (
                        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                          <Lock className="w-3 h-3" />
                          Available on request
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Show More/Less Button - only show if there are non-featured projects */}
          {projects.length > featuredProjects.length && (
            <motion.div variants={itemVariants} className="text-center mt-12">
              <motion.button
                onClick={handleToggleShowAll}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAll ? "Show Less" : "View All Projects"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, MapPin, Calendar, CheckCircle2, TrendingUp, ExternalLink } from "lucide-react";
import { experiences } from "@/lib/data";
import type { Experience as ExperienceType, ExperienceRole } from "@/lib/data.types";

// Helper to check if experience has multiple roles
function hasMultipleRoles(exp: ExperienceType): exp is ExperienceType & { roles: ExperienceRole[] } {
  return Array.isArray(exp.roles) && exp.roles.length > 0;
}

// Helper to get the overall period for multi-role experiences
function getOverallPeriod(roles: ExperienceRole[]): string {
  if (roles.length === 0) return "";
  const lastRole = roles[roles.length - 1];
  const firstRole = roles[0];
  const startYear = lastRole.period.split(" - ")[0];
  const endYear = firstRole.period.split(" - ")[1] || "Present";
  return `${startYear} - ${endYear}`;
}

// Helper to calculate duration from period string (e.g., "Apr 2022 - Aug 2024")
function calculateDuration(period: string): string {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const parts = period.split(" - ");
  if (parts.length !== 2) return "";

  const parseDate = (dateStr: string): Date | null => {
    if (dateStr === "Present") {
      return new Date();
    }
    const [monthStr, yearStr] = dateStr.trim().split(" ");
    const month = months[monthStr];
    const year = parseInt(yearStr, 10);
    if (month === undefined || isNaN(year)) return null;
    return new Date(year, month);
  };

  const startDate = parseDate(parts[0]);
  const endDate = parseDate(parts[1]);

  if (!startDate || !endDate) return "";

  let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  totalMonths += endDate.getMonth() - startDate.getMonth();
  totalMonths += 1; // Include the start month (LinkedIn-style)
  totalMonths = Math.max(1, totalMonths); // At least 1 month

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (years === 0) {
    return `${remainingMonths} mo${remainingMonths !== 1 ? "s" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} yr${years !== 1 ? "s" : ""} ${remainingMonths} mo${remainingMonths !== 1 ? "s" : ""}`;
  }
}

// Company name component with optional link
function CompanyName({ name, url, isMultiRole }: { name: string; url?: string; isMultiRole: boolean }) {
  const baseClasses = isMultiRole
    ? "text-xl font-bold text-purple-600 dark:text-purple-400"
    : "text-purple-600 dark:text-purple-400 font-semibold";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} inline-flex items-center gap-1.5 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group/link`}
      >
        {name}
        <ExternalLink className="w-4 h-4 opacity-0 -translate-y-0.5 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-200" />
      </a>
    );
  }

  return <span className={baseClasses}>{name}</span>;
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Render a single role's content (achievements and description)
  const renderRoleContent = (
    role: { title: string; period: string; description: string; achievements: string[] },
    expIndex: number,
    roleIndex: number = 0,
    isMultiRole: boolean = false
  ) => {
    const duration = calculateDuration(role.period);

    return (
      <div className={isMultiRole ? "pl-4 border-l-2 border-purple-500/30 ml-1" : ""}>
        {isMultiRole && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 -ml-[21px]" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {role.title}
            </h4>
          </div>
        )}
        {isMultiRole && (
          <div className="flex items-center gap-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{role.period}</span>
            {duration && (
              <span className="text-gray-400 dark:text-gray-500">· {duration}</span>
            )}
          </div>
        )}
        <p className={`text-gray-700 dark:text-gray-300 ${isMultiRole ? "text-sm mb-3" : "mb-4"}`}>
          {role.description}
        </p>
        <div className="space-y-2">
          {role.achievements.map((achievement, achIndex) => (
            <motion.div
              key={achIndex}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + expIndex * 0.2 + roleIndex * 0.15 + achIndex * 0.1 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {achievement}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-[#132238]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Work Experience
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My professional journey and career highlights
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-500 to-blue-500 transform md:-translate-x-1/2" />

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const isMultiRole = hasMultipleRoles(exp);
                const displayPeriod = isMultiRole
                  ? getOverallPeriod(exp.roles!)
                  : exp.period || "";
                const totalDuration = calculateDuration(displayPeriod);

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Timeline Dot */}
                    <motion.div
                      className="absolute left-0 md:left-1/2 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transform -translate-x-1/2 border-4 border-white dark:border-[#0d1b2a]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.2 }}
                    />

                    {/* Content */}
                    <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                      <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative group hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-colors duration-300"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Subtle glow on hover */}
                        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />

                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shrink-0">
                            {isMultiRole ? (
                              <TrendingUp className="w-6 h-6" />
                            ) : (
                              <Briefcase className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            {isMultiRole ? (
                              <>
                                <CompanyName name={exp.company} url={exp.companyUrl} isMultiRole={true} />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {exp.roles!.length} roles · Career progression
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                                  {exp.title}
                                </h3>
                                <CompanyName name={exp.company} url={exp.companyUrl} isMultiRole={false} />
                              </>
                            )}
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{displayPeriod}</span>
                            {totalDuration && (
                              <span className="text-gray-400 dark:text-gray-500">· {totalDuration}</span>
                            )}
                          </div>
                        </div>

                        {/* Content - Single Role vs Multiple Roles */}
                        {isMultiRole ? (
                          <div className="space-y-6">
                            {exp.roles!.map((role, roleIndex) => (
                              <div key={roleIndex}>
                                {renderRoleContent(role, index, roleIndex, true)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          renderRoleContent(
                            {
                              title: exp.title || "",
                              period: exp.period || "",
                              description: exp.description || "",
                              achievements: exp.achievements || [],
                            },
                            index,
                            0,
                            false
                          )
                        )}
                      </motion.div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

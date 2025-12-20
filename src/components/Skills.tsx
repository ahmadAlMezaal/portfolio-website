"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Server, Wrench } from "lucide-react";
import dynamic from "next/dynamic";
import { skills } from "@/lib/data";
import { useShouldReduceMotion } from "@/lib/hooks";

// Dynamically import 3D background (no SSR)
const Section3DBackground = dynamic(() => import("./Section3DBackground"), {
  ssr: false,
  loading: () => null,
});

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="w-6 h-6" />,
  Backend: <Server className="w-6 h-6" />,
  "Tools & Others": <Wrench className="w-6 h-6" />,
  "Backend & Data": <Server className="w-6 h-6" />,
  "Cloud & DevOps": <Wrench className="w-6 h-6" />,
  "Frontend & Mobile": <Code2 className="w-6 h-6" />,
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useShouldReduceMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="relative py-20 overflow-hidden">
      {/* 3D Background - only on desktop */}
      {!shouldReduceMotion && <Section3DBackground type="nodes" />}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Skills & Expertise
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                variants={itemVariants}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                  initial={false}
                />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 h-full">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
                      {categoryIcons[category.category]}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {category.category}
                    </h3>
                  </div>

                  {/* Skills List */}
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill, skillIndex) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          delay: 0.3 + categoryIndex * 0.1 + skillIndex * 0.05,
                        }}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-500 hover:to-blue-500 hover:text-white transition-all duration-300"
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

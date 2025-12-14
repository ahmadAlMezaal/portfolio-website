"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Briefcase, GraduationCap, Heart, Code2, Database, Cloud, Terminal } from "lucide-react";
import { personalInfo, stats } from "@/lib/data";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  // Get initials from name
  const initials = personalInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const letterVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  const floatingIcons = [
    { Icon: Code2, color: "text-purple-500", position: "top-4 right-4", delay: 0 },
    { Icon: Database, color: "text-pink-500", position: "top-1/4 -right-2", delay: 0.5 },
    { Icon: Cloud, color: "text-blue-500", position: "bottom-1/4 -right-2", delay: 1 },
    { Icon: Terminal, color: "text-green-500", position: "bottom-4 right-4", delay: 1.5 },
    { Icon: Briefcase, color: "text-purple-600", position: "top-4 left-4", delay: 0.25 },
    { Icon: GraduationCap, color: "text-pink-500", position: "top-1/4 -left-2", delay: 0.75 },
    { Icon: Heart, color: "text-red-500", position: "bottom-1/4 -left-2", delay: 1.25 },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-[#132238]/50">
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
                About Me
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get to know me better - my background, passions, and what drives me
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Animated Initials Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative w-80 h-80 mx-auto">
                {/* Outer rotating ring with dots */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-500 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 45}deg) translateX(158px) translateY(-50%)`,
                      }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                    />
                  ))}
                </motion.div>

                {/* Middle ring */}
                <motion.div
                  className="absolute inset-6 rounded-full border-2 border-pink-500/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner ring with glow */}
                <motion.div
                  className="absolute inset-12 rounded-full border-2 border-blue-500/30"
                  animate={{ rotate: 360, scale: [1, 1.02, 1] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                {/* Pulsing glow behind initials */}
                <motion.div
                  className="absolute inset-16 rounded-full bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-500/20 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Main initials container */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-1 shadow-2xl shadow-purple-500/25">
                  <div className="w-full h-full rounded-full bg-gray-100 dark:bg-[#0d1b2a] flex items-center justify-center overflow-hidden">
                    {/* Animated initials */}
                    <div className="flex items-center justify-center perspective-1000">
                      {initials.split("").map((letter, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={letterVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                          className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent inline-block"
                          style={{ transformStyle: "preserve-3d" }}
                          whileHover={{
                            scale: 1.2,
                            rotateY: 15,
                            transition: { duration: 0.2 }
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </div>
                </div>

                {/* Floating tech icons around the circle */}
                {floatingIcons.map(({ Icon, color, position, delay }, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${position} p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? {
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                    } : {}}
                    transition={{
                      opacity: { delay: 0.5 + delay, duration: 0.3 },
                      scale: { delay: 0.5 + delay, duration: 0.3 },
                      y: { delay: 0.8 + delay, duration: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </motion.div>
                ))}

                {/* Orbiting particle */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                  style={{ top: "50%", left: "50%" }}
                  animate={{
                    rotate: 360,
                    x: [0, 140, 0, -140, 0],
                    y: [-140, 0, 140, 0, -140],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Second orbiting particle (opposite direction) */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50"
                  style={{ top: "50%", left: "50%" }}
                  animate={{
                    rotate: -360,
                    x: [0, -120, 0, 120, 0],
                    y: [120, 0, -120, 0, 120],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span>{personalInfo.location}</span>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {personalInfo.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

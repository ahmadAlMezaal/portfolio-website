"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { personalInfo, roles } from "@/lib/data";
import { assetPath, isCvAvailable } from "@/lib/utils";
import HeroBackground from "./HeroBackground";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentRole.length) {
            setDisplayText(currentRole.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentRole.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark vignette so the headline stays legible over the code-rain */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(5,8,6,0.6),transparent_78%)]" />

      {/* Animated CSS background (drifting gradient orbs + dot grid).
          Motion is disabled automatically under prefers-reduced-motion. */}
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Terminal window introducing me (replaces the giant repeated name) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-10 text-left rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-purple-500/10 overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gray-800/60">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-gray-400">ahmad@portfolio: ~</span>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 space-y-1.5">
              <p className="text-sm sm:text-base">
                <span className="text-gray-500">$</span>{" "}
                <span className="text-purple-400">whoami</span>
              </p>
              <p className="text-3xl sm:text-5xl font-bold font-display tracking-tight pb-2">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </p>

              <p className="text-sm sm:text-base pt-2">
                <span className="text-gray-500">$</span>{" "}
                <span className="text-purple-400">cat</span>{" "}
                <span className="text-gray-400">role.txt</span>
              </p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-200 h-8 sm:h-9">
                <span>{displayText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-[0.55ch] h-5 sm:h-6 ml-0.5 -mb-0.5 bg-purple-400 align-middle"
                />
              </p>

              <p className="text-sm sm:text-base pt-2">
                <span className="text-gray-500">$</span>{" "}
                <span className="text-purple-400">echo</span>{" "}
                <span className="text-gray-400">$MISSION</span>
              </p>
              <p className="text-sm sm:text-base text-gray-400">
                {personalInfo.tagline}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#contact"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-full overflow-hidden shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Mail size={20} />
                Contact Me
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            {isCvAvailable() && (
              <motion.a
                href={assetPath(personalInfo.resumeUrl)}
                download
                className="group px-8 py-4 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-semibold rounded-full hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                Download CV
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <ArrowDown size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

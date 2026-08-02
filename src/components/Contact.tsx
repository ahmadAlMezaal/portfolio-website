"use client";

import { motion } from "motion/react";
import { Mail, MessageSquare, Calendar } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { socialIconMap, socialLabelMap } from "@/lib/social";
import { useShouldReduceMotion } from "@/lib/hooks";
import { AvailabilityPanel } from "./AvailabilityPanel";
import { SectionBackground } from "./SectionBackground";
import { DecodeText } from "./DecodeText";
import { SectionHeading } from "./SectionHeading";
import { openContactModal } from "./shortcutsBus";
import { sectionContainerVariants, sectionItemVariants, useSectionInView } from "@/lib/motion";

export const Contact = () => {
  const { ref, isInView } = useSectionInView();
  const shouldReduceMotion = useShouldReduceMotion();

  const socialLinks = personalInfo.socialLinks.map((link) => ({
    icon: socialIconMap[link.platform],
    href: link.url,
    label: socialLabelMap[link.platform],
  }));

  return (
    <section id="contact" className="relative py-20 section-tint overflow-hidden">
      {!shouldReduceMotion && <SectionBackground type="wave" />}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={sectionContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={sectionItemVariants} className="text-center mb-16">
            <SectionHeading
              title="Get In Touch"
              subtitle="Have a project in mind? Let's work together to bring your ideas to life"
              cycle={1}
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={sectionItemVariants} className="space-y-8">
              <AvailabilityPanel />

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Connect with me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500 transition-all"
                      whileHover={{ y: -5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {personalInfo.helpWith && personalInfo.helpWith.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    What I can help with
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.helpWith.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1.5 rounded-lg font-mono text-sm border border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.1)] text-[rgb(var(--accent-rgb))]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={sectionItemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Start a conversation
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Tell me what you&apos;re building. The form fills in your email
                  client &mdash; nothing is sent through this site.
                </p>

                <div className="space-y-3">
                  <motion.button
                    type="button"
                    onClick={openContactModal}
                    aria-haspopup="dialog"
                    className="glitch-box w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="w-5 h-5" />
                    <DecodeText className="glitch-text" text="Send me a Message" />
                  </motion.button>

                  {personalInfo.bookingUrl && (
                    <motion.a
                      href={personalInfo.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="w-5 h-5" />
                      Book a Chat
                    </motion.a>
                  )}
                </div>

                <div className="mt-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-[rgb(var(--accent-rgb))]">$</span> awaiting input
                  <span className="ml-1 inline-block h-3.5 w-2 align-middle bg-[rgb(var(--accent-rgb))] motion-safe:animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

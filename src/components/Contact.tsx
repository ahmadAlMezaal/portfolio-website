"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Eye,
  Send,
  MapPin,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { personalInfo } from "@/lib/data";
import { socialIconMap, socialLabelMap } from "@/lib/social";
import { useShouldReduceMotion, useClipboard } from "@/lib/hooks";
import SectionBackground from "./SectionBackground";
import DecodeText from "./DecodeText";
import SectionHeading from "./SectionHeading";
import { sectionContainerVariants, sectionItemVariants, useSectionInView } from "@/lib/motion";

const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return "•••••••";
  const maskedLocal = (local[0] ?? "") + "•".repeat(Math.max(4, local.length - 1));
  const dot = domain.lastIndexOf(".");
  const tld = dot >= 0 ? domain.slice(dot) : "";
  const maskedDomain = "•".repeat(Math.max(4, dot >= 0 ? dot : domain.length)) + tld;
  return `${maskedLocal}@${maskedDomain}`;
};

const Contact = () => {
  const { ref, isInView } = useSectionInView();
  const shouldReduceMotion = useShouldReduceMotion();
  const { copied, copy } = useClipboard();
  const [revealed, setRevealed] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent("Portfolio Enquiry");
    const body = encodeURIComponent(
      `Hi ${personalInfo.name.split(" ")[0]},\n\n${formState.message}\n\n---\nFrom: ${formState.name}\nEmail: ${formState.email}`
    );

    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

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

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={sectionItemVariants} className="space-y-8">
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {personalInfo.location}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => (revealed ? copy(personalInfo.email) : setRevealed(true))}
                  className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-left transition-colors hover:border-purple-500 dark:hover:border-purple-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={
                    copied
                      ? "Email copied to clipboard"
                      : revealed
                        ? "Copy email address"
                        : "Reveal email address"
                  }
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                    {copied ? (
                      <Check className="w-6 h-6" />
                    ) : revealed ? (
                      <Copy className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {copied
                        ? "Email"
                        : revealed
                          ? "Email · click to copy"
                          : "Email · click to reveal"}
                    </p>
                    <p
                      className={`font-mono truncate transition-colors ${
                        copied
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {copied
                        ? "$ copied to clipboard ✓"
                        : revealed
                          ? personalInfo.email
                          : maskEmail(personalInfo.email)}
                    </p>
                  </div>
                </motion.button>
              </div>

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
            </motion.div>

            <motion.div variants={sectionItemVariants}>
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Send me a message
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Fill in the details below and click to open your email client
                </p>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Hi, I'd like to discuss a project..."
                    />
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      type="submit"
                      className="glitch-box w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail className="w-5 h-5" />
                      <DecodeText
                        className="glitch-text"
                        text="Open Email Client"
                      />
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
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

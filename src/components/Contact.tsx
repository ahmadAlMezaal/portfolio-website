"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Mail,
  Send,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  MessageSquare,
  Calendar,
  Youtube,
  Instagram,
  Facebook,
  Dribbble,
  Codepen,
  type LucideIcon,
} from "lucide-react";
import { personalInfo, education, certifications } from "@/lib/data";
import type { SocialPlatform } from "@/lib/data.types";

// Custom icons for platforms not in Lucide
const MediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.546.905 2.414 2.607 2.414 1.013 0 1.79-.383 2.087-1.165h3.062zM15.97 12.69h5.098c-.09-1.133-.696-1.997-2.418-1.997-1.39 0-2.421.818-2.68 1.997zm-10.5 5.31H0v-14h6.008c3.098 0 4.882 1.178 4.882 4.025 0 1.593-.723 2.81-2.155 3.404v.047c1.752.354 2.725 1.67 2.725 3.482 0 2.847-2.029 3.042-5.49 3.042zm.714-12.25H2.44v3.886h3.19c1.596 0 2.758-.369 2.758-2.043 0-1.467-.859-1.843-2.204-1.843zm.113 5.493H2.44v4.344h4.092c1.475 0 2.356-.549 2.356-2.073 0-1.673-1.088-2.271-2.591-2.271z"/>
  </svg>
);

const StackOverflowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 11.195v-8h-12v8h12z"/>
  </svg>
);

const DevToIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.84-.23.21-.16.31-.45.31-.87v-2.17c0-.42-.1-.7-.31-.86zm.09 2.89c0 .19-.08.3-.2.36s-.3.09-.5.09h-.09v-2.8h.09c.21 0 .38.02.5.08s.19.17.2.36v1.91zM9.7 10.05c-.18-.16-.46-.23-.84-.23H8.28v4.36h.58c.37 0 .65-.08.84-.23.21-.16.31-.45.31-.87v-2.17c0-.42-.1-.7-.31-.86zm.09 2.89c0 .19-.08.3-.2.36s-.3.09-.5.09h-.09v-2.8h.09c.21 0 .38.02.5.08s.19.17.2.36v1.91z"/>
    <path d="M0 4.2V19.8h24V4.2H0zm5.5 9.82c0 .53-.18.95-.53 1.26s-.82.46-1.4.46h-1.6V8.26h1.6c.59 0 1.06.15 1.4.46.36.31.53.73.53 1.26v4.04zm4.08.66c-.37.31-.87.46-1.5.46h-1.6V8.26h1.6c.63 0 1.13.15 1.5.46.38.31.56.75.56 1.32v3.32c0 .57-.18 1.01-.56 1.32zm6.38-4.92h-2.22v1.66h1.34v1.38h-1.34v1.68h2.22v1.38h-3.6V8.26h3.6v1.5z"/>
  </svg>
);

// Map platform names to their icons
const socialIconMap: Record<SocialPlatform, LucideIcon | React.FC<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  medium: MediumIcon,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  dribbble: Dribbble,
  behance: BehanceIcon,
  stackoverflow: StackOverflowIcon,
  codepen: Codepen,
  dev: DevToIcon,
};

// Map platform names to display labels
const socialLabelMap: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  medium: "Medium",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  dribbble: "Dribbble",
  behance: "Behance",
  stackoverflow: "Stack Overflow",
  codepen: "CodePen",
  dev: "Dev.to",
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent("Portfolio Enquiry");
    const body = encodeURIComponent(
      `Hi Ahmad,\n\n${formState.message}\n\n---\nFrom: ${formState.name}\nEmail: ${formState.email}`
    );

    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

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

  const socialLinks = personalInfo.socialLinks.map((link) => ({
    icon: socialIconMap[link.platform],
    href: link.url,
    label: socialLabelMap[link.platform],
  }));

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800/50">
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
                Get In Touch
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? Let's work together to bring your ideas to life
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Quick Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 group hover:border-purple-500 transition-colors overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-800 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {personalInfo.email}
                    </p>
                  </div>
                </motion.a>

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
              </div>

              {/* Social Links */}
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

              {/* Education & Certifications */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Education
                  </h3>
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-purple-600 dark:text-purple-400">{edu.school}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium border border-purple-500/20"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
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
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail className="w-5 h-5" />
                      Open Email Client
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
}

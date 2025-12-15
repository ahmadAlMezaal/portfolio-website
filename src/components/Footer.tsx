"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Dribbble,
  Codepen,
  type LucideIcon,
} from "lucide-react";
import { personalInfo, navLinks } from "@/lib/data";
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

export default function Footer() {
  const socialLinks = personalInfo.socialLinks.map((link) => ({
    icon: socialIconMap[link.platform],
    href: link.url,
    label: socialLabelMap[link.platform],
  }));

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <motion.a
              href="#"
              className="inline-block text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {personalInfo.name.split(" ")[0]}
            </motion.a>
            <p className="text-gray-400 max-w-xs">
              {personalInfo.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {personalInfo.status}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              {personalInfo.email}
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
            <span className="text-purple-400">Claude</span>
          </p>

          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

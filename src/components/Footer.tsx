"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { personalInfo, navLinks } from "@/lib/data";
import NavAnchor from "./NavAnchor";
import { socialIconMap, socialLabelMap } from "@/lib/social";
import { useIsMobile } from "@/lib/hooks";

export default function Footer() {
  const isMobile = useIsMobile();
  const socialLinks = personalInfo.socialLinks.map((link) => ({
    icon: socialIconMap[link.platform],
    href: link.url,
    label: socialLabelMap[link.platform],
  }));

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <NavAnchor
              href="#"
              className="inline-block text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-purple-400">~/</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {personalInfo.name.split(" ")[0].toLowerCase()}
              </span>
            </NavAnchor>
            <p className="text-gray-400 max-w-xs">
              {personalInfo.tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="relative flex h-2 w-2">
                {!isMobile && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {personalInfo.status}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavAnchor
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </NavAnchor>
                </li>
              ))}
            </ul>
          </div>

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
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

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

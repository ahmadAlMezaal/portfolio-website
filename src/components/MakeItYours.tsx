"use client";

import { motion } from "motion/react";
import { Check, Copy, Github } from "lucide-react";
import { siteMetadata } from "@/lib/data";
import { useClipboard } from "@/lib/hooks";

export const MakeItYours = () => {
  const { copied, copy } = useClipboard();
  const repoUrl = siteMetadata.repoUrl;

  if (!repoUrl) return null;

  const cloneCommand = `git clone ${repoUrl}.git`;

  return (
    <div className="rounded-2xl border border-[rgb(var(--accent-rgb)/0.25)] bg-[rgb(var(--accent-rgb)/0.04)] p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white">
            Like this site? Make it yours.
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            It is open source. Fork it, point it at your own content, and ship
            it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2">
            <code className="flex-1 min-w-0 truncate font-mono text-xs text-[rgb(var(--accent-rgb))]">
              <span className="text-gray-500">$ </span>
              {cloneCommand}
            </code>
            <motion.button
              type="button"
              onClick={() => copy(cloneCommand)}
              whileTap={{ scale: 0.9 }}
              aria-label={copied ? "Copied" : "Copy clone command"}
              className="shrink-0 text-gray-400 hover:text-[rgb(var(--accent-rgb))] transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[rgb(var(--accent-rgb))]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          <motion.a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg"
          >
            <Github className="w-4 h-4" />
            Fork on GitHub
          </motion.a>
        </div>
      </div>
    </div>
  );
};

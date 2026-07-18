"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { onOpenShortcuts } from "./shortcutsBus";

type Shortcut = { keys: string[]; label: string };

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["Ctrl", "K"], label: "Command palette (Windows/Linux)" },
  { keys: ["T"], label: "Cycle color theme" },
  { keys: ["?"], label: "Show this cheatsheet" },
  { keys: ["Esc"], label: "Close any dialog" },
  {
    keys: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"],
    label: "there's a secret…",
  },
];

function isTyping(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  return (
    !!node &&
    (node.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName))
  );
}

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  // "?" opens the cheatsheet (Shift+/ on most layouts).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => onOpenShortcuts(() => setOpen(true)), []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-3">
              <h2 className="font-mono text-sm text-gray-800 dark:text-white">
                <span className="text-purple-500">$</span> keybindings
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {s.label}
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="min-w-[1.6rem] rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 text-center text-[11px] font-mono text-gray-600 dark:text-gray-300"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-2 text-[10px] font-mono text-gray-400">
              press{" "}
              <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5">?</kbd>{" "}
              anytime to toggle
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

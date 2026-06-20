"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { THEMES, useTheme, type Theme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  const choose = (id: Theme) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Palette className="w-5 h-5 text-purple-400" />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: active.swatch, boxShadow: `0 0 8px ${active.swatch}` }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-44 p-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50"
          >
            {THEMES.map((t) => {
              const isActive = t.id === theme;
              return (
                <li key={t.id}>
                  <button
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => choose(t.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: t.swatch, boxShadow: `0 0 8px ${t.swatch}` }}
                    />
                    <span className="flex-1">{t.label}</span>
                    {isActive && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

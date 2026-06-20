"use client";

import { motion } from "framer-motion";
import { THEMES, useTheme } from "./ThemeProvider";

// Always-visible segmented swatch control — pick a skin in one click.
// The active swatch glows and a shared pill slides under it (layoutId).
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-0.5 p-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      {THEMES.map((t) => {
        const isActive = t.id === theme;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isActive}
            aria-label={t.label}
            title={t.label}
            onClick={() => setTheme(t.id)}
            className="relative flex items-center justify-center w-7 h-7 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            style={{ ["--tw-ring-color" as string]: t.swatch }}
          >
            {isActive && (
              <motion.span
                layoutId="theme-active-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1.5px solid ${t.swatch}`,
                  boxShadow: `0 0 10px ${t.swatch}66, inset 0 0 8px ${t.swatch}33`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="rounded-full transition-all"
              style={{
                width: isActive ? 11 : 9,
                height: isActive ? 11 : 9,
                backgroundColor: t.swatch,
                opacity: isActive ? 1 : 0.55,
                boxShadow: isActive ? `0 0 10px ${t.swatch}` : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { THEMES, useTheme } from "./ThemeProvider";

// Always-visible segmented control — each skin shows its swatch + name so it's
// clear what you're switching to. The active segment glows and a shared pill
// slides under it (layoutId). `labels="always"` forces names (mobile menu);
// the default hides them below sm to fit the top bar.
export default function ThemeSwitcher({
  labels = "responsive",
}: {
  labels?: "responsive" | "always";
}) {
  const { theme, setTheme } = useTheme();
  const labelClass =
    labels === "always" ? "inline" : "hidden sm:inline";

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
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            style={{ ["--tw-ring-color" as string]: t.swatch }}
          >
            {isActive && (
              <motion.span
                layoutId="theme-active-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1.5px solid ${t.swatch}`,
                  boxShadow: `0 0 10px ${t.swatch}55, inset 0 0 8px ${t.swatch}22`,
                  backgroundColor: `${t.swatch}14`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="relative rounded-full transition-all"
              style={{
                width: 9,
                height: 9,
                backgroundColor: t.swatch,
                opacity: isActive ? 1 : 0.55,
                boxShadow: isActive ? `0 0 8px ${t.swatch}` : "none",
              }}
            />
            <span
              className={`relative text-xs font-medium ${labelClass} ${
                isActive ? "" : "text-gray-500 dark:text-gray-400"
              }`}
              style={isActive ? { color: t.swatch } : undefined}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { THEMES, useTheme } from "./ThemeProvider";

// inline: bare list (mobile menu). floating: gear pinned bottom-right, menu opens upward.
export default function ThemeSwitcher({
  variant = "menu",
}: {
  variant?: "menu" | "inline" | "floating";
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // "T" cycles themes, unless typing in a field or holding a modifier.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() !== "t") return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
      ) {
        return;
      }
      e.preventDefault();
      const i = THEMES.findIndex((t) => t.id === theme);
      setTheme(THEMES[(i + 1) % THEMES.length].id);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const optionList = (
    <div role="radiogroup" aria-label="Color theme" className="flex flex-col gap-0.5">
      {THEMES.map((t) => {
        const isActive = t.id === theme;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isActive}
            aria-label={t.label}
            onClick={() => {
              setTheme(t.id);
              setOpen(false);
            }}
            className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-left outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            style={{ ["--tw-ring-color" as string]: t.swatch }}
          >
            <span
              className="rounded-full transition-all"
              style={{
                width: 10,
                height: 10,
                backgroundColor: t.swatch,
                opacity: isActive ? 1 : 0.55,
                boxShadow: isActive ? `0 0 8px ${t.swatch}` : "none",
              }}
            />
            <span
              className="text-sm font-medium"
              style={
                isActive
                  ? { color: t.swatch }
                  : undefined
              }
            >
              {t.label}
            </span>
            {isActive && (
              <span
                className="ml-auto text-xs font-mono"
                style={{ color: t.swatch }}
              >
                {"<"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (variant === "inline") {
    return optionList;
  }

  const floating = variant === "floating";
  const buttonSize = floating ? "h-12 w-12" : "h-9 w-9";
  const iconSize = floating ? 22 : 18;
  const menuPosition = floating
    ? "bottom-full right-0 mb-3 origin-bottom-right"
    : "right-0 mt-2 origin-top-right";
  const menuEnterY = floating ? 6 : -6;

  return (
    <div
      ref={rootRef}
      className={floating ? "fixed bottom-[5.5rem] right-6 z-50" : "relative"}
    >
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch theme (press T to cycle)"
        title="Switch theme (press T to cycle)"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center ${buttonSize} rounded-full bg-gray-100 dark:bg-gray-800 border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
          floating ? "backdrop-blur-lg" : ""
        }`}
        style={{
          borderColor: `${active.swatch}55`,
          boxShadow: floating
            ? `0 4px 20px ${active.swatch}44, 0 0 10px ${active.swatch}33`
            : `0 0 10px ${active.swatch}33`,
          color: active.swatch,
          ["--tw-ring-color" as string]: active.swatch,
        }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ rotate: { duration: 14, ease: "linear", repeat: Infinity } }}
          className="flex"
        >
          <Settings size={iconSize} strokeWidth={2} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: menuEnterY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: menuEnterY, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute w-44 p-1.5 rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl z-50 ${menuPosition}`}
          >
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {"// theme"}
            </p>
            {optionList}
            <p className="px-3 pt-1.5 pb-1 text-[10px] font-mono text-gray-400 dark:text-gray-500">
              press{" "}
              <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                T
              </kbd>{" "}
              to cycle
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

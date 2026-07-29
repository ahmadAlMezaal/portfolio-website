"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { useFullscreen } from "@/lib/hooks";
import { isTyping } from "@/lib/utils";
import { THEMES, useTheme } from "./ThemeProvider";

export default function FullscreenToggle() {
  const { isFullscreen, supported, toggle } = useFullscreen();
  const { theme } = useTheme();

  const accent = (THEMES.find((t) => t.id === theme) ?? THEMES[0]).swatch;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "f" || e.altKey || isTyping(e.target)) return;

      const bare = !e.metaKey && !e.ctrlKey && !e.shiftKey;
      const combo = (e.metaKey || e.ctrlKey) && e.shiftKey;
      if (!bare && !combo) return;

      e.preventDefault();
      toggle();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  if (!supported) return null;

  const label = isFullscreen ? "Exit fullscreen (F)" : "Go fullscreen (F)";

  return (
    <motion.button
      onClick={toggle}
      aria-label={label}
      aria-pressed={isFullscreen}
      title={label}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-[9.5rem] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border backdrop-blur-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 4px 20px ${accent}44, 0 0 10px ${accent}33`,
        color: accent,
        ["--tw-ring-color" as string]: accent,
      }}
    >
      {isFullscreen ? (
        <Minimize2 size={22} strokeWidth={2} />
      ) : (
        <Maximize2 size={22} strokeWidth={2} />
      )}
    </motion.button>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useFullscreen, useScrollPosition } from "@/lib/hooks";
import { isTyping } from "@/lib/utils";
import { openCommandPalette, openShortcuts } from "./shortcutsBus";

const accent = { color: "rgb(var(--accent-rgb))" };

const Hint = ({
  keys,
  label,
  onClick,
}: {
  keys: string;
  label: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded px-1.5 py-1 outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5"
    >
      <kbd
        className="rounded border border-current/30 px-1.5 py-0.5 text-[12px] leading-none opacity-80 transition-opacity group-hover:opacity-100"
        style={accent}
      >
        {keys}
      </kbd>
      <span className="text-gray-500 transition-colors group-hover:text-gray-300">
        {label}
      </span>
    </button>
  );
};

const StatusBar = () => {
  const { isFullscreen, supported, toggle } = useFullscreen();
  const scrolled = useScrollPosition(220);
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);

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

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("section[id]")];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setSection(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  const path =
    pathname === "/" ? (section ? `~/${section}` : "~") : `~${pathname}`;

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-white/5 bg-black/40 backdrop-blur-md md:block"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 font-mono text-[13px] sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Hint keys="⌘K" label="commands" onClick={openCommandPalette} />
              {supported && (
                <Hint
                  keys="F"
                  label={isFullscreen ? "exit fullscreen" : "fullscreen"}
                  onClick={toggle}
                />
              )}
              <Hint keys="?" label="keys" onClick={openShortcuts} />
            </div>

            <span className="flex items-center gap-1.5 text-gray-500">
              <span style={accent}>{"$"}</span>
              {path}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusBar;

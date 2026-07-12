"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  Download,
  Copy,
  Keyboard,
  ExternalLink,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { navLinks, personalInfo } from "@/lib/data";
import { assetPath, isCvAvailable } from "@/lib/utils";
import { useClipboard } from "@/lib/hooks";
import { THEMES, useTheme } from "./ThemeProvider";
import { openShortcuts } from "./shortcutsBus";

type Group = "Navigation" | "Theme" | "Actions" | "Social";
const GROUP_ORDER: Group[] = ["Navigation", "Theme", "Actions", "Social"];

type Command = {
  id: string;
  label: string;
  group: Group;
  icon: ReactNode;
  keywords?: string;
  hint?: string;
  perform: () => void;
  feedback?: string; // brief confirmation shown before closing
};

// Subsequence fuzzy score. Returns 0 when not all query chars are present.
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 1;
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      streak++;
      score += streak + (ti === 0 ? 6 : 0);
      qi++;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : 0;
}

const NAV_ICONS: Record<string, ReactNode> = {
  "#about": <User size={16} />,
  "#skills": <Code2 size={16} />,
  "#projects": <FolderGit2 size={16} />,
  "#contact": <Mail size={16} />,
};

function scrollToHash(hash: string) {
  if (hash === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}

function socialLabel(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export default function CommandPalette() {
  const { theme, setTheme } = useTheme();
  const { copy } = useClipboard();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const cmds: Command[] = [
      {
        id: "nav-top",
        label: "Go to Top",
        group: "Navigation",
        icon: <Home size={16} />,
        keywords: "home hero start",
        perform: () => scrollToHash("#top"),
      },
      ...navLinks.map((link) => ({
        id: `nav-${link.href}`,
        label: `Go to ${link.name}`,
        group: "Navigation" as const,
        icon: NAV_ICONS[link.href] ?? <Home size={16} />,
        keywords: link.name,
        perform: () => scrollToHash(link.href),
      })),
      ...THEMES.map((t) => ({
        id: `theme-${t.id}`,
        label: `Theme: ${t.label}`,
        group: "Theme" as const,
        icon: (
          <span
            className="inline-block rounded-full"
            style={{
              width: 12,
              height: 12,
              backgroundColor: t.swatch,
              boxShadow: `0 0 6px ${t.swatch}`,
            }}
          />
        ),
        keywords: `skin color ${t.label}`,
        hint: t.id === theme ? "active" : undefined,
        perform: () => setTheme(t.id),
      })),
      {
        id: "action-copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: <Copy size={16} />,
        keywords: `mail ${personalInfo.email}`,
        perform: () => copy(personalInfo.email),
        feedback: "$ copied to clipboard ✓",
      },
      {
        id: "action-shortcuts",
        label: "Keyboard shortcuts",
        group: "Actions",
        icon: <Keyboard size={16} />,
        keywords: "help keys cheatsheet",
        hint: "?",
        perform: () => openShortcuts(),
      },
    ];

    if (isCvAvailable()) {
      cmds.push({
        id: "action-cv",
        label: "Download CV",
        group: "Actions",
        icon: <Download size={16} />,
        keywords: "resume pdf",
        perform: () => {
          const a = document.createElement("a");
          a.href = assetPath(personalInfo.resumeUrl);
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      });
    }

    for (const link of personalInfo.socialLinks) {
      cmds.push({
        id: `social-${link.platform}`,
        label: `Open ${socialLabel(link.platform)}`,
        group: "Social",
        icon: <ExternalLink size={16} />,
        keywords: link.platform,
        perform: () => window.open(link.url, "_blank", "noopener,noreferrer"),
      });
    }

    return cmds;
  }, [theme, setTheme, copy]);

  // Sections in fixed group order, each fuzzy-filtered and ranked.
  const { sections, flat } = useMemo(() => {
    const scored = commands
      .map((c) => ({
        c,
        score: fuzzyScore(query, `${c.label} ${c.keywords ?? ""} ${c.group}`),
      }))
      .filter((s) => s.score > 0);

    const secs = GROUP_ORDER.map((group) => ({
      group,
      items: scored
        .filter((s) => s.c.group === group)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.c),
    })).filter((s) => s.items.length > 0);

    return { sections: secs, flat: secs.flatMap((s) => s.items) };
  }, [commands, query]);

  // Global toggle: Cmd/Ctrl+K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Reset + focus each time it opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setFeedback(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const runCommand = useCallback((cmd: Command) => {
    cmd.perform();
    if (cmd.feedback) {
      setFeedback(cmd.feedback);
      setTimeout(() => setOpen(false), 850);
    } else {
      setOpen(false);
    }
  }, []);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = flat[activeIndex];
      if (cmd) runCommand(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onKeyDown={onListKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-4">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Type a command or search…"
                className="w-full bg-transparent py-4 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 outline-none"
                aria-label="Search commands"
              />
              <kbd className="hidden sm:block text-[10px] font-mono text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
              {flat.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm font-mono text-gray-400">
                  {"// no matching command"}
                </p>
              ) : (
                sections.map((section) => (
                  <div key={section.group} className="mb-1">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {section.group}
                    </p>
                    {section.items.map((cmd) => {
                      runningIndex++;
                      const index = runningIndex;
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={cmd.id}
                          data-index={index}
                          onClick={() => runCommand(cmd)}
                          onMouseMove={() => setActiveIndex(index)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-purple-500/10 text-purple-700 dark:text-purple-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="flex w-4 shrink-0 items-center justify-center text-gray-400">
                            {cmd.icon}
                          </span>
                          <span className="flex-1 truncate">{cmd.label}</span>
                          {cmd.hint && (
                            <span className="text-[10px] font-mono text-gray-400">
                              {cmd.hint}
                            </span>
                          )}
                          {isActive && (
                            <CornerDownLeft size={13} className="text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-[10px] font-mono text-gray-400">
              {feedback ? (
                <span className="text-green-600 dark:text-green-400">{feedback}</span>
              ) : (
                <span className="flex items-center gap-3">
                  <span>↑↓ navigate</span>
                  <span>↵ run</span>
                </span>
              )}
              <span>⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

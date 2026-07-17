"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import type {
  Learning,
  LearningCategory,
  LearningLanguage,
} from "@/lib/data.types";
import type { HighlightedCode } from "@/lib/highlight";

export type LearningItem = {
  learning: Learning;
  html: HighlightedCode;
};

const LANGS: { id: LearningLanguage; ext: string }[] = [
  { id: "typescript", ext: "ts" },
  { id: "go", ext: "go" },
  { id: "python", ext: "py" },
];

const CATEGORY_STYLES: Record<LearningCategory, string> = {
  pattern:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  law: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  paradigm: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  principle:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
};

type CategoryMeta = {
  label: string;
  description: string;
  reference?: { label: string; url: string };
};

const CATEGORY_META: Record<LearningCategory, CategoryMeta> = {
  pattern: {
    label: "Patterns",
    description:
      "Design patterns: reusable, named solutions to recurring design problems — a shared vocabulary for structure.",
    reference: {
      label: "refactoring.guru",
      url: "https://refactoring.guru/design-patterns",
    },
  },
  law: {
    label: "Laws",
    description:
      "Empirical observations about how software — and the people building it — actually behave.",
  },
  paradigm: {
    label: "Paradigms",
    description:
      "Whole ways of structuring programs — each a different answer to “where does state live?”",
  },
  principle: {
    label: "Principles",
    description:
      "Rules of thumb that keep systems safe to change, safe to retry, and safe to operate.",
  },
};

const FILTERS: ("all" | LearningCategory)[] = [
  "all",
  "pattern",
  "law",
  "paradigm",
  "principle",
];

// "Hyrum's Law" -> "hyrums_law"
const fileSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

function CodeEditor({
  slug,
  html,
}: {
  slug: string;
  html: HighlightedCode;
}) {
  const [lang, setLang] = useState<LearningLanguage>("typescript");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-[#0d1117]">
      <div className="flex items-center border-b border-gray-700/80 bg-[#161b22]">
        <div className="flex items-center gap-1.5 px-4 shrink-0">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex overflow-x-auto">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={`px-4 py-2.5 text-xs font-mono whitespace-nowrap border-b-2 transition-colors ${
                lang === l.id
                  ? "border-purple-500 bg-white/5 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {slug}.{l.ext}
            </button>
          ))}
        </div>
      </div>

      <div
        className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html[lang] }}
      />
    </div>
  );
}

function LearningCard({
  item,
  defaultOpen,
}: {
  item: LearningItem;
  defaultOpen: boolean;
}) {
  const { learning, html } = item;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-6 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${CATEGORY_STYLES[learning.category]}`}
            >
              {learning.category}
            </span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {learning.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {learning.oneLiner}
          </p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              <CodeEditor slug={fileSlug(learning.title)} html={html} />

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="block font-mono text-xs text-purple-500 dark:text-purple-400 mb-1">
                  {"// field note"}
                </span>
                {learning.fieldNote}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="font-mono text-xs text-green-600 dark:text-green-400 mr-2">
                  $ verdict:
                </span>
                {learning.verdict}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Learnings({
  items,
  currentlyLearning,
}: {
  items: LearningItem[];
  currentlyLearning: string[];
}) {
  const [filter, setFilter] = useState<"all" | LearningCategory>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? items
        : items.filter((item) => item.learning.category === filter),
    [items, filter]
  );

  const activeMeta = filter === "all" ? null : CATEGORY_META[filter];

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Field Notes
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Patterns, laws, and paradigms collected in production — with the
              scars to prove them.
            </p>

            {currentlyLearning.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                  $ currently exploring:
                </span>
                {currentlyLearning.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {items.length === 0 ? (
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              className="text-center font-mono text-sm text-gray-400"
            >
              {"// nothing here yet — add `learnings` to data.config.ts"}
            </motion.p>
          ) : (
            <>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="mb-8"
              >
                <div className="flex flex-wrap justify-center gap-3">
                  {FILTERS.map((f) => {
                    const count =
                      f === "all"
                        ? items.length
                        : items.filter((i) => i.learning.category === f)
                            .length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          filter === f
                            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 shadow-lg shadow-purple-500/25"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {f === "all" ? "All" : CATEGORY_META[f].label}
                        <span className="ml-1.5 font-mono text-xs opacity-70">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {activeMeta && (
                    <motion.p
                      key={filter}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      {activeMeta.description}
                      {activeMeta.reference && (
                        <a
                          href={activeMeta.reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {activeMeta.reference.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                key={filter}
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {visible.map((item, index) => (
                  <LearningCard
                    key={item.learning.title}
                    item={item}
                    defaultOpen={index === 0}
                  />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

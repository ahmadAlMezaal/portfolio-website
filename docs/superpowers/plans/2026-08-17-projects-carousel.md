# Projects Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's three-card project grid with a compact
four-per-view carousel of the featured projects plus a search that reaches all
eleven.

**Architecture:** `Projects.tsx` becomes a thin orchestrator holding one piece
of state — the trimmed query. An empty query renders `ProjectCarousel`; any
other query renders a result grid from `searchProjects`. The rail is native CSS
scroll-snap with no carousel library. `ProjectCard` gains a `compact` variant
used by both branches; `/projects` keeps the full-size card and is untouched.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript 6,
Tailwind CSS 4, Motion 12 (`motion/react`), Lucide React 0.577.x.

## Global Constraints

Copied from `CLAUDE.md` and the spec. These apply to **every** task:

- **No comments.** Not in `.tsx`, `.ts`, or `.css`. Not JSDoc, not `{/* … */}`,
  not section headers. Only lint/compiler directives are permitted.
- **Arrow functions only.** No `function` declarations or expressions anywhere.
  ESLint rejects them.
- **Named exports only.** `export default` is reserved for `src/app/**` and
  root tooling configs.
- **Define before use.** Arrow consts do not hoist; a helper must appear above
  its first caller.
- **British English** in all prose, commit messages and UI copy. CSS properties
  and library APIs keep their required spelling (`color`, `text-align: center`).
- **Never hardcode a themed colour.** Use remapped Tailwind tokens
  (`purple`, `emerald`, `gray`) or `rgb(var(--accent-rgb) / …)`. `red`,
  `orange`, `amber`, `yellow`, `lime`, `teal` are only for semantic colours.
- **No new dependencies.** The carousel is CSS scroll-snap; do not add a
  carousel library.
- `/projects`, `ProjectsShowcase.tsx` and `FilterPill.tsx` must not change.

**There is no test framework in this repo.** `package.json` has `dev`, `build`,
`preview` and `lint` only. Verification is therefore: `pnpm lint` (compare
against the standing baseline), `pnpm build`, a runnable Node smoke check for
pure functions, and measured browser checks for layout. Do not scaffold a test
runner — that is out of scope.

**Baseline to record before starting:** run `pnpm lint 2>&1 | tail -5` and note
the problem count. `react-hooks/set-state-in-effect` errors are pre-existing and
CI runs lint with `continue-on-error`. The rule is: do not *increase* the count.

---

### Task 1: Extract shared search helpers and add `searchProjects`

**Files:**
- Create: `src/lib/search.ts`
- Modify: `src/lib/bookmarks.ts:43-63` (remove the three helpers, import them)
- Modify: `src/lib/projects.ts` (append `searchProjects`)
- Check: `/private/tmp/claude-501/-Users-ahmadalmezaal-Documents-apps-portfolio-website/b1947ae0-29ef-4f74-805f-f1d4ad546d07/scratchpad/check-search.mjs`

**Interfaces:**
- Produces: `queryTokens(query: string): string[]`,
  `wordsOf(value: string): string[]`,
  `fieldScore(token: string, words: string[], weight: number): number` from
  `@/lib/search`; `searchProjects(projectList: Project[], query: string): Project[]`
  from `@/lib/projects`.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Create `src/lib/search.ts`**

Lift the three helpers out of `bookmarks.ts` verbatim — `wordsOf` and
`fieldScore` are currently private, `queryTokens` is already exported.

```typescript
export const queryTokens = (query: string): string[] =>
  query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

export const wordsOf = (value: string): string[] =>
  value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

export const fieldScore = (
  token: string,
  words: string[],
  weight: number
): number => {
  let best = 0;
  for (const word of words) {
    if (word === token) best = Math.max(best, weight * 3);
    else if (word.startsWith(token)) best = Math.max(best, weight * 2);
    else if (word.includes(token)) best = Math.max(best, weight);
  }
  return best;
};
```

- [ ] **Step 2: Rewire `src/lib/bookmarks.ts`**

Delete the local `queryTokens`, `wordsOf` and `fieldScore` declarations
(lines 43–63) and add the import beside the existing ones at the top:

```typescript
import { fieldScore, queryTokens, wordsOf } from "@/lib/search";
```

`bookmarks.ts` currently re-exports `queryTokens`. Keep that working by
re-exporting from the new module so existing importers do not break:

```typescript
export { queryTokens } from "@/lib/search";
```

Leave `TITLE`, `FOLDER`, `HOST`, `KIND`, `NOTE`, `indexFolders` and
`searchBookmarks` exactly as they are. Bookmark ranking must not change.

- [ ] **Step 3: Confirm nothing else imported the private helpers**

Run:

```bash
rg -n "queryTokens|wordsOf|fieldScore" src/
```

Expected: definitions in `src/lib/search.ts`, the import and re-export in
`src/lib/bookmarks.ts`, uses inside `searchBookmarks`, and whatever already
imported `queryTokens` (`Bookmarks.tsx` and/or `BookmarksMenu.tsx`). No other
file should declare its own copy.

- [ ] **Step 4: Append `searchProjects` to `src/lib/projects.ts`**

Field weights come from the spec: title 4, tags 3, status 2, description 1.
Every token must match somewhere, and hits rank by total score with the
original order as tie-break. Place these **below** the existing
`sortProjects` and `shouldHideLinks` (define before use is enforced, and
`searchProjects` is the last thing in the file).

```typescript
import { fieldScore, queryTokens, wordsOf } from "@/lib/search";

const TITLE = 4;
const TAGS = 3;
const STATUS = 2;
const DESCRIPTION = 1;

type IndexedProject = {
  project: Project;
  order: number;
  fields: { words: string[]; weight: number }[];
};

const indexProjects = (projectList: Project[]): IndexedProject[] =>
  projectList.map((project, order) => ({
    project,
    order,
    fields: [
      { words: wordsOf(project.title), weight: TITLE },
      { words: project.tags.flatMap(wordsOf), weight: TAGS },
      { words: wordsOf(project.status || "live"), weight: STATUS },
      { words: wordsOf(project.description), weight: DESCRIPTION },
    ],
  }));

export const searchProjects = (
  projectList: Project[],
  query: string
): Project[] => {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  const scored: { entry: IndexedProject; score: number }[] = [];

  for (const entry of indexProjects(projectList)) {
    let total = 0;
    let matchedEvery = true;

    for (const token of tokens) {
      let best = 0;
      for (const field of entry.fields) {
        best = Math.max(best, fieldScore(token, field.words, field.weight));
      }
      if (best === 0) {
        matchedEvery = false;
        break;
      }
      total += best;
    }

    if (matchedEvery) scored.push({ entry, score: total });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.order - b.entry.order)
    .map(({ entry }) => entry.project);
};
```

The `import type { Project, ProjectStatus }` line already at the top of the
file stays; add the `@/lib/search` import beside it.

- [ ] **Step 5: Write the smoke check**

Node 24 strips types, and `@/types` is imported as `import type` so it is
erased at runtime — a plain `.mjs` can import the `.ts` module directly.
Write to the scratchpad, not the repo:

```javascript
import { searchProjects, sortProjects } from "../../../../Users/ahmadalmezaal/Documents/apps/portfolio-website/src/lib/projects.ts";
import data from "../../../../Users/ahmadalmezaal/Documents/apps/portfolio-website/src/lib/portfolio-data.json" with { type: "json" };

const projects = data.projects;
const titles = (q) => searchProjects(projects, q).map((p) => p.title);

const cases = [
  ["react n", ["Atomic Streaks", "ZIM: eSIM Calls & Data Plans", "Desofy (DeSo Mobile)"]],
  ["python", ["The Alfred Brief"]],
  ["healthcare", ["Healthcare Companion (University Project)"]],
  ["", []],
  ["zzzz", []],
];

let failed = 0;
for (const [query, expected] of cases) {
  const actual = titles(query);
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(ok ? "ok  " : "FAIL", JSON.stringify(query), "->", actual);
}

const munin = titles("munin");
console.log(munin[0] === "Munin" ? "ok   title outranks description" : "FAIL title ranking");
if (munin[0] !== "Munin") failed++;

console.log(failed === 0 ? "\nall passed" : `\n${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
```

Use absolute paths in the import specifiers if the relative ones are awkward —
the point is that it runs, not how the path is written.

- [ ] **Step 6: Run the smoke check**

Run: `node <scratchpad>/check-search.mjs`
Expected: every line `ok`, then `all passed`, exit code 0.

If `portfolio-data.json` is absent (a fresh clone), point the import at
`src/lib/data.config.example.ts` instead and adjust the expected titles to
that file's placeholder projects.

- [ ] **Step 7: Verify bookmark search still ranks identically**

Run: `pnpm lint 2>&1 | tail -5` — the count must not exceed the recorded
baseline. Then `pnpm build` and confirm it completes.

- [ ] **Step 8: Commit**

```bash
git add src/lib/search.ts src/lib/bookmarks.ts src/lib/projects.ts
git commit -m "refactor(search): share the token scorer between bookmarks and projects"
```

---

### Task 2: Add the `compact` variant to `ProjectCard`

**Files:**
- Modify: `src/components/ProjectCard.tsx:91-229`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `ProjectCard` accepting
  `{ project: Project; variant?: "full" | "compact"; priority?: boolean }`.
  `variant` defaults to `"full"`; `priority` defaults to `project.featured`.

- [ ] **Step 1: Widen the props and derive the variant flags**

Replace the component signature. Keep everything above it (`AppleIcon`,
`AndroidIcon`, `linkIcons`, `ProjectPlaceholder`) untouched.

```tsx
const COMPACT_TAG_LIMIT = 3;

export const ProjectCard = ({
  project,
  variant = "full",
  priority,
}: {
  project: Project;
  variant?: "full" | "compact";
  priority?: boolean;
}) => {
  const isMobile = useIsMobile();
  const hideLinks = shouldHideLinks(project);
  const imageFit = project.imageFit || "cover";
  const isCompact = variant === "compact";
  const visibleTags = isCompact
    ? project.tags.slice(0, COMPACT_TAG_LIMIT)
    : project.tags;
  const hiddenTagCount = project.tags.length - visibleTags.length;
```

- [ ] **Step 2: Make the image strip and its `priority` variant-aware**

The image block currently hardcodes `h-48` and `priority={project.featured}`.
Preloading seven featured images above the fold is a regression, so priority
now comes from the caller:

```tsx
<div
  className={`relative ${isCompact ? "h-32" : "h-48"} bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10 overflow-hidden`}
>
```

and on the `<Image>`:

```tsx
priority={priority ?? project.featured}
sizes={
  isCompact
    ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 86vw"
    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
}
```

- [ ] **Step 3: Clamp the description behind a wrapper**

This is the step most likely to be got wrong. `-webkit-line-clamp` needs
`display: -webkit-box`, and a flex item is blockified — its computed display
becomes `flow-root` and the clamp silently does nothing. The card body is
`flex flex-col`, so the clamped paragraph **cannot itself be the flex child**.
Tailwind's `line-clamp-3` fails the same way. The wrapper carries `flex-1`;
the paragraph carries the clamp.

Replace the body block:

```tsx
<div className={`${isCompact ? "p-4" : "p-6"} flex-1 flex flex-col`}>
  <h3
    className={`${isCompact ? "text-base" : "text-xl"} font-bold text-gray-800 dark:text-white mb-2`}
  >
    {project.title}
  </h3>

  {isCompact ? (
    <div className="flex-1 mb-3">
      <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-3">
        {project.description}
      </p>
    </div>
  ) : (
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
      {project.description}
    </p>
  )}

  <div className="flex flex-wrap gap-2">
    {visibleTags.map((tag) => (
      <span
        key={tag}
        className={`${isCompact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"} font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full`}
      >
        {tag}
      </span>
    ))}
    {hiddenTagCount > 0 && (
      <span className="px-2 py-0.5 text-[10px] font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
        +{hiddenTagCount}
      </span>
    )}
  </div>
```

Leave the mobile links block and the `hideLinks` block that follow exactly as
they are, and close the div as before.

- [ ] **Step 4: Leave the hover overlay alone**

Do **not** add a hover rule that changes the clamp, the card height, or
anything else affecting layout. The spec rejects it: the rail stretches every
card to a common height, so one card growing grows all of them, and taking the
hovered card out of flow gets it clipped by the rail's forced
`overflow-y: auto`. Hover reveals the links overlay only.

- [ ] **Step 5: Verify**

Run: `pnpm lint 2>&1 | tail -5` (not above baseline) and `pnpm build`.
`/projects` must be visually unchanged — `variant` defaults to `"full"` and
`ProjectsShowcase` passes neither new prop.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat(projects): add a compact card variant"
```

---

### Task 3: Build `ProjectSearch`

**Files:**
- Create: `src/components/ProjectSearch.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `ProjectSearch` accepting
  `{ value: string; onChange: (value: string) => void; resultCount: number | null; totalCount: number }`.
  `resultCount === null` means no query is active and the count line renders
  empty (but keeps its height).

- [ ] **Step 1: Create the component**

`type="text"`, not `type="search"` — the latter paints a native clear
affordance next to ours. The count line keeps a fixed height so typing does
not shift the rail below it.

```tsx
"use client";

import { Search, X } from "lucide-react";

export const ProjectSearch = ({
  value,
  onChange,
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (value: string) => void;
  resultCount: number | null;
  totalCount: number;
}) => (
  <div className="mb-6">
    <div className="flex justify-center">
      <label className="flex items-center gap-2 w-full max-w-lg px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-[rgb(var(--accent-rgb)/0.6)] transition-colors">
        <Search className="w-4 h-4 shrink-0 text-[rgb(var(--accent-rgb))]" />
        <span className="shrink-0 text-sm text-[rgb(var(--accent-rgb))] select-none">
          $ grep projects
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="name, tag or tech…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search projects"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 text-gray-400 hover:text-[rgb(var(--accent-rgb))] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </label>
    </div>

    <p className="h-5 mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
      {resultCount === null
        ? ""
        : `${resultCount} of ${totalCount} projects`}
    </p>
  </div>
);
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm lint 2>&1 | tail -5` and `pnpm build`. Nothing renders it yet;
this only proves it type-checks.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectSearch.tsx
git commit -m "feat(projects): add the terminal-styled project search input"
```

---

### Task 4: Build `ProjectCarousel`

**Files:**
- Create: `src/components/ProjectCarousel.tsx`
- Modify: `src/app/globals.css` (add `.no-scrollbar` after the
  `::-webkit-scrollbar-thumb:hover` block, around line 295)

**Interfaces:**
- Consumes: `ProjectCard` with `variant="compact"` and `priority` (Task 2).
- Produces: `ProjectCarousel` accepting
  `{ projects: Project[]; remainingCount: number }`. It renders the trailing
  see-all card only when `remainingCount > 0`.

- [ ] **Step 1: Add the scrollbar-hiding utility to `globals.css`**

The file already hand-writes `::-webkit-scrollbar` rules, so a plain class
fits its style. No comment above it.

```css
.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: Create the component**

`SeeAllCard` is declared above `ProjectCarousel` because define-before-use is
enforced. Keep its content to the prompt line, a heading, one line of prose
and the link — in the mockup a taller see-all card dragged every project card
up to its height, because the rail stretches all items to the tallest.

```tsx
"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";
import { cardVariants, gridContainerVariants } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ProjectCard } from "@/components/ProjectCard";

const PRIORITY_COUNT = 4;
const CELL_CLASS =
  "snap-start shrink-0 basis-[86%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4.5rem)/4)]";

const SeeAllCard = ({ count }: { count: number }) => (
  <Link href="/projects" className="group block h-full">
    <div className="h-full flex flex-col gap-2 p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-[rgb(var(--accent-rgb)/0.07)] to-transparent group-hover:border-[rgb(var(--accent-rgb)/0.65)] group-hover:-translate-y-1.5 transition-all">
      <span className="text-xs text-[rgb(var(--accent-rgb))]">
        $ ls ~/projects
      </span>
      <span className="text-base font-bold text-gray-800 dark:text-white">
        {count} more {count === 1 ? "project" : "projects"}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Work in progress, side quests and the archive.
      </span>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-[rgb(var(--accent-rgb))]">
        See all
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </Link>
);

export const ProjectCarousel = ({
  projects,
  remainingCount,
}: {
  projects: Project[];
  remainingCount: number;
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    setPageCount(Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth - 0.02)));
    setActivePage(Math.round(rail.scrollLeft / rail.clientWidth));
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        sync();
      });
    };

    sync();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [sync]);

  const scrollToPage = (page: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollTo({
      left: page * rail.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const atStart = activePage <= 0;
  const atEnd = activePage >= pageCount - 1;

  return (
    <div>
      <motion.div
        ref={railRef}
        role="region"
        aria-label="Featured projects"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
        variants={gridContainerVariants}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            className={CELL_CLASS}
            variants={cardVariants}
          >
            <ProjectCard
              project={project}
              variant="compact"
              priority={index < PRIORITY_COUNT}
            />
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <motion.div className={CELL_CLASS} variants={cardVariants}>
            <SeeAllCard count={remainingCount} />
          </motion.div>
        )}
      </motion.div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => scrollToPage(activePage - 1)}
            disabled={atStart}
            aria-label="Previous projects"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-[rgb(var(--accent-rgb))] disabled:opacity-30 hover:border-[rgb(var(--accent-rgb)/0.7)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                onClick={() => scrollToPage(page)}
                aria-label={`Go to page ${page + 1}`}
                aria-current={page === activePage}
                className={`h-1 rounded-full transition-all ${
                  page === activePage
                    ? "w-7 bg-[rgb(var(--accent-rgb))]"
                    : "w-4 bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToPage(activePage + 1)}
            disabled={atEnd}
            aria-label="More projects"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-[rgb(var(--accent-rgb))] disabled:opacity-30 hover:border-[rgb(var(--accent-rgb)/0.7)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: Verify**

Run: `pnpm lint 2>&1 | tail -5` and `pnpm build`. If lint reports a **new**
`react-hooks/set-state-in-effect` for the `sync()` call, that matches the
existing baseline pattern in this codebase — record it in the PR description
rather than restructuring the component.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCarousel.tsx src/app/globals.css
git commit -m "feat(projects): add the compact project carousel"
```

---

### Task 5: Rewire `Projects.tsx`

**Files:**
- Modify: `src/components/Projects.tsx` (full rewrite of the component body)

**Interfaces:**
- Consumes: `searchProjects` (Task 1), `ProjectCard` compact variant (Task 2),
  `ProjectSearch` (Task 3), `ProjectCarousel` (Task 4).
- Produces: nothing downstream.

- [ ] **Step 1: Rewrite the component**

The featured rail is the featured projects in `sortProjects` order; search runs
over **all** projects, which is why `totalCount` is `projects.length` and not
the featured count. The old `GLIMPSE_COUNT` slice and the gradient
"View all projects" pill both go — the see-all card replaces the pill.

```tsx
"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { projects } from "@/lib/data";
import { searchProjects, sortProjects } from "@/lib/projects";
import { gridContainerVariants, cardVariants, useSectionInView } from "@/lib/motion";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectSearch } from "@/components/ProjectSearch";
import { SectionHeading } from "@/components/SectionHeading";

export const Projects = () => {
  const { ref, isInView } = useSectionInView();
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => sortProjects(projects), []);
  const featured = useMemo(() => sorted.filter((p) => p.featured), [sorted]);

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed ? searchProjects(sorted, trimmed) : []),
    [sorted, trimmed]
  );

  const isSearching = trimmed.length > 0;
  const railProjects = featured.length > 0 ? featured : sorted;

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={gridContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={cardVariants} className="text-center mb-8">
            <SectionHeading
              title="Featured Projects"
              subtitle="Some of my recent work that I'm proud of"
              cycle={3}
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <ProjectSearch
              value={query}
              onChange={setQuery}
              resultCount={isSearching ? results.length : null}
              totalCount={projects.length}
            />
          </motion.div>

          {isSearching ? (
            results.length > 0 ? (
              <motion.div
                key="results"
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {results.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    variant="compact"
                  />
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16 text-sm">
                No project matches{" "}
                <span className="text-[rgb(var(--accent-rgb))]">{trimmed}</span>.
              </p>
            )
          ) : (
            <ProjectCarousel
              projects={railProjects}
              remainingCount={projects.length - railProjects.length}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};
```

`railProjects` falls back to every project when nothing is marked featured, so
a fresh clone using `data.config.example.ts` still shows a populated rail
rather than an empty one.

- [ ] **Step 2: Confirm the old CTA is gone and nothing dangles**

Run:

```bash
rg -n "GLIMPSE_COUNT|View all projects" src/
```

Expected: no matches in `src/components/Projects.tsx`. A "View all projects"
string elsewhere (the ⌘K palette) is fine and must stay.

- [ ] **Step 3: Verify**

Run: `pnpm lint 2>&1 | tail -5` and `pnpm build`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat(projects): browse featured work in a carousel with search"
```

---

### Task 6: Measured browser verification

**Files:**
- No source changes expected. Any fix found here is committed against the file
  it belongs to.

**Interfaces:**
- Consumes: everything from Tasks 1–5.

This task is where the layout claims get proved. Assertions are numbers, not
impressions — the spec's card heights came from measurement and so must these.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev` (background) and open `http://localhost:3000/#projects`.

- [ ] **Step 2: Check the card height and that hover does not move anything**

In the browser console:

```javascript
const rail = document.querySelector('[aria-label="Featured projects"]');
const cards = [...rail.children].map((c) => Math.round(c.getBoundingClientRect().height));
console.log("heights", cards, "rail", Math.round(rail.getBoundingClientRect().height));
```

Expected: every entry equal, ~262px at the three-line clamp, and the see-all
card the same height as the project cards — **not** taller. If the see-all card
is taller, it is dragging the rest up with it; trim its content.

Then hover a card and re-run. Expected: identical numbers. Any change means a
hover rule is affecting layout, which the spec forbids.

- [ ] **Step 3: Confirm the clamp is actually applied**

```javascript
const p = document.querySelector('[aria-label="Featured projects"] p.line-clamp-3');
console.log(getComputedStyle(p).webkitLineClamp, Math.round(p.getBoundingClientRect().height));
```

Expected: `3` and roughly 3 × line-height. If the height is the full untruncated
text, the wrapper from Task 2 Step 3 is missing and the paragraph is being
blockified as a flex item.

- [ ] **Step 4: Check the image preloads**

```javascript
console.log(document.querySelectorAll('link[rel="preload"][as="image"]').length);
```

Expected: at most 4. Seven means `priority` is still coming from
`project.featured` rather than the rail index.

- [ ] **Step 5: Check Lenis does not swallow horizontal scrolling**

With a trackpad, scroll horizontally over the rail. Expected: the rail scrolls
and the page does not. Then check the arrows, the dots, and keyboard `Tab` into
the rail followed by arrow keys.

If Lenis interferes, add `data-lenis-prevent` to the rail element and re-check;
record it in the PR description.

- [ ] **Step 6: Check search and the empty state**

Type `react n` — expect 3 results and the count line reading `3 of 11 projects`.
Type `python` — expect The Alfred Brief, which is *not* featured, proving search
reaches beyond the rail. Type `zzzz` — expect the empty line. Clear the input —
expect the carousel back with the arrows and dots agreeing with the scroll
position.

- [ ] **Step 7: Check the breakpoints**

At ≥1024px expect 4 cards per view; at 640–1023px expect 2; below 640px expect
1 with the next card peeking. Confirm the page itself never scrolls
horizontally at 375px wide.

- [ ] **Step 8: Confirm `/projects` is untouched**

Visit `/projects`. Cards must be full-size with unclamped descriptions and all
tags. If they look compact, a default leaked.

- [ ] **Step 9: Commit any fixes**

```bash
git add -A
git commit -m "fix(projects): <what the browser check turned up>"
```

Skip this step if nothing needed fixing.

---

### Task 7: Open the pull request

- [ ] **Step 1: Final verification**

Run `pnpm lint 2>&1 | tail -5` and confirm the count is at or below the
baseline recorded at the start. Run `pnpm build` and confirm the static export
completes.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin feat/projects-carousel
```

The PR description should cover: the before/after of the section, the three
design decisions taken by measurement (featured-only rail with search over all
eleven, no status pills, no hover expand), the `-webkit-line-clamp`
blockification trap, the `priority` change from `featured` to rail index, and
any lint-baseline delta. Link the spec at
`docs/superpowers/specs/2026-08-17-projects-carousel-design.md`.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
| --- | --- |
| `lib/search.ts` extraction, `searchProjects`, field weights | 1 |
| `ProjectCard` compact variant, clamp wrapper, `priority` risk | 2 |
| `ProjectSearch`, `type="text"`, fixed-height count line | 3 |
| `ProjectCarousel`, scroll-snap, breakpoints, arrows, dots, see-all card | 4 |
| `Projects.tsx` orchestration, carousel/grid switch, no-match state | 5 |
| Card height, no hover reflow, Lenis risk, breakpoints, `/projects` unchanged | 6 |
| Out of scope: `tagline`, `/projects` changes, match highlighting | not implemented, stated in Global Constraints and the spec |

Edge cases from the spec: no matches (Task 5 Step 1, Task 6 Step 6); clearing
the query resets the rail (Task 6 Step 6); fewer than four featured projects
(Task 4 hides the controls when `pageCount === 1`, Task 5 falls back to all
projects); missing image (existing placeholders, unchanged in Task 2).

**Type consistency:** `variant?: "full" | "compact"` and `priority?: boolean`
are defined in Task 2 and consumed with those exact names in Tasks 4 and 5.
`ProjectCarousel` takes `projects` / `remainingCount` in Task 4 and is called
with both in Task 5. `ProjectSearch` takes
`value` / `onChange` / `resultCount` / `totalCount` in Task 3 and is called
with all four in Task 5. `searchProjects(projectList, query)` is defined in
Task 1 and called with that argument order in Task 5.

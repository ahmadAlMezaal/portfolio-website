# Portfolio Website

A terminal-styled personal portfolio built with Next.js 16, React 19,
TypeScript, and Tailwind CSS 4. Statically exported and deployed to GitHub
Pages.

## Tech Stack

- **Framework**: Next.js 16.2.12 (App Router, `output: "export"`)
- **UI**: React 19.2.8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS 4 (via @tailwindcss/postcss)
- **Animations**: Motion 12 (imported from `motion/react`, not `framer-motion`)
- **Smooth scroll**: Lenis
- **Syntax highlighting**: shiki (build time only)
- **Icons**: Lucide React (pinned to 0.x — see Dependency Ceilings)
- **Theming**: custom `ThemeProvider` (see Theme System)

### Dependency Ceilings

Three packages are deliberately held back. Each newer major breaks something
concrete, so bump them only with the matching fix:

- **lucide-react** stays on `0.577.x`. Version 1.0 deleted every brand icon
  (`Github`, `Linkedin`, `Twitter`, `Youtube`, `Instagram`, `Facebook`,
  `Dribbble`, `Codepen`) for trademark reasons. `lib/social.tsx` and the
  `repo` bookmark icon depend on them, and Simple Icons has since dropped
  LinkedIn and CodePen too — so moving to 1.x means hand-authoring those
  marks, not swapping a source.
- **typescript** stays on `6.x`. TS 7 (the native port) builds fine with
  `experimental.useTypeScriptCli`, but `typescript-eslint` refuses to load
  against it, which takes out `pnpm lint` — and lint is what enforces the
  arrow-function and named-export rules below.
- **eslint** stays on `9.x`. ESLint 10 crashes `eslint-plugin-react` (pulled
  in transitively by `eslint-config-next`) inside `detectReactVersion`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout: metadata, providers, global chrome
│   ├── page.tsx          # Home — composes Hero/About/Skills/Projects/Contact
│   ├── projects/page.tsx # /projects — full project collection
│   ├── learnings/page.tsx# /learnings — Field Notes (build-time shiki)
│   ├── bookmarks/page.tsx# /bookmarks — browser-style bookmark manager
│   ├── not-found.tsx     # 404 — terminal window, exported as 404.html
│   ├── robots.ts         # robots.txt
│   ├── sitemap.ts        # sitemap.xml
│   ├── icon.svg          # Favicon served by the app router
│   └── globals.css       # Tailwind entry, theme palettes, motifs, keyframes
├── components/
│   ├── Navbar.tsx        # Top nav + status pill + mobile menu
│   ├── NavAnchor.tsx     # Path-aware nav link (hash links work from any route)
│   ├── Hero.tsx          # Hero section
│   ├── HeroIntro.tsx     # Hero copy, per-theme nameplate treatments
│   ├── HeroBackground.tsx# Hero-only background accents
│   ├── About.tsx         # About + stats or focus chips
│   ├── Skills.tsx        # Skills as tags
│   ├── Experience.tsx    # Work timeline (single role or promotions)
│   ├── Projects.tsx      # Featured projects on the home page
│   ├── ProjectsShowcase.tsx # Full grid + filtering on /projects
│   ├── ProjectCard.tsx   # Shared project card
│   ├── FilterPill.tsx    # Shared filter pill
│   ├── Learnings.tsx     # Field Notes cards with tabbed code editor
│   ├── Bookmarks.tsx     # Bookmark manager: folder sidebar + link rows
│   ├── BookmarksMenu.tsx # Navbar star menu with cascading folder submenus
│   ├── Contact.tsx       # Contact form and info
│   ├── Footer.tsx        # Footer with links
│   ├── SectionHeading.tsx# Shared section title (glitch cycles)
│   ├── SectionBackground.tsx # Per-section background accents
│   ├── ThemeBackground.tsx   # Per-theme global background layer
│   ├── MatrixRain.tsx    # Matrix code-rain canvas
│   ├── SynthwaveGrid.tsx # Cyberpunk perspective grid
│   ├── DecodeText.tsx    # Scramble/decode text effect
│   ├── ThemeProvider.tsx # Palette state + localStorage
│   ├── ThemeSwitcher.tsx # Gear menu (floating) / inline list
│   ├── StatusBar.tsx     # Bottom hint bar; owns the F fullscreen shortcut
│   ├── CommandPalette.tsx# ⌘K palette
│   ├── ShortcutsOverlay.tsx  # "?" cheatsheet
│   ├── shortcutsBus.ts   # Window-event bus for opening palette/cheatsheet
│   ├── ScrollToTopRocket.tsx # Floating scroll-to-top
│   ├── ScrollReset.tsx   # Resets scroll on route change
│   ├── SmoothScroll.tsx  # Lenis wrapper
│   ├── KonamiEasterEgg.tsx
│   └── JsonLd.tsx        # Structured data
├── lib/
│   ├── data.ts           # Re-exports config data + nav links
│   ├── data.config.example.ts # Placeholder content (fallback)
│   ├── highlight.ts      # Build-time shiki highlighting for learnings
│   ├── hooks.ts          # Shared hooks (scroll, mobile, clipboard, fullscreen)
│   ├── metadata.ts       # pageMetadata() — per-route title/canonical/OG/Twitter
│   ├── motion.ts         # Shared Motion variants
│   ├── projects.ts       # Project filtering/sorting helpers
│   ├── bookmarks.ts      # Folder slugs, URL labels, search filtering
│   ├── social.tsx        # Social platform icons + labels
│   ├── glyphs.ts         # Character sets for decode/rain effects
│   └── utils.ts          # assetPath, getBasePath, isTyping, isCvAvailable
└── types/
    └── index.ts          # Shared interfaces (import from "@/types")
```

## Configuration System

ALL personal content lives outside this repo, in the private
[`portfolio-data`](https://github.com/ahmadAlMezaal/portfolio-data) repo as
`portfolio.json` (shaped as `PortfolioConfig` from `@/types`). This repo is
public and contains no personal data beyond deployment infrastructure
(`public/CNAME`, the committed `public/og-image.png`, and project logos in
`public/assets/`).

### How content is fetched

- `scripts/sync-data.mjs` runs before `next dev`/`next build` (npm pre-hooks)
  and on `postinstall`. When `PORTFOLIO_DATA_URL` is set (env or `.env.local`),
  it fetches the JSON — with `PORTFOLIO_DATA_TOKEN` as a Bearer token for the
  private repo — validates the shape, and writes the gitignored
  `src/lib/portfolio-data.json`. On fetch or validation failure the build
  fails loudly.
- `data.ts` uses that file when present (non-null), otherwise falls back to
  the placeholder `data.config.example.ts`, so clones build out of the box
  with template content.
- The deploy workflow always sets `PORTFOLIO_DATA_URL` and passes the
  `PORTFOLIO_DATA_TOKEN` secret (fine-grained PAT, `contents: read` on
  portfolio-data). If the secret is missing the build fails rather than
  deploying placeholder content.
- For local dev with real content, put `PORTFOLIO_DATA_URL` and
  `PORTFOLIO_DATA_TOKEN` in `.env.local`. The synced JSON persists (the sync
  script keeps it when the URL is unset), so a one-off sync also works.

**To customize (when cloning this repo as a template):**

1. Seed a starter file with `node scripts/export-template.mjs > portfolio.json`,
   fill it in, host it anywhere, and point `PORTFOLIO_DATA_URL` at it — any
   URL returning `PortfolioConfig`-shaped JSON works (GitHub contents API,
   gist, object storage, CMS). See the README's "Content" section.
2. Place your CV at `public/cv.pdf`
3. Add project images to `public/projects/`
4. (Optional) Replace `public/icon.svg` with your own favicon

**Config includes:**

- `siteMetadata`: SEO title, description, keywords, locale
- `personalInfo`: Name, title, bio, email, status, social links
- `roles`: Typing animation roles
- `stats`: Career statistics
- `skills`: Categorized skills (displayed as tags, no percentages)
- `experiences`: Work history (supports single role or multiple roles/promotions)
- `projects`: Portfolio projects (flexible links, optional images)
- `education`: Educational background
- `certifications`: Professional certifications
- `learnings` (optional): Field Notes entries for the /learnings page
- `currentlyLearning` (optional): "currently exploring" chips on /learnings
- `focusAreas` (optional): qualitative chips in About; replace the numeric stats
- `bookmarks` (optional): folders of shared links for the /bookmarks page

The canonical shape is `PortfolioConfig` in `src/types/index.ts` — read that
first, and `data.config.example.ts` for a filled-in example.

### Status Options

The `status` field in personalInfo accepts one of these predefined values:
- `"Open to Opportunities"` - Looking for new roles
- `"Open to Freelance"` - Available for freelance work
- `"Currently Employed"` - Not actively looking
- `"Available for Hire"` - Ready to start immediately
- `"Not Available"` - Not taking on work

### Social Links

Social links are fully configurable. Only include the platforms you use:

```typescript
socialLinks: [
  { platform: "github", url: "https://github.com/username" },
  { platform: "linkedin", url: "https://linkedin.com/in/username" },
  { platform: "medium", url: "https://medium.com/@username" },
]
```

**Supported platforms:** github, linkedin, twitter, medium, youtube, instagram, facebook, dribbble, behance, stackoverflow, codepen, dev

### Experience with Promotions

The Experience section supports two formats:

**Single role (standard):**
```typescript
{
  title: "Software Engineer",
  company: "Company Name",
  location: "City, Country",
  period: "2021 - Present",
  description: "Role description",
  achievements: ["Achievement 1", "Achievement 2"],
}
```

**Multiple roles (promotions at same company):**
```typescript
{
  company: "Company Name",
  location: "City, Country",
  roles: [
    {
      title: "Lead Engineer",
      period: "2023 - Present",
      description: "Current role description",
      achievements: ["Achievement 1"],
    },
    {
      title: "Software Engineer",
      period: "2021 - 2023",
      description: "Previous role description",
      achievements: ["Achievement 1"],
    },
  ],
}
```

Most recent role first. When using multiple roles, the component displays:
- Company name prominently with a "Career progression" indicator
- A TrendingUp icon instead of Briefcase
- Each role as a sub-item with its own timeline dot
- The overall period is calculated automatically (earliest start to latest end)

### Projects with Flexible Links

Projects use a flexible `links` array instead of fixed `liveUrl`/`githubUrl` fields. This supports any combination of link types:

```typescript
{
  title: "Project Name",
  description: "Project description",
  image: "/projects/image.jpg",
  imageFit: "contain",
  tags: ["Tech1", "Tech2"],
  links: [
    { type: "website", label: "Live Demo", url: "https://example.com" },
    { type: "github", label: "Source Code", url: "https://github.com/..." },
  ],
  featured: true,
  status: "live",
}
```

**Supported link types:** `website`, `github`, `appstore`, `playstore`, `case-study`

**Link icons mapping:**
- `website` -> Globe icon
- `github` -> GitHub icon
- `appstore` -> Apple icon
- `playstore` -> Smartphone icon
- `case-study` -> FileText icon

**Special cases:**
- `status` is `live` (default, no badge), `in_progress` (amber badge), or
  `private` (grey badge, links hidden)
- Empty `links: []` array shows "Private / available on request" badge
- `image: null` or missing image shows a gradient placeholder with folder icon
- `imageFit: "contain"` suits logos; `"cover"` is the default

### Learnings / Field Notes

The `/learnings` page renders `learnings` entries as expandable cards with a
code-editor block. Each entry requires code in all three languages —
`typescript`, `go`, and `python` — which become the editor's filename tabs:

```typescript
{
  title: "Singleton",
  category: "pattern",
  oneLiner: "The concept in a single sentence.",
  code: {
    typescript: `...`,
    go: `...`,
    python: `...`,
  },
  fieldNote: "Where this showed up in real work.",
  verdict: "One honest line of judgement.",
}
```

`category` is `"pattern" | "law" | "paradigm" | "principle"`.

Highlighting happens at build time via shiki (`src/lib/highlight.ts`), so no
highlighter ships to the client. `currentlyLearning` renders as chips in the
page header. Both fields are optional; the page shows an empty state without
them.

### Bookmarks

The `/bookmarks` page is a fake browser bookmark manager: a window frame with
traffic lights and a `bookmarks://<name>/<folder>` address bar, a folder
sidebar, and rows of links. `bookmarks` is an array of folders:

```typescript
{
  name: "react-native",
  description: "Things that changed how I ship mobile.",
  bookmarks: [
    {
      title: "mrousavy/react-native-mmkv",
      url: "https://github.com/mrousavy/react-native-mmkv",
      kind: "repo",
      note: "Replaced AsyncStorage and a whole class of race conditions.",
      added: "2026-07",
    },
  ],
}
```

`kind` is `"article" | "blog" | "repo" | "package" | "docs" | "video" | "tool"`
and selects the row icon — it is never rendered as text. Pick it from what the
URL points at, not what the thing conceptually is: a github.com link is a
`repo` even when the project ships as a package.

Conventions:

- **One level of folders.** There is no nesting, by design.
- `name` is lowercase-kebab so it reads as a directory; it also becomes the
  anchor (`/bookmarks#react-native`) that the ⌘K palette links to.
- `note` is the reason the link earned its place — the part a browser export
  cannot give you. `description` and `added` are optional.
- `sync-data.mjs` validates every folder and link, so a malformed `kind` or a
  non-absolute URL fails the build rather than shipping a broken row.

Folder selection comes from the URL hash first, then the first folder; the
search box filters across every folder at once and shows which folder each hit
came from.

Search is token-based, not substring: the query is split on non-alphanumerics
and every token must match a word in the title, folder, host, kind or note —
so `react n` finds `react-native`. Tokens are scored (exact word > word prefix
> infix, weighted by field) and hits are ranked. Matches are highlighted in the
title only, at word starts only; highlighting every infix made single-letter
tokens light up half the page.

`BookmarksMenu` puts the same content behind the navbar star, like a browser's
bookmark menu: folders cascade into a submenu on hover, with `All bookmarks`
opening the full page. It is `lg` and up only — the nav row cannot fit it
below that.

### Favicon

The portfolio uses SVG favicon by default (`public/icon.svg`). To customize:
- Replace `public/icon.svg` with your own SVG icon
- For full browser support, also add `public/favicon.ico` and `public/apple-touch-icon.png`

## Theme System

The site is **dark only**. There is no light mode and no `next-themes`; the
palette is chosen by a custom `ThemeProvider`.

Three terminal palettes, selected via `data-theme` on `<html>`:

| id | motif |
| --- | --- |
| `matrix` (default) | green on near-black, code-rain canvas |
| `cyberpunk` | cyan/blue on blue-black, synthwave grid, neon HUD |
| `amber` | amber/gold on warm-black, CRT scanlines and flicker |

How it works:

- `ThemeProvider` holds the active id, writes `document.documentElement.dataset.theme`,
  and persists to `localStorage` under the key `theme`.
- An inline script in `layout.tsx` applies the stored theme before paint, so
  there is no flash of the default palette. It must stay in `<head>`.
- Each palette is a block of CSS variables in `globals.css`
  (`--background`, `--foreground`, `--card-bg`, `--accent-*`, `--accent-rgb`, …).
  `--accent-rgb` and friends are space-separated channels so they can be used
  as `rgb(var(--accent-rgb) / 0.4)`.
- Each palette block also remaps Tailwind colour tokens — the whole `gray-*`
  ramp plus the `purple`, `pink`, `blue`, `cyan`, `green` and `emerald` shades
  the components actually use. That is why `text-purple-400` renders green in
  matrix and gold in amber. These remaps belong **inside** each
  `[data-theme]` block, never in a shared `.dark` block: a shared one applies
  to every palette and is how the matrix greens previously leaked everywhere.
- Per-theme motifs (grid, scanlines, nameplates) are keyed off
  `[data-theme="…"]` selectors in `globals.css`.

**When adding themed UI:** use a remapped token, a CSS variable, or the active
theme's `swatch` (from `THEMES` in `ThemeProvider`). Reaching for a colour
family that is *not* remapped — `red`, `orange`, `amber`, `yellow`, `lime`,
`teal` — pins that element to one colour in all three palettes. That is only
correct when the colour is semantic rather than decorative: form-validation
red, the amber "in progress" badge, the rocket flame, and the macOS
traffic-light dots (pinned to literal `#ff5f57 / #febc2e / #28c840` so the
remap cannot reach them).

**When adding a palette:** copy a complete existing block. Every variable must
be defined in every block — a value silently inherited from `matrix` is a bug,
not a default. `ScrollToTopRocket` also keys its idle animation off the active
theme (`THEME_IDLE` / `HALO_IDLE`): matrix hovers, cyberpunk neon-flickers,
amber CRT-glitches. A new palette needs an entry in both records or the
lookup is `undefined`.

Only *some shades* of each remapped family are defined. A badge built as
`bg-X-100 dark:bg-X-900/30 text-X-400` is safe for `purple` and `emerald`
only — `blue-900`, `cyan-400` and friends are not remapped and leak literal
Tailwind colour into amber and cyberpunk. Prefer
`bg-[rgb(var(--accent-rgb)/0.12)] text-[rgb(var(--accent-rgb))]` and let an
icon carry the meaning, as `Bookmarks.tsx` does.

## Interaction Layer

Global chrome lives in `layout.tsx` and is present on every route:

- **`⌘K` / `Ctrl+K`** — command palette (navigation, bookmark folders, theme,
  actions, social)
- **`F`** or **`⌘/Ctrl+Shift+F`** — toggle fullscreen
- **`T`** — cycle palette
- **`?`** — keyboard cheatsheet
- **Navbar star** — browser-style bookmark menu; folders cascade on hover
  (`lg` and up)
- **`StatusBar`** — bottom hint strip advertising the above, with the current
  section shown as `$ ~/about`. Desktop only.
- Konami code — easter egg

Convention: whichever component advertises a shortcut owns its key listener
(`ThemeSwitcher` owns `T`, `ShortcutsOverlay` owns `?`, `StatusBar` owns `F`).
Components that need to open another one do it through `shortcutsBus.ts`
rather than synthesising keystrokes.

Floating controls stack bottom-right and must not overlap: status bar (0–50px),
scroll-to-top rocket (68px), theme gear (132px) on desktop; the bar is hidden
below `md`, where the rocket and gear sit at 24px and 88px.

## SEO & Metadata

`trailingSlash: true` means every canonical URL ends in a slash. Three things
have to agree or the site contradicts itself: the canonical tag, the `og:url`,
and the entry in `sitemap.ts`. Write paths as `/projects/`, never `/projects`.

Sub-page metadata goes through `pageMetadata()` in `lib/metadata.ts`. Do not
hand-write a bare `{ title, description }` object on a page: Next inherits the
root `openGraph` block wholesale when a route doesn't define its own, so a page
that sets only `title` still ships the *homepage* title in `og:title` — the
link preview is wrong everywhere it's shared. `pageMetadata()` fills the
canonical, OG and Twitter blocks from one title/description/path.

Every route needs exactly one `<h1>`. The hero renders a different component
per palette (`MatrixIntro` / `CyberpunkIntro` / `AmberIntro`), so a heading
added to one variant is missing from the other two — and the prerendered HTML
only ever contains the default matrix variant. Change all three together.

`sitemap.ts` lists real routes only. Fragment URLs (`/#about`) are collapsed
into `/` by crawlers and earn nothing.

`JsonLd` is a **server** component. It has no hooks, and its `dateModified`
resolves at build time; making it a client component reintroduces a hydration
mismatch that changes every day after deploy.

The font is loaded as a variable font — `JetBrains_Mono({ subsets, display })`
with no `weight` array. Listing explicit weights emits five static files and
preloads one the page may not use; the variable file is a single 40 KB request
covering 100–800.

## Code Style

### Arrow functions only

Every function in `src/` and `scripts/` is an arrow function assigned to a
`const`. There are no `function` declarations and no `function` expressions
anywhere in the codebase — components, hooks, helpers, callbacks and build
scripts alike.

```typescript
export const assetPath = (path: string): string => { ... };
export const Navbar = () => { ... };
```

This is enforced by ESLint (`eslint.config.mjs`), so `pnpm lint` fails on any
`function` keyword:

- `func-style: ["error", "expression", { allowArrowFunctions: true }]`
- `prefer-arrow-callback`
- `no-restricted-syntax` blocking `FunctionDeclaration` and `FunctionExpression`

### Named exports only

Components and helpers are named exports, imported as
`import { Navbar } from "@/components/Navbar"`. `no-restricted-syntax` blocks
`ExportDefaultDeclaration`, with two exemptions where the default export is
not ours to choose:

- **`src/app/**`** — Next.js resolves `page`, `layout`, `robots` and `sitemap`
  by default export. A named export there is silently ignored, so the page
  404s or the route renders blank rather than failing the build. Every file
  convention Next.js may add later (`not-found`, `error`, `loading`, …) is
  covered by the same exemption.
- **`*.config.{mjs,ts,js}`** — `next.config.ts`, `postcss.config.mjs` and
  `eslint.config.mjs` are read by their tools as default exports.

Third-party default imports (`next/link`, `next/image`) and JSON modules
(`portfolio-data.json`) stay default imports — that is their published shape.

### Define before use

Arrow consts do not hoist, so declarations are ordered dependencies-first:
a helper always appears above its first caller, in module scope and inside
function bodies alike. `@typescript-eslint/no-use-before-define` enforces it.

## Commands

The package manager is **pnpm**, pinned by the `packageManager` field in
`package.json`. Run `corepack enable` once and the right version is used
automatically; CI reads the same field via `pnpm/action-setup`.

```bash
pnpm dev      # Start development server (runs sync-data first)
pnpm build    # Production build -> static export in out/
pnpm preview  # Build, then serve out/ locally
pnpm lint     # Run ESLint
```

There is no `pnpm start` — `next start` is incompatible with
`output: "export"`, so `preview` (`next build && pnpm dlx serve out`) is how
you look at a production build locally.

Turbopack is the default bundler for both `dev` and `build` in Next.js 16; no
flag is needed. `turbopack.root` is pinned to the project directory in
`next.config.ts` because a stray lockfile above the repo can otherwise make
Next infer the wrong workspace root.

`pnpm lint` currently reports pre-existing `react-hooks/set-state-in-effect`
errors. CI does not run lint; the deploy workflow runs `pnpm build` only.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`, triggered on push to `main`.
The build is a static export (`out/`). `NEXT_PUBLIC_BASE_PATH` supports project
pages; leave it unset for a custom domain. Use `assetPath()` from `lib/utils`
for asset URLs so they respect the base path.

Two things about `deploy.yml` that its shape does not show:

- The data env vars are declared at **job** level, not on the build step. The
  `postinstall` sync runs during `pnpm install`, so a step-level `env` would
  make install log a misleading "PORTFOLIO_DATA_URL not set" before the build
  fetched the real content.
- `NEXT_PUBLIC_BASE_PATH` is empty for the custom domain; it only takes a
  value (`/portfolio-website`) for project pages.

`.github/workflows/ci.yml` runs on every pull request. It builds **without**
`PORTFOLIO_DATA_URL`, so it exercises the placeholder path in
`data.config.example.ts` — that keeps the check working on forks, where
secrets are unavailable, and the code is what it gates. `deploy.yml` is what
verifies the real content fetch. Lint runs `continue-on-error` until the
standing `react-hooks` baseline is cleared; it cannot gate before then.

## Public Assets

```
public/
├── icon.svg              # Main favicon (SVG format)
├── favicon.ico           # (Optional) ICO favicon for older browsers
├── apple-touch-icon.png  # (Optional) Apple touch icon
├── cv.pdf                # Your CV/Resume (not tracked in git)
├── CV_README.md          # Instructions for CV setup
└── projects/             # Project images
    ├── .gitkeep
    └── ...
```

**Note:** CV and project images are not tracked in git. Each person cloning the repo should add their own.

## Gitignored Files

- `src/lib/portfolio-data.json` - Fetched portfolio content
- `src/lib/data.config.ts` - Legacy local config (no longer used; ignored so
  stale local copies don't get committed)
- `public/cv.pdf` - CV/Resume file
- `public/projects/*.jpg` - Project images (except .gitkeep)
- `public/projects/*.png` - Project images
- `.ai/` - AI assistant working files

## Notes for AI Assistants

### No comments

This codebase is deliberately comment-free. **Do not write comments.** Not
banner dividers, not section headers, not explanatory one-liners, not JSDoc,
not trailing notes on a line of code, not `{/* … */}` in JSX, not `/* … */`
in CSS. If you are tempted to explain something in a comment, rename the thing
or restructure it so the code says it instead.

The only exceptions are comments that *do* something rather than explain
something:

- lint and compiler directives (`eslint-disable-*`, `@ts-expect-error`)
- a shebang line
- licence headers required by a third party

This applies to every file you touch: `.ts`, `.tsx`, `.css`, `.mjs`, `.js`,
and the GitHub Actions workflows in `.github/workflows/`. A `#` comment in a
YAML step is the same thing as a `//` comment in a component — if a step needs
explaining, name the step so it explains itself and put the reasoning here.
Removing a comment while editing nearby code is fine and welcome. Prose belongs
in this file, the README, or a PR description — not in the source.

Markdown, JSON content, and the code samples inside `learnings` entries are
content, not code: comments there are fine and should be left alone.

### Everything else

- Arrow functions only — never write a `function` declaration or expression.
  See "Code Style" above; ESLint rejects them.

- Named exports only. `export default` is reserved for `src/app/**` (Next.js
  file conventions) and root tooling configs; ESLint rejects it elsewhere.

- All content flows through `portfolio-data.json` (or the example fallback) →
  `data.ts` → components; never hardcode personal data in components
- Never hardcode a themed colour; use the CSS variables or `THEMES` swatches
  (see Theme System)
- The Skills component displays skills as tags (no progress bars/percentages)
- Metadata in layout.tsx imports from config, not hardcoded
- Shared hooks live in `lib/hooks.ts` and shared motion variants in
  `lib/motion.ts` — reach for those before writing a local copy
- Prose (chat, commits, PRs, UI copy) is British English; code identifiers and
  CSS properties keep their required spelling

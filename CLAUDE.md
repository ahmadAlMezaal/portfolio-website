# Portfolio Website

A modern, responsive portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **UI**: React 19.2.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (via @tailwindcss/postcss)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Theming**: next-themes (light/dark mode)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata (imports from config)
│   ├── page.tsx        # Main page composing all sections
│   ├── learnings/
│   │   └── page.tsx    # /learnings — Field Notes page (build-time shiki highlighting)
│   └── globals.css     # Global styles + theme variables
├── components/
│   ├── Navbar.tsx      # Navigation with theme toggle
│   ├── NavAnchor.tsx   # Path-aware nav link (hash links work from any route)
│   ├── Hero.tsx        # Hero section with typing animation
│   ├── About.tsx       # About section with stats
│   ├── Skills.tsx      # Skills displayed as tags
│   ├── Experience.tsx  # Work experience timeline
│   ├── Projects.tsx    # Featured projects grid
│   ├── Learnings.tsx   # Field Notes cards with tabbed code editor
│   ├── Contact.tsx     # Contact form and info
│   ├── Footer.tsx      # Footer with links
│   └── ThemeProvider.tsx
├── lib/
│   ├── data.ts              # Re-exports config data + nav links
│   ├── data.config.example.ts # Placeholder content (fallback when no remote data)
│   └── highlight.ts         # Build-time shiki highlighting for learnings
└── types/
    └── index.ts             # Shared TypeScript interfaces (import from "@/types")
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

### Status Options

The `status` field in personalInfo accepts one of these predefined values:
- `"Open to Opportunities"` - Looking for new roles
- `"Open to Freelance"` - Available for freelance work
- `"Currently Employed"` - Not actively looking
- `"Available for Hire"` - Ready to start immediately
- `"Not Available"` - Not taking on work

### Social Links

Social links are now fully configurable. Only include the platforms you use:

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
      title: "Lead Engineer",        // Most recent role first
      period: "2023 - Present",
      description: "Current role description",
      achievements: ["Achievement 1"],
    },
    {
      title: "Software Engineer",    // Previous role
      period: "2021 - 2023",
      description: "Previous role description",
      achievements: ["Achievement 1"],
    },
  ],
}
```

When using multiple roles, the component displays:
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
  image: "/projects/image.jpg",  // Optional - shows placeholder if null/missing
  tags: ["Tech1", "Tech2"],
  links: [
    { type: "website", label: "Live Demo", url: "https://example.com" },
    { type: "github", label: "Source Code", url: "https://github.com/..." },
  ],
  featured: true,
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
- Empty `links: []` array shows "Private / available on request" badge
- `image: null` or missing image shows a gradient placeholder with folder icon

### Learnings / Field Notes

The `/learnings` page renders `learnings` entries as expandable cards with a
code-editor block. Each entry requires code in all three languages —
`typescript`, `go`, and `python` — which become the editor's filename tabs:

```typescript
{
  title: "Singleton",
  category: "pattern", // "pattern" | "law" | "paradigm" | "principle"
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

Highlighting happens at build time via shiki (`src/lib/highlight.ts`), so no
highlighter ships to the client. `currentlyLearning` renders as chips in the
page header. Both fields are optional; the page shows an empty state without
them.

### Favicon

The portfolio uses SVG favicon by default (`public/icon.svg`). To customize:
- Replace `public/icon.svg` with your own SVG icon
- For full browser support, also add `public/favicon.ico` and `public/apple-touch-icon.png`

## Theme System

Colors are defined as CSS variables in `globals.css`:

- Light theme: Warm off-white background (`#faf8f5`), soft dark text
- Dark theme: Near-black background (`#0a0a0a`), light text
- Both themes share accent colors (purple/pink/blue gradient)

## Commands

```bash
yarn dev      # Start development server
yarn build    # Production build
yarn start    # Start production server
yarn lint     # Run ESLint
```

## Public Assets

The `public/` folder structure for assets:

```
public/
├── icon.svg              # Main favicon (SVG format)
├── favicon.ico           # (Optional) ICO favicon for older browsers
├── apple-touch-icon.png  # (Optional) Apple touch icon
├── cv.pdf                # Your CV/Resume (not tracked in git)
├── CV_README.md          # Instructions for CV setup
└── projects/             # Project images
    ├── .gitkeep          # Instructions for project images
    ├── project1.jpg      # Your project images (not tracked in git)
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

- Do NOT add banner/section-divider comments like:
  ```
  // ---------------------------------------------------------------------------
  // SECTION NAME
  // ---------------------------------------------------------------------------
  ```
  Pre-existing banners may stay, but new sections get no banner — at most a
  short single-line comment when something genuinely needs explaining.

- All content flows through `portfolio-data.json` (or the example fallback) →
  `data.ts` → components; never hardcode personal data in components
- The Skills component displays skills as tags (no progress bars/percentages)
- Metadata in layout.tsx imports from config, not hardcoded
- Check `data.config.example.ts` for the expected config structure

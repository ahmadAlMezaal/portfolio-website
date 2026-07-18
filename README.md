# Portfolio Website

A modern, animated portfolio built with Next.js 16, React 19, and Three.js.

**Live:** [theaam.dev](https://theaam.dev)

## Features

- **3D Animated Hero** - Interactive Three.js background with floating particles
- **Pull-Cord Theme Toggle** - UK bathroom-style light bulb with string animation and click sound
- **Bubble Theme Transition** - Colored bubble expands from click point when switching themes
- **Mobile-First Projects** - Hover overlay on desktop, tap-friendly buttons on mobile
- **SEO Optimized** - JSON-LD structured data, sitemap, Open Graph images
- **Smooth Animations** - Framer Motion throughout with reduced motion support

## Tech Stack

| Category | Tech |
|----------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 3D | Three.js, React Three Fiber |
| Animations | Framer Motion |
| Theming | next-themes |

## Quick Start

```bash
# Install
yarn install

# Develop
yarn dev

# Build
yarn build
```

## Content

Everything the site renders comes from a single `portfolio.json`, fetched at
build time by `scripts/sync-data.mjs` from wherever `PORTFOLIO_DATA_URL`
points. The site itself contains no personal content — without a data source
it renders the placeholder in `src/lib/data.config.example.ts`, so a fresh
clone builds and runs as a template out of the box.

This instance reads from the private
[`portfolio-data`](https://github.com/ahmadAlMezaal/portfolio-data) repo
through the GitHub contents API, but any URL that returns the JSON works:
a public repo, a gist, object storage, or a headless CMS endpoint.

### Use it with your own content

1. Seed a `portfolio.json` from the template and fill it in — its shape is
   the `PortfolioConfig` interface in `src/types/index.ts`:

   ```bash
   node scripts/export-template.mjs > portfolio.json
   ```

2. Host it anywhere. For a private GitHub repo, use the contents API URL and
   a fine-grained PAT with `contents: read` on that repo:

   ```
   https://api.github.com/repos/<user>/<data-repo>/contents/portfolio.json
   ```

3. Point the build at it — locally via `.env.local`:

   ```bash
   PORTFOLIO_DATA_URL=<url>
   PORTFOLIO_DATA_TOKEN=<token>   # only for private sources
   ```

   and in CI by setting the `PORTFOLIO_DATA_TOKEN` secret and updating
   `PORTFOLIO_DATA_URL` in `.github/workflows/deploy.yml`.

4. Replace the deployment-specific assets: `public/CNAME` (your domain, or
   delete it), `public/cv.pdf`, project images in `public/projects/` and
   `public/assets/`, and regenerate `public/og-image.png` with
   `node scripts/generate-og-image.js` after a sync.

The sync script validates the JSON shape and fails the build loudly on a bad
fetch, so a broken source never deploys silently.

See [CLAUDE.md](./CLAUDE.md) for detailed configuration options.

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # React components
│   ├── Hero.tsx           # Hero with 3D background
│   ├── LightSwitch.tsx    # Pull-cord theme toggle
│   ├── ThemeTransition.tsx # Bubble animation
│   └── ...
└── lib/           # Data config & utilities
```

## License

MIT

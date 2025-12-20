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

## Customization

1. Copy `src/lib/data.config.example.ts` to `src/lib/data.config.ts`
2. Fill in your personal info, experience, and projects
3. Add your CV to `public/cv.pdf`
4. Add project images to `public/projects/`

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

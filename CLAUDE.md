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
│   └── globals.css     # Global styles + theme variables
├── components/
│   ├── Navbar.tsx      # Navigation with theme toggle
│   ├── Hero.tsx        # Hero section with typing animation
│   ├── About.tsx       # About section with stats
│   ├── Skills.tsx      # Skills displayed as tags
│   ├── Experience.tsx  # Work experience timeline
│   ├── Projects.tsx    # Featured projects grid
│   ├── Contact.tsx     # Contact form and info
│   ├── Footer.tsx      # Footer with links
│   └── ThemeProvider.tsx
└── lib/
    ├── data.ts              # Re-exports config data + nav links
    ├── data.types.ts        # TypeScript interfaces
    ├── data.config.ts       # Personal data (GITIGNORED)
    └── data.config.example.ts # Template for cloning
```

## Configuration System

All personal information is stored in `src/lib/data.config.ts` which is gitignored. This allows the repo to be public while keeping personal data private.

**To customize:**

1. Copy `src/lib/data.config.example.ts` to `src/lib/data.config.ts`
2. Fill in your personal information
3. Place your CV at `public/cv.pdf`
4. Add project images to `public/projects/`
5. (Optional) Replace `public/icon.svg` with your own favicon

**Config includes:**

- `siteMetadata`: SEO title, description, keywords, locale
- `personalInfo`: Name, title, bio, email, status, social links
- `roles`: Typing animation roles
- `stats`: Career statistics
- `skills`: Categorized skills (displayed as tags, no percentages)
- `experiences`: Work history
- `projects`: Portfolio projects
- `education`: Educational background
- `certifications`: Professional certifications

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

- `src/lib/data.config.ts` - Personal configuration
- `public/cv.pdf` - CV/Resume file
- `public/projects/*.jpg` - Project images (except .gitkeep)
- `public/projects/*.png` - Project images
- `.ai/` - AI assistant working files

## Notes for AI Assistants

- All personal data flows through `data.config.ts` → `data.ts` → components
- The Skills component displays skills as tags (no progress bars/percentages)
- Metadata in layout.tsx imports from config, not hardcoded
- Check `data.config.example.ts` for the expected config structure

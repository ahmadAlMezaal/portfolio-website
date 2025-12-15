// =============================================================================
// PORTFOLIO CONFIGURATION TEMPLATE
// =============================================================================
//
// HOW TO USE:
// 1. Copy this file and rename it to: data.config.ts
// 2. Fill in your personal information below
// 3. The data.config.ts file is gitignored, so your personal info stays private
//
// =============================================================================

import type { PortfolioConfig } from './data.types';

const config: PortfolioConfig = {
  // ---------------------------------------------------------------------------
  // SITE METADATA (used for SEO and social sharing)
  // ---------------------------------------------------------------------------
  siteMetadata: {
    title: "Your Name | Your Title",
    description: "A brief description of yourself for search engines and social sharing.",
    keywords: [
      "Your Title",
      "Skill 1",
      "Skill 2",
      "Your Location",
    ],
    locale: "en_GB", // e.g., "en_US", "en_GB", etc.
  },

  // ---------------------------------------------------------------------------
  // PERSONAL INFORMATION
  // ---------------------------------------------------------------------------
  personalInfo: {
    name: "Your Name",
    title: "Your Job Title",
    tagline: "Your catchy tagline or motto",
    // Status options: "Open to Opportunities" | "Open to Freelance" | "Currently Employed" | "Available for Hire" | "Not Available"
    status: "Open to Opportunities",
    email: "your.email@example.com",
    location: "City, Country",
    bio: `Write a brief bio about yourself here. This can span multiple lines.
    Talk about your passion, what drives you, and what makes you unique.
    Keep it professional but personable.`,
    resumeUrl: "/cv.pdf", // Place your CV in the public folder
    // Social links - add only the platforms you use
    // Supported platforms: github, linkedin, twitter, medium, youtube, instagram, facebook, dribbble, behance, stackoverflow, codepen, dev
    socialLinks: [
      { platform: "github", url: "https://github.com/yourusername" },
      { platform: "linkedin", url: "https://linkedin.com/in/yourusername" },
      // { platform: "twitter", url: "https://twitter.com/yourusername" },
      // { platform: "medium", url: "https://medium.com/@yourusername" },
      // Add more social links as needed...
    ],
  },

  // ---------------------------------------------------------------------------
  // ROLES (displayed in typing animation on hero section)
  // ---------------------------------------------------------------------------
  roles: [
    "Your Primary Role",
    "Another Role",
    "A Specialty",
    "Another Specialty",
  ],

  // ---------------------------------------------------------------------------
  // STATISTICS (displayed in About section)
  // ---------------------------------------------------------------------------
  stats: [
    { label: "Years Experience", value: "X+" },
    { label: "Projects Completed", value: "X+" },
    { label: "Happy Clients", value: "X+" },
    { label: "Technologies", value: "X+" },
  ],

  // ---------------------------------------------------------------------------
  // SKILLS (organized by category, level is percentage 0-100)
  // ---------------------------------------------------------------------------
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "Skill Name", level: 90 },
        { name: "Another Skill", level: 85 },
        // Add more skills...
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Skill Name", level: 88 },
        { name: "Another Skill", level: 80 },
        // Add more skills...
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Skill Name", level: 85 },
        { name: "Another Skill", level: 75 },
        // Add more skills...
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // WORK EXPERIENCE (most recent first)
  // ---------------------------------------------------------------------------
  // You can use either:
  // 1. Single role format (title, period, description, achievements)
  // 2. Multiple roles format (roles array) - for promotions at same company
  experiences: [
    // Example: Multiple roles at same company (promotions)
    {
      company: "Tech Company Inc.",
      companyUrl: "https://techcompany.com", // Optional: link to company website
      location: "San Francisco, CA",
      roles: [
        {
          title: "Lead Software Engineer",
          period: "2023 - Present",
          description: "Leading a team of 5 engineers on the core platform.",
          achievements: [
            "Promoted to lead after demonstrating technical excellence",
            "Mentored 3 junior developers",
            "Architected new microservices infrastructure",
          ],
        },
        {
          title: "Software Engineer",
          period: "2021 - 2023",
          description: "Full-stack development on the main product.",
          achievements: [
            "Built key features that increased user engagement by 40%",
            "Reduced API response times by 60%",
            "Introduced automated testing practices",
          ],
        },
      ],
    },
    // Example: Single role at a company
    {
      title: "Junior Developer",
      company: "Startup Co.",
      location: "Remote",
      period: "2019 - 2021",
      description: "Full-stack web development for early-stage startup.",
      achievements: [
        "Key achievement #1",
        "Key achievement #2",
        "Key achievement #3",
      ],
    },
    // Add more experiences...
  ],

  // ---------------------------------------------------------------------------
  // PROJECTS (featured projects appear first on the portfolio)
  // ---------------------------------------------------------------------------
  // Each project supports:
  //   - links: Array of { type, label, url } - website, github, appstore, playstore, case-study
  //   - image: Optional path - null shows a placeholder
  //   - imageFit: "cover" (default, fills card) or "contain" (shows full logo with padding)
  //   - status: "live" (default), "in_progress", or "private"
  //   - featured: true to show on homepage
  projects: [
    // Example: Live web project with screenshot
    {
      title: "Web Application",
      description: "Brief description of the project and what it does.",
      image: "/projects/project-screenshot.jpg",
      // imageFit: "cover", // Default - image fills the card
      tags: ["React", "Node.js", "PostgreSQL"],
      links: [
        { type: "website", label: "Live Demo", url: "https://project-url.com" },
        { type: "github", label: "Source Code", url: "https://github.com/yourusername/project" },
      ],
      featured: true,
      status: "live", // Default - no badge shown
    },
    // Example: Mobile app with logo image (use imageFit: "contain" for logos)
    {
      title: "iOS Mobile App",
      description: "A native iOS application available on the App Store.",
      image: "/projects/app-logo.png",
      imageFit: "contain", // Use "contain" for logos - shows full image with padding
      tags: ["Swift", "SwiftUI", "Core Data"],
      links: [
        { type: "appstore", label: "App Store", url: "https://apps.apple.com/app/id123456" },
        { type: "playstore", label: "Play Store", url: "https://play.google.com/store/apps/details?id=..." },
      ],
      featured: true,
      status: "live",
    },
    // Example: Work in progress project
    {
      title: "AI Dashboard",
      description: "An analytics dashboard with AI-powered insights - currently in development.",
      image: null, // No image yet - shows gradient placeholder
      tags: ["Next.js", "OpenAI", "TypeScript"],
      links: [
        { type: "github", label: "GitHub", url: "https://github.com/yourusername/ai-dashboard" },
      ],
      featured: true,
      status: "in_progress", // Shows amber "In Progress" badge
    },
    // Example: Private/internal project
    {
      title: "Enterprise Dashboard",
      description: "Internal analytics platform built for a Fortune 500 client.",
      image: "/projects/enterprise-logo.png",
      imageFit: "contain",
      tags: ["React", "D3.js", "AWS"],
      links: [], // Empty links + private status = "Available on request"
      featured: false,
      status: "private", // Shows gray "Private" badge, hides links
    },
    // Example: Case study
    {
      title: "Design System",
      description: "Comprehensive design system for a fintech startup.",
      image: "/projects/design-system.jpg",
      tags: ["Figma", "Storybook", "React"],
      links: [
        { type: "case-study", label: "Read Case Study", url: "/case-studies/design-system" },
        { type: "github", label: "Storybook", url: "https://github.com/yourusername/design-system" },
      ],
      featured: true,
      // status defaults to "live" when not specified
    },
    // Add more projects...
  ],

  // ---------------------------------------------------------------------------
  // EDUCATION
  // ---------------------------------------------------------------------------
  education: [
    {
      degree: "Degree Name",
      school: "University/School Name",
      period: "YYYY - YYYY",
      description: "Brief description or achievements.",
    },
    // Add more education entries...
  ],

  // ---------------------------------------------------------------------------
  // CERTIFICATIONS (simple list of certification names)
  // ---------------------------------------------------------------------------
  certifications: [
    "Certification Name 1",
    "Certification Name 2",
    "Certification Name 3",
  ],
};

export default config;

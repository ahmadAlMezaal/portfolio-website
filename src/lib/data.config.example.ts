// Placeholder content, rendered when scripts/sync-data.mjs has no
// PORTFOLIO_DATA_URL to fetch the real portfolio.json from.

import type { PortfolioConfig } from "@/types";

const config: PortfolioConfig = {
  // Site metadata (SEO and social sharing)
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
    siteUrl: "https://example.com", // deployed origin, no trailing slash
    twitterHandle: "@yourhandle", // optional
  },

  // Personal information
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
    ],
  },

  // Roles (hero typing animation)
  roles: [
    "Your Primary Role",
    "Another Role",
    "A Specialty",
    "Another Specialty",
  ],

  // Stats (About section)
  stats: [
    { label: "Years Experience", value: "X+" },
    { label: "Projects Completed", value: "X+" },
    { label: "Happy Clients", value: "X+" },
    { label: "Technologies", value: "X+" },
  ],

  // Skills (displayed as tags; level is 0-100)
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "Skill Name", level: 90 },
        { name: "Another Skill", level: 85 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Skill Name", level: 88 },
        { name: "Another Skill", level: 80 },
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Skill Name", level: 85 },
        { name: "Another Skill", level: 75 },
      ],
    },
  ],

  // Work experience (most recent first) — single-role fields, or a roles[] array for promotions at the same company
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
  ],

  // Projects — link types: website | github | appstore | playstore | case-study; status: "live" (default) | "in_progress" | "private"; featured: true shows on the homepage
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
  ],

  // Education
  education: [
    {
      degree: "Degree Name",
      school: "University/School Name",
      period: "YYYY - YYYY",
      description: "Brief description or achievements.",
    },
  ],

  // Certifications
  certifications: [
    "Certification Name 1",
    "Certification Name 2",
    "Certification Name 3",
  ],

  currentlyLearning: ["Topic one", "Topic two"],

  // Optional /learnings entries — code is required in all three languages;
  // categories: "pattern" | "law" | "paradigm" | "principle"
  learnings: [
    {
      title: "Singleton",
      category: "pattern",
      oneLiner: "Guarantee a single shared instance of something expensive.",
      code: {
        typescript: `let instance: Client | undefined;

export const getClient = (): Client => {
  instance ??= new Client();
  return instance;
};`,
        go: `var (
	client *Client
	once   sync.Once
)

func GetClient() *Client {
	once.Do(func() { client = New() })
	return client
}`,
        python: `from functools import lru_cache

@lru_cache(maxsize=1)
def get_client() -> Client:
    return Client()`,
      },
      fieldNote: "Where this showed up in your real work — the anecdote.",
      verdict: "Your one honest line of judgement about the concept.",
    },
  ],
};

export default config;


import type { PortfolioConfig } from "@/types";

export const exampleConfig: PortfolioConfig = {
  siteMetadata: {
    title: "Your Name | Your Title",
    description: "A brief description of yourself for search engines and social sharing.",
    keywords: [
      "Your Title",
      "Skill 1",
      "Skill 2",
      "Your Location",
    ],
    locale: "en_GB",
    siteUrl: "https://example.com",
    twitterHandle: "@yourhandle",
    launched: "2024-01-01",
  },

  personalInfo: {
    name: "Your Name",
    title: "Your Job Title",
    tagline: "Your catchy tagline or motto",
    status: "Open to Opportunities",
    email: "your.email@example.com",
    location: "City, Country",
    timezone: "Europe/London",
    bio: `Write a brief bio about yourself here. This can span multiple lines.
    Talk about your passion, what drives you, and what makes you unique.
    Keep it professional but personable.`,
    resumeUrl: "/cv.pdf",
    socialLinks: [
      { platform: "github", url: "https://github.com/yourusername" },
      { platform: "linkedin", url: "https://linkedin.com/in/yourusername" },
    ],
    knowsAbout: [
      "Software Engineering",
      "A Domain You Work In",
      "A Technology You Know Well",
    ],
  },

  roles: [
    "Your Primary Role",
    "Another Role",
    "A Specialty",
    "Another Specialty",
  ],

  stats: [
    { label: "Years Experience", value: "X+" },
    { label: "Projects Completed", value: "X+" },
    { label: "Happy Clients", value: "X+" },
    { label: "Technologies", value: "X+" },
  ],

  focusAreas: [
  ],

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

  experiences: [
    {
      company: "Tech Company Inc.",
      companyUrl: "https://techcompany.com",
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

  projects: [
    {
      title: "Web Application",
      description: "Brief description of the project and what it does.",
      image: "/projects/project-screenshot.jpg",
      tags: ["React", "Node.js", "PostgreSQL"],
      links: [
        { type: "website", label: "Live Demo", url: "https://project-url.com" },
        { type: "github", label: "Source Code", url: "https://github.com/yourusername/project" },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "iOS Mobile App",
      description: "A native iOS application available on the App Store.",
      image: "/projects/app-logo.png",
      imageFit: "contain",
      tags: ["Swift", "SwiftUI", "Core Data"],
      links: [
        { type: "appstore", label: "App Store", url: "https://apps.apple.com/app/id123456" },
        { type: "playstore", label: "Play Store", url: "https://play.google.com/store/apps/details?id=..." },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "AI Dashboard",
      description: "An analytics dashboard with AI-powered insights - currently in development.",
      image: null,
      tags: ["Next.js", "OpenAI", "TypeScript"],
      links: [
        { type: "github", label: "GitHub", url: "https://github.com/yourusername/ai-dashboard" },
      ],
      featured: true,
      status: "in_progress",
    },
    {
      title: "Enterprise Dashboard",
      description: "Internal analytics platform built for a Fortune 500 client.",
      image: "/projects/enterprise-logo.png",
      imageFit: "contain",
      tags: ["React", "D3.js", "AWS"],
      links: [],
      featured: false,
      status: "private",
    },
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
    },
  ],

  education: [
    {
      degree: "Degree Name",
      school: "University/School Name",
      period: "YYYY - YYYY",
      description: "Brief description or achievements.",
    },
  ],

  certifications: [
    "Certification Name 1",
    "Certification Name 2",
    "Certification Name 3",
  ],

  currentlyLearning: ["Topic one", "Topic two"],

  bookmarks: [
    {
      name: "react-native",
      description: "Things that changed how I ship mobile.",
      bookmarks: [
        {
          title: "Article title worth reading",
          url: "https://example.com/an-article",
          kind: "article",
          note: "Why this one earned a place — the line only you can write.",
          added: "2026-01",
        },
        {
          title: "owner/repository",
          url: "https://github.com/owner/repository",
          kind: "repo",
          note: "Read the source, not the docs.",
        },
      ],
    },
    {
      name: "tooling",
      description: "Small things that removed a whole class of problem.",
      bookmarks: [
        {
          title: "a-package-you-reach-for",
          url: "https://www.npmjs.com/package/example",
          kind: "package",
          note: "Replaced a hundred lines of glue code.",
        },
      ],
    },
  ],

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

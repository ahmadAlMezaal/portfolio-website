import { z } from "zod";
import type { PortfolioConfig } from "../src/types/index.ts";

const absoluteUrl = z.string().regex(/^https?:\/\//, "must be an absolute http(s) URL");

const statusOption = z.enum([
  "Open to Opportunities",
  "Open to Freelance",
  "Currently Employed",
  "Available for Hire",
  "Not Available",
]);

const socialPlatform = z.enum([
  "github",
  "linkedin",
  "twitter",
  "medium",
  "youtube",
  "instagram",
  "facebook",
  "dribbble",
  "behance",
  "stackoverflow",
  "codepen",
  "dev",
]);

const socialLink = z.object({
  platform: socialPlatform,
  url: absoluteUrl,
});

const siteMetadata = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  locale: z.string(),
  siteUrl: absoluteUrl,
  twitterHandle: z.string().optional(),
  launched: z.iso.date().optional(),
  repoUrl: absoluteUrl.optional(),
});

const personalInfo = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  status: statusOption,
  email: z.string(),
  location: z.string(),
  timezone: z.string().optional(),
  bio: z.string(),
  resumeUrl: z.string(),
  bookingUrl: z.string().optional(),
  socialLinks: z.array(socialLink),
  knowsAbout: z.array(z.string()).optional(),
  helpWith: z.array(z.string()).optional(),
});

const stat = z.object({
  label: z.string(),
  value: z.string(),
});

const skillCategory = z.object({
  category: z.string(),
  items: z.array(z.object({ name: z.string(), level: z.number() })),
});

const experienceRole = z.object({
  title: z.string(),
  period: z.string(),
  description: z.string(),
  achievements: z.array(z.string()),
});

const experience = z.object({
  company: z.string(),
  companyUrl: z.string().optional(),
  location: z.string(),
  title: z.string().optional(),
  period: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  roles: z.array(experienceRole).optional(),
});

const projectLink = z.object({
  type: z.enum(["website", "github", "appstore", "playstore", "case-study"]),
  label: z.string(),
  url: z.string(),
});

const project = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().nullish(),
  imageFit: z.enum(["cover", "contain"]).optional(),
  tags: z.array(z.string()),
  links: z.array(projectLink),
  featured: z.boolean(),
  status: z.enum(["live", "in_progress", "private"]).optional(),
  platform: z.enum(["mobile", "web", "tools"]).optional(),
});

const education = z.object({
  degree: z.string(),
  school: z.string(),
  period: z.string(),
  description: z.string(),
});

const learning = z.object({
  title: z.string(),
  category: z.enum(["pattern", "law", "paradigm", "principle"]),
  oneLiner: z.string(),
  code: z.object({
    typescript: z.string(),
    go: z.string(),
    python: z.string(),
  }),
  fieldNote: z.string(),
  verdict: z.string(),
});

const bookmark = z.object({
  title: z.string(),
  url: absoluteUrl,
  kind: z.enum(["article", "blog", "repo", "package", "docs", "video", "tool"]),
  note: z.string().optional(),
  added: z.string().optional(),
});

const bookmarkFolder = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  bookmarks: z.array(bookmark).min(1),
});

export const portfolioSchema = z.object({
  siteMetadata,
  personalInfo,
  roles: z.array(z.string()),
  stats: z.array(stat),
  skills: z.array(skillCategory),
  experiences: z.array(experience),
  projects: z.array(project),
  education: z.array(education),
  certifications: z.array(z.string()),
  learnings: z.array(learning).optional(),
  currentlyLearning: z.array(z.string()).optional(),
  focusAreas: z.array(z.string()).optional(),
  bookmarks: z.array(bookmarkFolder).optional(),
});

type Inferred = z.infer<typeof portfolioSchema>;

type AssertExtends<A extends B, B> = A;

export type SchemaMatchesPortfolioConfig = AssertExtends<Inferred, PortfolioConfig>;

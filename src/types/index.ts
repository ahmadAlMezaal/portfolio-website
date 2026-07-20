export type StatusOption =
  | "Open to Opportunities"
  | "Open to Freelance"
  | "Currently Employed"
  | "Available for Hire"
  | "Not Available";

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "medium"
  | "youtube"
  | "instagram"
  | "facebook"
  | "dribbble"
  | "behance"
  | "stackoverflow"
  | "codepen"
  | "dev";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  status: StatusOption;
  email: string;
  location: string;
  bio: string;
  resumeUrl: string;
  bookingUrl?: string;
  socialLinks: SocialLink[];
}

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
  locale: string;
  siteUrl: string;
  twitterHandle?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0-100 percentage
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

// Individual role within a company (for promotions/multiple positions)
export interface ExperienceRole {
  title: string;
  period: string;
  description: string;
  achievements: string[];
}

// Experience can be either:
// 1. Single role: uses title, period, description, achievements directly
// 2. Multiple roles (promotions): uses roles array, title/period/description/achievements are ignored
export interface Experience {
  company: string;
  companyUrl?: string;
  location: string;
  // Single role fields (used when roles array is not provided)
  title?: string;
  period?: string;
  description?: string;
  achievements?: string[];
  // Multiple roles at same company (promotions)
  roles?: ExperienceRole[];
}

export type ProjectLinkType =
  | "website"
  | "github"
  | "appstore"
  | "playstore"
  | "case-study";

export type ProjectStatus = "live" | "in_progress" | "private";

export interface ProjectLink {
  type: ProjectLinkType;
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string | null; // Optional - shows placeholder if missing
  imageFit?: "cover" | "contain"; // How to fit image: cover (default) or contain (for logos)
  tags: string[];
  links: ProjectLink[]; // Flexible links array - can be empty for private projects
  featured: boolean;
  status?: ProjectStatus; // live (default), in_progress, or private
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface NavLink {
  name: string;
  href: string; // "#section" for home page sections, "/path" for routes
}

// Categories and languages for the Field Notes / Learnings page
export type LearningCategory = "pattern" | "law" | "paradigm" | "principle";

export type LearningLanguage = "typescript" | "go" | "python";

export interface Learning {
  title: string;
  category: LearningCategory;
  oneLiner: string; // the concept in a single sentence
  code: Record<LearningLanguage, string>; // all three keys required — they fill the editor tabs
  fieldNote: string; // where this showed up in real work
  verdict: string; // one honest line of judgement
}

export interface PortfolioConfig {
  siteMetadata: SiteMetadata;
  personalInfo: PersonalInfo;
  roles: string[];
  stats: Stat[];
  skills: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  // Optional: powers the /learnings page. Omit both to hide the page content.
  learnings?: Learning[];
  currentlyLearning?: string[]; // short "currently exploring" chips
  // Optional: qualitative "focus" chips shown in the About section. When
  // present they replace the numeric stat tiles.
  focusAreas?: string[];
}

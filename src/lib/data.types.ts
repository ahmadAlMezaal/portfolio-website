// =============================================================================
// TYPE DEFINITIONS FOR PORTFOLIO DATA
// =============================================================================

// Available status options for the portfolio
export type StatusOption =
  | "Open to Opportunities"
  | "Open to Freelance"
  | "Currently Employed"
  | "Available for Hire"
  | "Not Available";

// Supported social media platforms
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
  companyUrl?: string; // Optional link to company website
  location: string;
  // Single role fields (used when roles array is not provided)
  title?: string;
  period?: string;
  description?: string;
  achievements?: string[];
  // Multiple roles at same company (promotions)
  roles?: ExperienceRole[];
}

// Supported project link types
export type ProjectLinkType =
  | "website"
  | "github"
  | "appstore"
  | "playstore"
  | "case-study";

// Project status
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
  href: string;
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
}

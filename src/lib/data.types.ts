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

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
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

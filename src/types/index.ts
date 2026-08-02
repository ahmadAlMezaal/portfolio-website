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
  timezone?: string;
  bio: string;
  resumeUrl: string;
  bookingUrl?: string;
  socialLinks: SocialLink[];
  knowsAbout?: string[];
  helpWith?: string[];
}

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
  locale: string;
  siteUrl: string;
  twitterHandle?: string;
  launched?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ExperienceRole {
  title: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Experience {
  company: string;
  companyUrl?: string;
  location: string;
  title?: string;
  period?: string;
  description?: string;
  achievements?: string[];
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
  image?: string | null;
  imageFit?: "cover" | "contain";
  tags: string[];
  links: ProjectLink[];
  featured: boolean;
  status?: ProjectStatus;
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

export type LearningCategory = "pattern" | "law" | "paradigm" | "principle";

export type LearningLanguage = "typescript" | "go" | "python";

export interface Learning {
  title: string;
  category: LearningCategory;
  oneLiner: string;
  code: Record<LearningLanguage, string>;
  fieldNote: string;
  verdict: string;
}

export type BookmarkKind =
  | "article"
  | "blog"
  | "repo"
  | "package"
  | "docs"
  | "video"
  | "tool";

export interface Bookmark {
  title: string;
  url: string;
  kind: BookmarkKind;
  note?: string;
  added?: string;
}

export interface BookmarkFolder {
  name: string;
  description?: string;
  bookmarks: Bookmark[];
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
  learnings?: Learning[];
  currentlyLearning?: string[];
  focusAreas?: string[];
  bookmarks?: BookmarkFolder[];
}

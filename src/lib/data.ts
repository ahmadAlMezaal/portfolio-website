// =============================================================================
// PORTFOLIO DATA EXPORTS
// =============================================================================
// This file re-exports all data from the config file and adds navigation links.
// Personal information is stored in data.config.ts (gitignored).
// See data.config.example.ts for the template format.
// =============================================================================

import remoteConfig from './portfolio-data.json';
import localConfig from './data.config';
import type {
  SiteMetadata,
  PersonalInfo,
  Stat,
  SkillCategory,
  Experience,
  Project,
  Education,
  NavLink,
  Learning,
} from "@/types";
import type { PortfolioConfig } from "@/types";

// Remote data (written by scripts/sync-data.mjs when PORTFOLIO_DATA_URL is
// set) wins over the local config fallback.
const config: PortfolioConfig =
  (remoteConfig as unknown as PortfolioConfig | null) ?? localConfig;

// Re-export all config data
export const siteMetadata: SiteMetadata = config.siteMetadata;
export const personalInfo: PersonalInfo = config.personalInfo;
export const roles: string[] = config.roles;
export const stats: Stat[] = config.stats;
export const skills: SkillCategory[] = config.skills;
export const experiences: Experience[] = config.experiences;
export const projects: Project[] = config.projects;
export const education: Education[] = config.education;
export const certifications: string[] = config.certifications;
export const learnings: Learning[] = config.learnings ?? [];
export const currentlyLearning: string[] = config.currentlyLearning ?? [];

// Navigation links (not personal data, kept here)
export const navLinks: NavLink[] = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Learnings", href: "/learnings" },
  { name: "Contact", href: "#contact" },
];

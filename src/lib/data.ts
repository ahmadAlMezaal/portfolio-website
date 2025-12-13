// =============================================================================
// PORTFOLIO DATA EXPORTS
// =============================================================================
// This file re-exports all data from the config file and adds navigation links.
// Personal information is stored in data.config.ts (gitignored).
// See data.config.example.ts for the template format.
// =============================================================================

import config from './data.config';
import type {
  PersonalInfo,
  Stat,
  SkillCategory,
  Experience,
  Project,
  Education,
  NavLink,
} from './data.types';

// Re-export all config data
export const personalInfo: PersonalInfo = config.personalInfo;
export const roles: string[] = config.roles;
export const stats: Stat[] = config.stats;
export const skills: SkillCategory[] = config.skills;
export const experiences: Experience[] = config.experiences;
export const projects: Project[] = config.projects;
export const education: Education[] = config.education;
export const certifications: string[] = config.certifications;

// Navigation links (not personal data, kept here)
export const navLinks: NavLink[] = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

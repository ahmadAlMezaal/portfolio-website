// =============================================================================
// TYPE DEFINITIONS FOR PORTFOLIO DATA
// =============================================================================

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  status: string;
  email: string;
  location: string;
  bio: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
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
  personalInfo: PersonalInfo;
  roles: string[];
  stats: Stat[];
  skills: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
}

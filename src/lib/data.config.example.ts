// =============================================================================
// PORTFOLIO CONFIGURATION TEMPLATE
// =============================================================================
//
// HOW TO USE:
// 1. Copy this file and rename it to: data.config.ts
// 2. Fill in your personal information below
// 3. The data.config.ts file is gitignored, so your personal info stays private
//
// =============================================================================

import type { PortfolioConfig } from './data.types';

const config: PortfolioConfig = {
  // ---------------------------------------------------------------------------
  // PERSONAL INFORMATION
  // ---------------------------------------------------------------------------
  personalInfo: {
    name: "Your Name",
    title: "Your Job Title",
    tagline: "Your catchy tagline or motto",
    status: "Available for Freelance", // or "Open to Work", "Currently Employed", etc.
    email: "your.email@example.com",
    location: "City, Country",
    bio: `Write a brief bio about yourself here. This can span multiple lines.
    Talk about your passion, what drives you, and what makes you unique.
    Keep it professional but personable.`,
    resumeUrl: "/cv.pdf", // Place your CV in the public folder
    socialLinks: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      twitter: "https://twitter.com/yourusername",
    },
  },

  // ---------------------------------------------------------------------------
  // ROLES (displayed in typing animation on hero section)
  // ---------------------------------------------------------------------------
  roles: [
    "Your Primary Role",
    "Another Role",
    "A Specialty",
    "Another Specialty",
  ],

  // ---------------------------------------------------------------------------
  // STATISTICS (displayed in About section)
  // ---------------------------------------------------------------------------
  stats: [
    { label: "Years Experience", value: "X+" },
    { label: "Projects Completed", value: "X+" },
    { label: "Happy Clients", value: "X+" },
    { label: "Technologies", value: "X+" },
  ],

  // ---------------------------------------------------------------------------
  // SKILLS (organized by category, level is percentage 0-100)
  // ---------------------------------------------------------------------------
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "Skill Name", level: 90 },
        { name: "Another Skill", level: 85 },
        // Add more skills...
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Skill Name", level: 88 },
        { name: "Another Skill", level: 80 },
        // Add more skills...
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Skill Name", level: 85 },
        { name: "Another Skill", level: 75 },
        // Add more skills...
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // WORK EXPERIENCE (most recent first)
  // ---------------------------------------------------------------------------
  experiences: [
    {
      title: "Job Title",
      company: "Company Name",
      location: "City, Country or Remote",
      period: "YYYY - Present",
      description: "Brief description of your role and responsibilities.",
      achievements: [
        "Key achievement #1",
        "Key achievement #2",
        "Key achievement #3",
      ],
    },
    // Add more experiences...
  ],

  // ---------------------------------------------------------------------------
  // PROJECTS (featured projects appear first on the portfolio)
  // ---------------------------------------------------------------------------
  projects: [
    {
      title: "Project Name",
      description: "Brief description of the project and what it does.",
      image: "/projects/project-image.jpg", // Place images in public/projects/
      tags: ["Tech1", "Tech2", "Tech3"],
      liveUrl: "https://project-url.com",
      githubUrl: "https://github.com/yourusername/project",
      featured: true, // Set to true to highlight this project
    },
    // Add more projects...
  ],

  // ---------------------------------------------------------------------------
  // EDUCATION
  // ---------------------------------------------------------------------------
  education: [
    {
      degree: "Degree Name",
      school: "University/School Name",
      period: "YYYY - YYYY",
      description: "Brief description or achievements.",
    },
    // Add more education entries...
  ],

  // ---------------------------------------------------------------------------
  // CERTIFICATIONS (simple list of certification names)
  // ---------------------------------------------------------------------------
  certifications: [
    "Certification Name 1",
    "Certification Name 2",
    "Certification Name 3",
  ],
};

export default config;

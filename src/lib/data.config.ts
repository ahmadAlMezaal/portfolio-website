// =============================================================================
// PORTFOLIO CONFIGURATION FILE
// =============================================================================
// This file contains all your personal information for the portfolio.
// Copy data.config.example.ts to data.config.ts and fill in your details.
// This file is gitignored to keep your personal information private.
// =============================================================================

import type { PortfolioConfig } from "./data.types";

const config: PortfolioConfig = {
  // ---------------------------------------------------------------------------
  // SITE METADATA (used for SEO and social sharing)
  // ---------------------------------------------------------------------------
  siteMetadata: {
    title: "Ahmad Al Mezaal | Senior Software Engineer",
    description:
      "Senior Software Engineer specialising in fintech, open banking, and building resilient cloud-native systems at scale.",
    keywords: [
      "Senior Software Engineer",
      "Backend Engineer",
      "Fintech",
      "Open Banking",
      "Node.js",
      "TypeScript",
      "AWS",
      "Cloud-Native",
      "London",
    ],
    locale: "en_GB",
  },

  // ---------------------------------------------------------------------------
  // PERSONAL INFORMATION
  // ---------------------------------------------------------------------------
  personalInfo: {
    name: "Ahmad Al Mezaal",
    title: "Senior Software Engineer",
    tagline: "Building resilient, cloud-native systems at scale",
    status: "Open to Freelance",
    email: "ahmad.hmazaal@gmail.com",
    location: "London, United Kingdom",
    bio: `Senior Software Engineer with strong experience designing, building, and scaling backend and full-stack systems in high-growth startup environments. Specialised in fintech and open banking, with a proven track record delivering secure, high-performance APIs, event-driven architectures, and third-party integrations at scale.

I focus on building resilient, cloud-native systems on AWS, designing data pipelines for deduplication, enrichment, and orchestration, while balancing technical excellence with product and business impact. I own systems from concept to production.`,
    resumeUrl: "/cv.pdf",
    bookingUrl: "https://calendly.com/ahmad-al-mezaal/30min",
    socialLinks: [
      { platform: "github", url: "https://github.com/ahmadAlMezaal" },
      { platform: "linkedin", url: "https://linkedin.com/in/ahmadAlMezaal" },
      { platform: "medium", url: "https://medium.com/@ahmad.almezaal" },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROLES (displayed in typing animation on hero section)
  // ---------------------------------------------------------------------------
  roles: [
    "Senior Software Engineer",
    "Backend Specialist",
    "Fintech Engineer",
    "Cloud-Native Developer",
  ],

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------
  stats: [
    { label: "Years Experience", value: "6+" },
    { label: "Projects Completed", value: "20+" },
    { label: "Clients Served", value: "10+" },
    { label: "Technologies Used", value: "15+" },
  ],

  // ---------------------------------------------------------------------------
  // SKILLS (organized by category, level is percentage 0-100)
  // ---------------------------------------------------------------------------
  skills: [
    {
      category: "Backend & Data",
      items: [
        { name: "Node.js / NestJS", level: 95 },
        { name: "TypeScript", level: 95 },
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 88 },
        { name: "API Design", level: 92 },
        { name: "Event-Driven Systems", level: 88 },
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        { name: "AWS (Lambda, SQS, RDS, etc.)", level: 90 },
        { name: "Docker", level: 88 },
        { name: "Kubernetes / EKS", level: 82 },
        { name: "Terraform", level: 80 },
        { name: "CI/CD Pipelines", level: 90 },
      ],
    },
    {
      category: "Frontend & Mobile",
      items: [
        { name: "React", level: 88 },
        { name: "React Native", level: 85 },
        { name: "Redux", level: 82 },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // WORK EXPERIENCE
  // ---------------------------------------------------------------------------
  experiences: [
    {
      title: "Senior Software Engineer",
      company: "Shuffle Finance",
      location: "London, UK",
      period: "Aug 2024 - Present",
      description:
        "Building and scaling Open Banking APIs and data pipelines in a high-growth fintech environment.",
      achievements: [
        "Built Open Banking APIs processing 10M+ transactions/month with 99.99% uptime",
        "Designed transaction deduplication and enrichment pipelines, improving data accuracy by 35%",
        "Introduced hybrid serverless + containerised architecture, reducing costs by 20% and increasing throughput by 40%",
        "Implemented monitoring and alerting, reducing incident response time from hours to minutes",
        "Collaborated with product/design to prioritise features, ensuring engineering decisions directly supported faster feature delivery and higher customer satisfaction.",
      ],
    },
    {
      company: "ZIM Connections",
      location: "London, UK",
      roles: [
        {
          title: "Lead Software Engineer",
          period: "Apr 2022 - Aug 2024",
          description:
            "Led a team of engineers building backend services and mobile applications for a global eSIM platform.",
          achievements: [
            "Led team of 3 engineers, increasing delivery velocity by 40%",
            "Architected backend services and React Native apps supporting 100k+ users worldwide",
            "Optimised PostgreSQL and MongoDB queries, reducing API response times by 50%",
            "Integrated Stripe payments and eSIM provider APIs, enabling 200k+ secure transactions",
            "Built CI/CD pipelines accelerating release cycles by 70%",
          ],
        },
        {
          title: "Full-Stack Engineer",
          period: "Sep 2021 - Apr 2022",
          description:
            "Built and maintained scalable applications using Node.js, React.js, and React Native.",
          achievements: [
            "Improved API performance by 30% through indexing and query optimisation",
            "Integrated multiple third-party APIs (authentication, payments, eSIM)",
            "Established Jest testing framework, raising unit test coverage to 80%",
            "Supported smooth deployments via CI/CD automation",
          ],
        },
      ],
    },
    {
      title: "Product Engineer (Open Source)",
      company: "Athena Group of Companies",
      location: "Remote",
      period: "Jan 2021 - Dec 2021",
      description:
        "Delivered product and performance enhancements to a crypto-focused social platform.",
      achievements: [
        "Delivered 25+ product and performance enhancements",
        "Implemented mintable posts, optimised pagination, and real-time chat in React Native",
        "Reverse-engineered and integrated external APIs, increasing DAUs by 20%",
      ],
    },
    {
      title: "Mobile Developer",
      company: "HelloTree",
      location: "Jounieh, Lebanon",
      period: "Jul 2020 - Jan 2021",
      description:
        "Built and launched client-facing web and mobile applications.",
      achievements: [
        "Built and launched 4 client-facing web and mobile apps",
        "Optimised React Native sailing app, reducing load times by 30%",
        "Collaborated with clients and designers to deliver production-ready features",
      ],
    },
    {
      title: "Lecturer",
      company: "Geek Express",
      location: "Beirut, Lebanon",
      period: "Aug 2019 - Jul 2020",
      description:
        "Delivered hands-on instruction in web development technologies.",
      achievements: [
        "Taught HTML, CSS, JavaScript, and Bootstrap to aspiring developers",
        "Mentored students through real-world projects, improving completion rates by 25%+",
        "Designed structured lesson plans and debugging guides",
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // PROJECTS
  // ---------------------------------------------------------------------------
  projects: [
    {
      title: "Open Banking Platform",
      description:
        "High-performance Open Banking APIs processing 10M+ transactions monthly with 99.99% uptime, powering customer rewards and financial insights.",
      image: "/projects/openbanking.jpg",
      tags: ["Node.js", "AWS", "PostgreSQL", "Event-Driven"],
      liveUrl: "https://shuffle.com",
      githubUrl: "",
      featured: true,
    },
    {
      title: "Global eSIM Platform",
      description:
        "Backend services and React Native mobile apps supporting 100k+ users worldwide with integrated payments and eSIM provisioning.",
      image: "/projects/esim.jpg",
      tags: ["React Native", "Node.js", "Stripe", "MongoDB"],
      liveUrl: "https://zimconnections.com",
      githubUrl: "",
      featured: true,
    },
    {
      title: "Transaction Data Pipeline",
      description:
        "Scalable data pipeline for transaction deduplication and enrichment, improving data accuracy by 35% for user-facing insights.",
      image: "/projects/pipeline.jpg",
      tags: ["AWS Lambda", "SQS", "DynamoDB", "TypeScript"],
      liveUrl: "",
      githubUrl: "",
      featured: true,
    },
    {
      title: "Crypto Social Platform",
      description:
        "Open-source contributions to a crypto-focused social platform with mintable posts, real-time chat, and optimised pagination.",
      image: "/projects/crypto.jpg",
      tags: ["React Native", "Node.js", "WebSockets"],
      liveUrl: "",
      githubUrl: "",
      featured: false,
    },
  ],

  // ---------------------------------------------------------------------------
  // EDUCATION
  // ---------------------------------------------------------------------------
  education: [
    {
      degree: "BSc in Computer Science",
      school: "American University of Science & Technology",
      period: "Feb 2018 - Jun 2021",
      description: "Beirut, Lebanon",
    },
  ],

  // ---------------------------------------------------------------------------
  // CERTIFICATIONS
  // ---------------------------------------------------------------------------
  certifications: [
    "DevOps & Cloud (Docker, Kubernetes, Terraform, Ansible) - Simplilearn",
  ],
};

export default config;

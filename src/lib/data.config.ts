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
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/ahmad-al-mezaal/",
      },
      { platform: "medium", url: "https://medium.com/@ahmad.almezaal" },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROLES (displayed in typing animation on hero section)
  // ---------------------------------------------------------------------------
  roles: [
    "Senior Software Engineer",
    "Product Engineer",
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
        { name: "Next.js", level: 60 },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // WORK EXPERIENCE
  // ---------------------------------------------------------------------------
  experiences: [
    {
      title: "Senior Software Engineer",
      company: "Borderless",
      companyUrl: "https://www.getborderless.co.uk/",
      location: "London, UK",
      period: "Nov 2025 - Present",
      description:
        "Architecting AI-driven features and automating complex immigration workflows for a high-autonomy visa processing platform.",
      achievements: [
        "Architected AI-driven features using OpenAI and Anthropic APIs, automating complex immigration workflows and enabling semantic search to reduce manual data entry",
        "Championed AI-native development, leveraging LLM workflows to accelerate feature delivery and prototype autonomous agents for high-autonomy platform logic",
        "Partnered with Product teams to translate intricate UK immigration policies into scalable backend logic, driving the platform's ability to process visas autonomously",
        "Engineered resilient integrations with third-party HR systems and Stripe, automating complex financial flows including invoicing and card issuance",
        "Enhanced system reliability and performance by implementing comprehensive monitoring, optimizing database queries, and reducing latency for data-heavy dashboards",
      ],
    },
    {
      title: "Senior Software Engineer",
      company: "Shuffle Finance",
      companyUrl: "https://getshuffle.co.uk/",
      location: "London, UK",
      period: "Aug 2024 - Oct 2025",
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
      companyUrl: "https://zimconnections.com",
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
      company: "DeSofy",
      companyUrl: "https://www.deso.com/",
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
      companyUrl: "https://hellotree.com/",
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
      companyUrl: "https://www.geekexpress.com/en",
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
      title: "Shuffle Rewards",
      description:
        "Cashback rewards app for eating out — members connect their bank account, visit partner venues, and earn cashback when qualifying purchases are detected and approved.",
      image: "/assets/shuffle-rewards-logo.png",
      imageFit: "contain",
      tags: ["Fintech", "Open Banking", "Rewards", "Mobile"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://www.getshuffle.co.uk",
        },
        {
          type: "playstore",
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.shuffle.finance&pcampaignid=web_share",
        },
        {
          type: "appstore",
          label: "App Store",
          url: "https://apps.apple.com/gb/app/shuffle-rewards/id6474543590",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "ZIM: eSIM Calls & Data Plans",
      description:
        "UK eSIM marketplace offering flexible mobile plans and travel eSIMs — get set up quickly, stay connected in 200+ destinations, and manage your plan directly from the app.",
      image: "/assets/zim-logo.jpg",
      imageFit: "contain",
      tags: ["React Native", "Node.js", "Payments", "eSIM"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://www.zimconnections.com",
        },
        {
          type: "appstore",
          label: "App Store",
          url: "https://apps.apple.com/gb/app/zim-esim-calls-data-plans/id1611244114",
        },
        {
          type: "playstore",
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.zim_cli&pcampaignid=web_share",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "Desofy (DeSo Mobile)",
      description:
        "Mobile client for the DeSo (Decentralized Social) blockchain — a censorship-resistant, decentralised social experience where users can connect, post, and own their content as a gateway into the wider DeSo ecosystem.",
      image: "/assets/desofy-logo.jpg",
      imageFit: "contain",
      tags: ["React Native", "Blockchain", "DeSo", "Mobile"],
      links: [
        { type: "website", label: "Website", url: "https://www.deso.com" },
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/mobileApp",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "The Alfred Brief",
      description:
        "Daily intelligence briefing product: Python scrapers collect UK signals (immigration, tech, finance), AI summarises them, and users curate a personalised brief via a Next.js dashboard — delivered by email every morning.",
      image: null,
      tags: ["Next.js", "Python", "Terraform", "Supabase", "Resend"],
      links: [
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/the-alfred-brief",
        },
      ],
      featured: true,
      status: "in_progress",
    },
    {
      title: "Friday",
      description:
        "Habit and identity-building app inspired by streak systems — designed to help users build routines, stay consistent, and track progress with a clean, mobile-first experience.",
      image: null,
      tags: ["React Native", "TypeScript", "UX", "Product"],
      links: [
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/friday",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "Healthcare Companion (University Project)",
      description:
        "University capstone mobile app connecting healthcare professionals with patients to improve communication and support during COVID-era restrictions — including appointment support, medication guidance, awareness features, and early exploration of ML-based health insights.",
      image: null,
      tags: ["Mobile", "Healthcare", "Product", "AI/ML"],
      links: [],
      featured: false,
      status: "private",
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

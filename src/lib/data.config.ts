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
      "Senior Software Engineer building products end to end — from AI agents to scalable APIs and resilient cloud-native systems — with deep experience across fintech, open banking, and high-growth startups.",
    keywords: [
      "Senior Software Engineer",
      "AI Engineer",
      "AI Agents",
      "LLM Applications",
      "MCP",
      "Product Engineer",
      "Fintech",
      "Open Banking",
      "TypeScript",
      "Node.js",
      "AWS",
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
    tagline: "Shipping products that turn complex problems into simple, AI-powered experiences",
    status: "Open to Freelance",
    email: "ahmad.hmazaal@gmail.com",
    location: "London, United Kingdom",
    bio: `Senior Software Engineer with strong experience designing, building, and scaling backend and full-stack systems in high-growth startup environments. Specialised in fintech and open banking, with a proven track record delivering secure, high-performance APIs, event-driven architectures, and third-party integrations at scale.

I focus on building resilient, cloud-native systems on AWS, designing data pipelines for deduplication, enrichment, and orchestration, while balancing technical excellence with product and business impact. I own systems from concept to production.`,
    resumeUrl: "https://drive.google.com/uc?export=download&id=14wpZXja-Cc09haxdR4YNmtQsR6TXujJ9",
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
      title: "Munin",
      description:
        "AI-powered relocation assistant for people moving to London — Munin learns what matters to you, then matches you to the right neighbourhoods with personalised, data-backed recommendations that make settling in a new city far less daunting.",
      image: "/assets/munin-og.png",
      tags: ["AI", "Serverless", "TypeScript", "LLM"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://www.usemunin.com",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "Atomic Streaks",
      description:
        "Identity-based habit tracking meets aggressive gamification — declare who you want to become, track habits with streaks, enjoy focus sessions with ambient soundscapes, and experience premium polish with 60fps animations and haptic feedback.",
      image: "/assets/atomic-streaks-logo.png",
      imageFit: "contain",
      tags: ["React Native", "TypeScript", "Expo", "Mobile"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://atomicstreaks.co",
        },
        {
          type: "appstore",
          label: "App Store",
          url: "https://apps.apple.com/gb/app/atomic-streaks/id6756895497",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "Noctra",
      description:
        "Your repo's night watch — an autonomous agent that turns Linear tickets into pull requests. Move a ticket to Next, go to sleep, wake up to PRs. Continuously sweeps your board, routing each ticket to the right repo and running them concurrently across projects.",
      image: "/assets/noctra-og.png",
      tags: ["Go", "AI Agents", "Linear", "GitHub", "Automation"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://getnoctra.dev",
        },
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/noctra",
        },
      ],
      featured: true,
      status: "live",
    },
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
          type: "appstore",
          label: "App Store",
          url: "https://apps.apple.com/gb/app/shuffle-rewards/id6474543590",
        },
        {
          type: "playstore",
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.shuffle.finance&pcampaignid=web_share",
        },
      ],
      featured: true,
      status: "live",
    },
    {
      title: "OneNote MCP",
      description:
        "An MCP server that brings Microsoft OneNote into Claude, Cursor, and any MCP-compatible client — list notebooks and sections, full-text search across pages, read pages as Markdown, and create or delete pages from natural language.",
      image: null,
      tags: ["TypeScript", "MCP", "Microsoft Graph", "AI Tools"],
      links: [
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/onenote-mcp",
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
      featured: false,
      status: "in_progress",
    },
    {
      title: "Friday (Claude-Primary Engineering Agent)",
      description:
        "Claude-primary CLI agent for software engineering tasks, combining safe repo operations, controlled automation, and optional AI advisors — with Claude as the single decision-maker.",
      image: null,
      tags: ["CLI", "AI Agents", "TypeScript", "MCP", "Developer Tools"],
      links: [
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/friday",
        },
      ],
      featured: false,
      status: "live",
    },
    {
      title: "Mystic Decision Tools",
      description:
        "AI-powered decision-making game with physics-based animations, procedural audio, and Gemini-generated explanations — blending playful UX with modern web tech.",
      image: null,
      tags: ["JavaScript", "Gemini", "Canvas", "Interactive UI"],
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://ahmadalmezaal.github.io/decidr/",
        },
        {
          type: "github",
          label: "GitHub",
          url: "https://github.com/ahmadAlMezaal/decidr",
        },
      ],
      featured: false,
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

  // ---------------------------------------------------------------------------
  // CURRENTLY LEARNING (short chips shown at the top of /learnings)
  // ---------------------------------------------------------------------------
  currentlyLearning: [
    "Model Context Protocol (MCP)",
    "Go",
    "LLM agent orchestration",
  ],

  // ---------------------------------------------------------------------------
  // LEARNINGS / FIELD NOTES (powers the /learnings page)
  // ---------------------------------------------------------------------------
  learnings: [
    {
      title: "Singleton",
      category: "pattern",
      oneLiner:
        "Guarantee a single shared instance of something expensive or stateful.",
      code: {
        typescript: `// One client per Lambda container — a fresh client
// per invocation exhausts the RDS connection pool.
let prisma: PrismaClient | undefined;

export const getPrisma = (): PrismaClient => {
  prisma ??= new PrismaClient();
  return prisma;
};`,
        go: `var (
	db   *sql.DB
	once sync.Once
)

// DB lazily opens the pool exactly once,
// no matter how many goroutines race here.
func DB() *sql.DB {
	once.Do(func() {
		db, _ = sql.Open("postgres", dsn)
	})
	return db
}`,
        python: `from functools import lru_cache

@lru_cache(maxsize=1)
def get_client() -> Client:
    # Cached at module level — the Pythonic singleton.
    return Client(dsn=settings.DSN)`,
      },
      fieldNote:
        "A Lambda that opened a fresh database client on every invocation melted our RDS connection limit during a traffic spike. One cached instance per container fixed it in four lines.",
      verdict:
        "Use sparingly — in TypeScript a module export is already a singleton; in Go, sync.Once is the whole pattern.",
    },
    {
      title: "Circuit Breaker",
      category: "pattern",
      oneLiner:
        "Stop calling a failing dependency for a while instead of queueing retries behind it.",
      code: {
        typescript: `let failures = 0;
let openUntil = 0;

export async function callBank<T>(fn: () => Promise<T>) {
  if (Date.now() < openUntil) throw new Error("circuit open");
  try {
    const result = await fn();
    failures = 0;
    return result;
  } catch (err) {
    if (++failures >= 5) openUntil = Date.now() + 30_000;
    throw err;
  }
}`,
        go: `func (b *Breaker) Call(fn func() error) error {
	if time.Now().Before(b.openUntil) {
		return ErrCircuitOpen
	}
	if err := fn(); err != nil {
		b.failures++
		if b.failures >= 5 {
			b.openUntil = time.Now().Add(30 * time.Second)
		}
		return err
	}
	b.failures = 0
	return nil
}`,
        python: `def call(self, fn):
    if time.monotonic() < self.open_until:
        raise CircuitOpen()
    try:
        result = fn()
    except Exception:
        self.failures += 1
        if self.failures >= 5:
            self.open_until = time.monotonic() + 30
        raise
    self.failures = 0
    return result`,
      },
      fieldNote:
        "Open banking APIs go down more often than their status pages admit. A breaker in front of one flaky bank connector stopped a slow upstream from queueing retries and dragging the whole aggregation pipeline down with it.",
      verdict:
        "Essential in front of third parties you don't control. Trip fast, recover slowly.",
    },
    {
      title: "Factory Method",
      category: "pattern",
      oneLiner:
        "Let one place decide which concrete implementation to construct, behind a shared interface.",
      code: {
        typescript: `const providers = {
  stripe: () => new StripeGateway(),
  truelayer: () => new TrueLayerGateway(),
  plaid: () => new PlaidGateway(),
} satisfies Record<string, () => Gateway>;

export const gatewayFor = (provider: keyof typeof providers) =>
  providers[provider]();`,
        go: `func NewGateway(provider string) (Gateway, error) {
	switch provider {
	case "stripe":
		return &StripeGateway{}, nil
	case "truelayer":
		return &TrueLayerGateway{}, nil
	case "plaid":
		return &PlaidGateway{}, nil
	default:
		return nil, fmt.Errorf("unknown provider %q", provider)
	}
}`,
        python: `GATEWAYS = {
    "stripe": StripeGateway,
    "truelayer": TrueLayerGateway,
    "plaid": PlaidGateway,
}

def gateway_for(provider: str) -> Gateway:
    try:
        return GATEWAYS[provider]()
    except KeyError:
        raise UnknownProvider(provider)`,
      },
      fieldNote:
        "Every open banking aggregator is secretly a factory: one interface, a dozen bank connectors behind it. Adding a bank became a config entry plus one class, instead of a new branch in every call site.",
      verdict:
        "The most useful classic. If you're switching on a type string in more than one place, you want a factory.",
    },
    {
      title: "Builder",
      category: "pattern",
      oneLiner:
        "Assemble a complex object step by step instead of through a constructor with nine arguments.",
      code: {
        typescript: `class ReportBuilder {
  private opts: ReportOptions = defaults();

  between(from: string, to: string) {
    this.opts.range = { from, to };
    return this;
  }
  currency(code: string) {
    this.opts.currency = code;
    return this;
  }
  build(): Report {
    return runReport(this.opts);
  }
}

const report = new ReportBuilder()
  .between("2026-01-01", "2026-06-30")
  .currency("GBP")
  .build();`,
        go: `// Go's idiom for the same job: functional options.
func WithCurrency(code string) Option {
	return func(r *Report) { r.currency = code }
}

func NewReport(opts ...Option) *Report {
	r := &Report{currency: "GBP"}
	for _, opt := range opts {
		opt(r)
	}
	return r
}`,
        python: `@dataclass
class Report:
    currency: str = "GBP"
    group_by: str | None = None
    refunds: bool = False

# Python rarely needs a builder — keyword
# arguments already are one.
report = Report(currency="EUR", refunds=True)`,
      },
      fieldNote:
        "A transaction-report endpoint grew to nine optional parameters and every call site was a guessing game. The builder made them readable; in Go the same job is done by functional options, and in Python by keyword arguments.",
      verdict:
        "A cure for telescoping constructors — though some languages ship the cure in their syntax.",
    },
    {
      title: "Hyrum's Law",
      category: "law",
      oneLiner:
        "With enough users, every observable behaviour of your system will be depended on — documented or not.",
      code: {
        typescript: `// The documented contract: "returns the user's accounts".
// The real contract: "returns them newest-first" — because
// one client sorted nothing and shipped anyway.
app.get("/accounts", async (req, res) => {
  const accounts = await repo.list(req.userId);
  res.json(accounts); // insertion order, forever
});`,
        go: `// "The iteration order over maps is not specified."
// Go randomises it on purpose, so nobody can depend
// on it. Hyrum's Law, solved at the language level.
for id, acc := range accounts {
	process(id, acc)
}`,
        python: `# dicts kept insertion order as a CPython detail in 3.6.
# Enough code depended on it that 3.7 made it the law.
prefs = {"currency": "GBP", "locale": "en_GB"}
first = next(iter(prefs))  # "currency" — now guaranteed`,
      },
      fieldNote:
        "A partner integration broke when we changed the key order of a JSON response — behaviour we never documented and they never asked about. Both sides paid for it.",
      verdict:
        "You can't opt out. You can only choose which behaviours you promise, and randomise the rest.",
    },
    {
      title: "Idempotency",
      category: "principle",
      oneLiner:
        "Doing the same operation twice must have the same effect as doing it once.",
      code: {
        typescript: `app.post("/payments", async (req, res) => {
  const key = req.header("Idempotency-Key");
  const existing = await store.get(key);
  if (existing) return res.status(200).json(existing);

  const payment = await charge(req.body);
  await store.put(key, payment);
  res.status(201).json(payment);
});`,
        go: `func (s *Server) CreatePayment(w http.ResponseWriter, r *http.Request) {
	key := r.Header.Get("Idempotency-Key")
	if p, ok := s.store.Get(key); ok {
		writeJSON(w, http.StatusOK, p)
		return
	}
	p := s.charge(r)
	s.store.Put(key, p)
	writeJSON(w, http.StatusCreated, p)
}`,
        python: `@app.post("/payments")
def create_payment():
    key = request.headers["Idempotency-Key"]
    if existing := store.get(key):
        return existing, 200

    payment = charge(request.json)
    store.put(key, payment)
    return payment, 201`,
      },
      fieldNote:
        "Mobile clients retry on timeouts, and a timeout doesn't mean the charge failed — sometimes it means it succeeded slowly. Idempotency keys are the difference between a support ticket and charging someone twice.",
      verdict:
        "Non-negotiable for anything that moves money. Retries are only a feature if repeats are safe.",
    },
    {
      title: "Event Sourcing",
      category: "paradigm",
      oneLiner:
        "Store what happened as an append-only log; derive current state by replaying it.",
      code: {
        typescript: `type Event =
  | { type: "opened"; balance: number }
  | { type: "credited"; amount: number }
  | { type: "debited"; amount: number };

const balance = (events: Event[]): number =>
  events.reduce((total, e) => {
    switch (e.type) {
      case "opened":   return e.balance;
      case "credited": return total + e.amount;
      case "debited":  return total - e.amount;
    }
  }, 0);`,
        go: `func Balance(events []Event) int64 {
	var total int64
	for _, e := range events {
		switch e.Type {
		case Opened:
			total = e.Amount
		case Credited:
			total += e.Amount
		case Debited:
			total -= e.Amount
		}
	}
	return total
}`,
        python: `def balance(events: list[Event]) -> int:
    total = 0
    for e in events:
        match e:
            case Opened(amount):   total = amount
            case Credited(amount): total += amount
            case Debited(amount):  total -= amount
    return total`,
      },
      fieldNote:
        "Storing transactions as an append-only log instead of mutating a balance column meant we could answer 'why is this balance wrong?' by replaying history — and rebuild a corrupted read model without touching the source of truth.",
      verdict:
        "A wonderful audit trail with a real operational cost. Reach for it when 'how did we get here?' is a business question, not a debugging one.",
    },
  ],
};

export default config;

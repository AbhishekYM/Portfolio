export interface Project {
  id: string;
  title: string;
  category: 'Full-Stack' | 'Backend' | 'Frontend' | 'Database';
  period: string;
  description: string;
  longDescription: string;
  techStack: string[];
  keyFeatures: string[];
  schemaLayout?: string; // Representation of traditional database schemas
  stats: { label: string; value: string }[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'experience' | 'landmark';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  organization?: string;
  message: string;
  timestamp: string;
  inkColor: 'charcoal' | 'sepia' | 'emerald' | 'royal-blue' | 'crimson';
}

export const PORTFOLIO_OWNER = {
  name: "Abhishek Makwana",
  title: "Artisan Full-Stack Developer",
  philosophies: [
    "Software is a craft. Every line of database schema, every PHP class, and every React hook should be as meticulously structured as fine cabinetry.",
    "Bridges are built with stone, and digital systems with robust models. I specialize in merging the stability of Laravel & PHP with the fluid interactivity of React & Vue."
  ],
  contact: {
    email: "abhishek.makwana@sapphiresolutions.net",
    location: "Sardar Patel Ring Road, Ahmedabad, India",
    ghLink: "https://github.com",
    linkedinLink: "https://linkedin.com"
  }
};

export const SKILL_CATEGORIES = [
  {
    title: "Backend Architecture",
    description: "The engine room of reliability and speed.",
    skills: [
      { name: "Laravel Framework", level: 95, detail: "Domain-Driven Design, queues, Eloquent ORM, custom package dev" },
      { name: "PHP (Modern 8.x)", level: 92, detail: "Strong typing, design patterns, attributes, memory profiling" },
      { name: "Database Engineering", level: 88, detail: "PostgreSQL, MySQL, indexing optimization, CTEs, structural design" },
      { name: "REST & GraphQL APIs", level: 90, detail: "Hypermedia APIs, OAuth authentication, rate limiting, OpenAPI specifications" }
    ]
  },
  {
    title: "Frontend Craftsmanship",
    description: "Fluid, high-contrast, responsive interfaces.",
    skills: [
      { name: "React & Next.js", level: 90, detail: "Custom hooks, context-state, concurrency, headless components" },
      { name: "Vue.js & Nuxt", level: 88, detail: "Composition API, reactive models, Pinia state, micro-frontends" },
      { name: "Tailwind CSS", level: 95, detail: "Custom utility extension, typography pairing, micro-interactions" },
      { name: "TypeScript", level: 85, detail: "Strict typings, generic interfaces, algebraic types, type-guards" }
    ]
  }
];

export const TIMELINE_HISTORY: TimelineEvent[] = [
  {
    year: "2024 — Present",
    title: "Senior Full-Stack Developer",
    organization: "Sapphire Solutions",
    description: "Architecting large-scale corporate enterprise applications. Built financial ledgers using Laravel and high-fidelity reporting interfaces using Vue 3 and Tailwind. Optimized database queries, reducing load times by 42%.",
    type: "experience"
  },
  {
    year: "2022 — 2024",
    title: "Full-Stack Engineer",
    organization: "Technology Guild",
    description: "Designed bespoke digital management portals. Handled PHP Core modernizations and integrated complex React interfaces. Implemented real-time system integrations with strict error logging.",
    type: "experience"
  },
  {
    year: "2020 — 2022",
    title: "PHP & Laravel Developer",
    organization: "Web Crafts House",
    description: "Developed and maintained high-traffic e-commerce solutions and custom CRM systems. Managed intricate SQL schemas and streamlined automated deployments.",
    type: "experience"
  },
  {
    year: "2020",
    title: "Inauguration of Software Craft",
    organization: "The Academic Journal of Computer Science",
    description: "Graduated with absolute honors in Computer Engineering, publishing a thesis on performance characteristics of MVC backend systems versus modern microservices.",
    type: "landmark"
  }
];

export const PROJECTS_ARCHIVE: Project[] = [
  {
    id: "lara-ledger",
    title: "LaraLedger: Double-Entry Financial System",
    category: "Full-Stack",
    period: "Autumn 2025",
    description: "A highly-secure double-entry auditing and bookkeeping system built with Laravel and React.",
    longDescription: "Designed for high-precision auditing, LaraLedger enforces complete mathematical balance in real-time. It leverages custom DB locking and transactional consistency at the database engine level (InnoDB/PostgreSQL). The frontend uses React to render responsive audit trails, ledger books, and interactive balance sheets.",
    techStack: ["Laravel 11", "PHP 8.3", "React 19", "PostgreSQL", "Tailwind CSS"],
    keyFeatures: [
      "Mathematical assurance of zero out-of-balance postings.",
      "Custom Eloquent model observers creating irreversible audit ledgers.",
      "Real-time ledger updates with background jobs queue.",
      "Interactive balance sheets with deep-drill analytical reports."
    ],
    schemaLayout: `[ledgers] ──1:N──> [accounts] ──1:N──> [postings] ──N:1──> [transactions]
                  │                      │                      │
                  └──> id (UUID)         └──> code (VARCHAR)    └──> amount (DECIMAL)
                                                                └──> credit_debit (ENUM)`,
    stats: [
      { label: "Query Speed", value: "1.2ms avg" },
      { label: "Data Consistency", value: "99.999%" },
      { label: "Audit Records", value: "2M+" }
    ]
  },
  {
    id: "vue-commerce",
    title: "The Artisan Market: High-Traffic Commerce Engine",
    category: "Full-Stack",
    period: "Spring 2025",
    description: "An elegant, performance-tuned e-commerce engine pairing Laravel API with a Vue 3 storefront.",
    longDescription: "The Artisan Market is a tailored e-commerce framework optimized for rapid page loads and high SEO scores. It uses Vue 3's reactive composition API on the front end to enable seamless shopping carts, and a highly cached Laravel API on the backend with Redis for lightning-fast catalog search.",
    techStack: ["Laravel", "Vue 3", "Vite", "Redis", "Pinia", "MySQL"],
    keyFeatures: [
      "Catalog query results served under 15ms via layered Redis caching.",
      "Modular payment gateway integration supporting atomic credit ledger operations.",
      "Custom state persistence using Vue's reactive composables.",
      "Elasticsearch-backed fuzzy matching engine."
    ],
    schemaLayout: `[categories] ──1:N──> [products] ──1:N──> [sku_variants] ──1:N──> [order_items]
                        │                    │                     │
                        └──> slug            └──> base_price       └──> stock_ledger`,
    stats: [
      { label: "Render Overhead", value: "0ms (SSR)" },
      { label: "Load Time", value: "0.4s FCP" },
      { label: "Conversion Lift", value: "+28%" }
    ]
  },
  {
    id: "php-hypermedia",
    title: "Vellum CMS: Hypermedia-Driven Publishing",
    category: "Backend",
    period: "Winter 2024",
    description: "An elegant, traditional publishing layout engine built on raw PHP and server-rendered components.",
    longDescription: "Vellum is a publishing system designed for newspapers and literary sites. Returning to the roots of the traditional web, it leverages lightweight hypermedia (HTMX + PHP template fragments) to eliminate bulky frontend assets, achieving instantaneous paint times and absolute offline stability.",
    techStack: ["PHP 8.2", "HTMX", "SQLite", "Tailwind CSS", "Markdown Parser"],
    keyFeatures: [
      "Fully responsive, print-like layout engine utilizing CSS grid and typography layers.",
      "Zero bundle-size client footprint using raw HTML server-responses.",
      "Built-in Markdown-to-HTML caching pipeline using native filesystems.",
      "Instantaneous, low-overhead database queries with SQLite in-memory."
    ],
    schemaLayout: `[articles] ──1:N──> [metadata_tags] ──N:1──> [taxonomies]
                     │                       │
                     └──> slug (Primary)     └──> value (VARCHAR)`,
    stats: [
      { label: "Bundle Size", value: "4.2KB" },
      { label: "Lighthouse Score", value: "100/100" },
      { label: "Database Footprint", value: "2.8MB" }
    ]
  },
  {
    id: "schema-visualizer",
    title: "SchemaCraft: Dynamic Database Architect",
    category: "Database",
    period: "Summer 2024",
    description: "An interactive, web-based tool to architect and visualize MySQL and PostgreSQL schemas.",
    longDescription: "SchemaCraft compiles standard SQL DDL syntax into interactive interactive schemas. Built in React with customized SVG layers, it parses foreign key constraints and displays them as beautiful lines, allowing developers to model, optimize, and generate Laravel migration scripts on the fly.",
    techStack: ["React 18", "TypeScript", "Tailwind CSS", "SVG Canvas", "AST Parser"],
    keyFeatures: [
      "Custom AST Parser for SQL CREATE TABLE declarations.",
      "Visual foreign key path rendering using auto-calculating cubic-bezier lines.",
      "One-click export to Laravel migration schemas or raw SQL scripts.",
      "Built-in relational analysis checking for circular dependency risks."
    ],
    schemaLayout: `[visual_nodes] ──1:N──> [field_definitions] ──1:N──> [connections]
                          │                         │                      │
                          └──> coordinates (x, y)   └──> type_constrains   └──> bezier_path`,
    stats: [
      { label: "Canvas Frame Rate", value: "60 FPS" },
      { label: "SQL Dialects", value: "MySQL / PG" },
      { label: "Laravel Export", value: "v10 & v11" }
    ]
  }
];

export const INITIAL_GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  {
    id: "1",
    name: "Arthur Pendelton",
    organization: "The Print & Ink Society",
    message: "A remarkable synthesis of vintage style and pixel-perfect modern technology. The layouts are as beautiful as early 19th-century publications, but incredibly fast and fluid.",
    timestamp: "2026-06-25 14:30",
    inkColor: "sepia"
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    organization: "Sapphire Solutions QA",
    message: "Abhishek's database schema designs and clean Laravel controllers have set a new standard for our core architectural systems. Meticulous and dependable.",
    timestamp: "2026-06-29 09:15",
    inkColor: "emerald"
  },
  {
    id: "3",
    name: "Benjamin Vance",
    organization: "Craft Guild",
    message: "Truly refreshing to see an engineer who values standard traditional layouts, elegant letterpress aesthetics, and doesn't clutter their work with typical futuristic flash. Solid work on Laravel Vue bindings!",
    timestamp: "2026-06-30 18:42",
    inkColor: "charcoal"
  }
];

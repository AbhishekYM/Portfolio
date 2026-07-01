import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Initialize schema tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    tech_stack TEXT NOT NULL, -- JSON array of strings
    key_features TEXT NOT NULL, -- JSON array of strings
    schema_layout TEXT,
    stats TEXT NOT NULL, -- JSON array of objects {label, value}
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    detail TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chronicle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'experience' | 'landmark'
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS guestbook (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    ink_color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT DEFAULT 'unread'
  );

  CREATE TABLE IF NOT EXISTS admin_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Function to seed initial values if empty
export function seedDatabase() {
  // 1. Projects seed
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    const defaultProjects = [
      {
        id: "lara-ledger",
        title: "LaraLedger: Double-Entry Financial System",
        category: "Full-Stack",
        period: "Autumn 2025",
        description: "A highly-secure double-entry auditing and bookkeeping system built with Laravel and React.",
        longDescription: "Designed for high-precision auditing, LaraLedger enforces complete mathematical balance in real-time. It leverages custom DB locking and transactional consistency at the database engine level (InnoDB/PostgreSQL). The frontend uses React to render responsive audit trails, ledger books, and interactive balance sheets.",
        techStack: JSON.stringify(["Laravel 11", "PHP 8.3", "React 19", "PostgreSQL", "Tailwind CSS"]),
        keyFeatures: JSON.stringify([
          "Mathematical assurance of zero out-of-balance postings.",
          "Custom Eloquent model observers creating irreversible audit ledgers.",
          "Real-time ledger updates with background jobs queue.",
          "Interactive balance sheets with deep-drill analytical reports."
        ]),
        schemaLayout: `[ledgers] ──1:N──> [accounts] ──1:N──> [postings] ──N:1──> [transactions]\n                  │                      │                      │\n                  └──> id (UUID)         └──> code (VARCHAR)    └──> amount (DECIMAL)\n                                                                └──> credit_debit (ENUM)`,
        stats: JSON.stringify([
          { label: "Query Speed", value: "1.2ms avg" },
          { label: "Data Consistency", value: "99.999%" },
          { label: "Audit Records", value: "2M+" }
        ]),
        sort_order: 1
      },
      {
        id: "vue-commerce",
        title: "The Artisan Market: High-Traffic Commerce Engine",
        category: "Full-Stack",
        period: "Spring 2025",
        description: "An elegant, performance-tuned e-commerce engine pairing Laravel API with a Vue 3 storefront.",
        longDescription: "The Artisan Market is a tailored e-commerce framework optimized for rapid page loads and high SEO scores. It uses Vue 3's reactive composition API on the front end to enable seamless shopping carts, and a highly cached Laravel API on the backend with Redis for lightning-fast catalog search.",
        techStack: JSON.stringify(["Laravel", "Vue 3", "Vite", "Redis", "Pinia", "MySQL"]),
        keyFeatures: JSON.stringify([
          "Catalog query results served under 15ms via layered Redis caching.",
          "Modular payment gateway integration supporting atomic credit ledger operations.",
          "Custom state persistence using Vue's reactive composables.",
          "Elasticsearch-backed fuzzy matching engine."
        ]),
        schemaLayout: `[categories] ──1:N──> [products] ──1:N──> [sku_variants] ──1:N──> [order_items]\n                        │                    │                     │\n                        └──> slug            └──> base_price       └──> stock_ledger`,
        stats: JSON.stringify([
          { label: "Render Overhead", value: "0ms (SSR)" },
          { label: "Load Time", value: "0.4s FCP" },
          { label: "Conversion Lift", value: "+28%" }
        ]),
        sort_order: 2
      },
      {
        id: "php-hypermedia",
        title: "Vellum CMS: Hypermedia-Driven Publishing",
        category: "Backend",
        period: "Winter 2024",
        description: "An elegant, traditional publishing layout engine built on raw PHP and server-rendered components.",
        longDescription: "Vellum is a publishing system designed for newspapers and literary sites. Returning to the roots of the traditional web, it leverages lightweight hypermedia (HTMX + PHP template fragments) to eliminate bulky frontend assets, achieving instantaneous paint times and absolute offline stability.",
        techStack: JSON.stringify(["PHP 8.2", "HTMX", "SQLite", "Tailwind CSS", "Markdown Parser"]),
        keyFeatures: JSON.stringify([
          "Fully responsive, print-like layout engine utilizing CSS grid and typography layers.",
          "Zero bundle-size client footprint using raw HTML server-responses.",
          "Built-in Markdown-to-HTML caching pipeline using native filesystems.",
          "Instantaneous, low-overhead database queries with SQLite in-memory."
        ]),
        schemaLayout: `[articles] ──1:N──> [metadata_tags] ──N:1──> [taxonomies]\n                     │                       │\n                     └──> slug (Primary)     └──> value (VARCHAR)`,
        stats: JSON.stringify([
          { label: "Bundle Size", value: "4.2KB" },
          { label: "Lighthouse Score", value: "100/100" },
          { label: "Database Footprint", value: "2.8MB" }
        ]),
        sort_order: 3
      },
      {
        id: "schema-visualizer",
        title: "SchemaCraft: Dynamic Database Architect",
        category: "Database",
        period: "Summer 2024",
        description: "An interactive, web-based tool to architect and visualize MySQL and PostgreSQL schemas.",
        longDescription: "SchemaCraft compiles standard SQL DDL syntax into interactive schemas. Built in React with customized SVG layers, it parses foreign key constraints and displays them as beautiful lines, allowing developers to model, optimize, and generate Laravel migration scripts on the fly.",
        techStack: JSON.stringify(["React 18", "TypeScript", "Tailwind CSS", "SVG Canvas", "AST Parser"]),
        keyFeatures: JSON.stringify([
          "Custom AST Parser for SQL CREATE TABLE declarations.",
          "Visual foreign key path rendering using auto-calculating cubic-bezier lines.",
          "One-click export to Laravel migration schemas or raw SQL scripts.",
          "Built-in relational analysis checking for circular dependency risks."
        ]),
        schemaLayout: `[visual_nodes] ──1:N──> [field_definitions] ──1:N──> [connections]\n                          │                         │                      │\n                          └──> coordinates (x, y)   └──> type_constrains   └──> bezier_path`,
        stats: JSON.stringify([
          { label: "Canvas Frame Rate", value: "60 FPS" },
          { label: "SQL Dialects", value: "MySQL / PG" },
          { label: "Laravel Export", value: "v10 & v11" }
        ]),
        sort_order: 4
      }
    ];

    const insertProj = db.prepare(`
      INSERT INTO projects (id, title, category, period, description, long_description, tech_stack, key_features, schema_layout, stats, sort_order)
      VALUES (@id, @title, @category, @period, @description, @longDescription, @techStack, @keyFeatures, @schemaLayout, @stats, @sort_order)
    `);

    for (const p of defaultProjects) {
      insertProj.run(p);
    }
  }

  // 2. Skills seed
  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number };
  if (skillCount.count === 0) {
    const defaultSkills = [
      { category: "Backend Architecture", name: "Laravel Framework", level: 95, detail: "Domain-Driven Design, queues, Eloquent ORM, custom package dev" },
      { category: "Backend Architecture", name: "PHP (Modern 8.x)", level: 92, detail: "Strong typing, design patterns, attributes, memory profiling" },
      { category: "Backend Architecture", name: "Database Engineering", level: 88, detail: "PostgreSQL, MySQL, indexing optimization, CTEs, structural design" },
      { category: "Backend Architecture", name: "REST & GraphQL APIs", level: 90, detail: "Hypermedia APIs, OAuth authentication, rate limiting, OpenAPI specifications" },
      { category: "Frontend Craftsmanship", name: "React & Next.js", level: 90, detail: "Custom hooks, context-state, concurrency, headless components" },
      { category: "Frontend Craftsmanship", name: "Vue.js & Nuxt", level: 88, detail: "Composition API, reactive models, Pinia state, micro-frontends" },
      { category: "Frontend Craftsmanship", name: "Tailwind CSS", level: 95, detail: "Custom utility extension, typography pairing, micro-interactions" },
      { category: "Frontend Craftsmanship", name: "TypeScript", level: 85, detail: "Strict typings, generic interfaces, algebraic types, type-guards" }
    ];

    const insertSkill = db.prepare(`
      INSERT INTO skills (category, name, level, detail)
      VALUES (@category, @name, @level, @detail)
    `);

    for (const s of defaultSkills) {
      insertSkill.run(s);
    }
  }

  // 3. Chronicle seed
  const chronicleCount = db.prepare('SELECT COUNT(*) as count FROM chronicle').get() as { count: number };
  if (chronicleCount.count === 0) {
    const defaultChronicle = [
      {
        year: "2024 — Present",
        title: "Senior Full-Stack Developer",
        organization: "Sapphire Solutions",
        description: "Architecting large-scale corporate enterprise applications. Built financial ledgers using Laravel and high-fidelity reporting interfaces using Vue 3 and Tailwind. Optimized database queries, reducing load times by 42%.",
        type: "experience",
        sort_order: 1
      },
      {
        year: "2022 — 2024",
        title: "Full-Stack Engineer",
        organization: "Technology Guild",
        description: "Designed bespoke digital management portals. Handled PHP Core modernizations and integrated complex React interfaces. Implemented real-time system integrations with strict error logging.",
        type: "experience",
        sort_order: 2
      },
      {
        year: "2020 — 2022",
        title: "PHP & Laravel Developer",
        organization: "Web Crafts House",
        description: "Developed and maintained high-traffic e-commerce solutions and custom CRM systems. Managed intricate SQL schemas and streamlined automated deployments.",
        type: "experience",
        sort_order: 3
      },
      {
        year: "2020",
        title: "Inauguration of Software Craft",
        organization: "The Academic Journal of Computer Science",
        description: "Graduated with absolute honors in Computer Engineering, publishing a thesis on performance characteristics of MVC backend systems versus modern microservices.",
        type: "landmark",
        sort_order: 4
      }
    ];

    const insertChronicle = db.prepare(`
      INSERT INTO chronicle (year, title, organization, description, type, sort_order)
      VALUES (@year, @title, @organization, @description, @type, @sort_order)
    `);

    for (const c of defaultChronicle) {
      insertChronicle.run(c);
    }
  }

  // 4. Guestbook seed
  const guestbookCount = db.prepare('SELECT COUNT(*) as count FROM guestbook').get() as { count: number };
  if (guestbookCount.count === 0) {
    const defaultGuestbook = [
      {
        id: "1",
        name: "Arthur Pendelton",
        organization: "The Print & Ink Society",
        message: "A remarkable synthesis of vintage style and pixel-perfect modern technology. The layouts are as beautiful as early 19th-century publications, but incredibly fast and fluid.",
        timestamp: "2026-06-25 14:30",
        ink_color: "sepia"
      },
      {
        id: "2",
        name: "Sarah Jenkins",
        organization: "Sapphire Solutions QA",
        message: "Abhishek's database schema designs and clean Laravel controllers have set a new standard for our core architectural systems. Meticulous and dependable.",
        timestamp: "2026-06-29 09:15",
        ink_color: "emerald"
      },
      {
        id: "3",
        name: "Benjamin Vance",
        organization: "Craft Guild",
        message: "Truly refreshing to see an engineer who values standard traditional layouts, elegant letterpress aesthetics, and doesn't clutter their work with typical futuristic flash. Solid work on Laravel Vue bindings!",
        timestamp: "2026-06-30 18:42",
        ink_color: "charcoal"
      }
    ];

    const insertGuestbook = db.prepare(`
      INSERT INTO guestbook (id, name, organization, message, timestamp, ink_color)
      VALUES (@id, @name, @organization, @message, @timestamp, @ink_color)
    `);

    for (const g of defaultGuestbook) {
      insertGuestbook.run(g);
    }
  }

  // 5. Admin Pass seed
  const passExists = db.prepare('SELECT COUNT(*) as count FROM admin_config WHERE key = ?').get('password') as { count: number };
  if (passExists.count === 0) {
    db.prepare('INSERT INTO admin_config (key, value) VALUES (?, ?)').run('password', 'admin123');
  }
}

// Call seed immediately
seedDatabase();

export default db;

export type Decision = {
  title: string;
  why: string;
  rejected?: string;
};

export type Story = {
  title: string;
  body: string;
};

export type Metric = {
  label: string;
  value: string;
  note?: string;
};

export type Diagram = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One sentence: the problem and the impact. Shown on the card and at the top of the case study. */
  hook: string;
  category: "Full Stack" | "Backend" | "AI / Data Platform";
  /** Employer or programme the work was done for. */
  company?: string;
  status?: "In development";
  context: string;
  role: string;
  stack: string[];
  repo?: string;
  /** Short badges for the homepage card; defaults to the first few of `stack`. */
  tags?: string[];
  architecture?: { summary: string[]; diagrams?: Diagram[] };
  decisions?: Decision[];
  challenges?: string[];
  approach?: string[];
  hardParts?: Story[];
  implementation?: Story[];
  testing?: string[];
  operations?: string[];
  metrics?: { title: string; items: Metric[] };
  outcomes?: string[];
  retrospective?: string[];
};

export const projects: Project[] = [
  {
    slug: "nexus-grid",
    title: "Nexus-Grid",
    hook:
      "An agentic coordination layer that reads six live public datasets across 15 CARICOM states and finds $1.12B of food imports the region already produces itself — then routes each plan through a human approval gate.",
    category: "AI / Data Platform",
    company: "Caribbean AI Buildathon",
    context:
      "The Caribbean imports about 80% of its food. Built for the Future Caribbean Global AI Buildathon (Food Systems & Supply Chains track), Nexus-Grid asks a narrow question: which of those imports is a member state buying from outside the region while another member state already exports the same commodity into it? Constraints: only free, keyless public data so every figure is reproducible, no database server, it must work with or without an LLM key, and it must never invent a number.",
    role:
      "Designed and built end to end — data layer, agent workflow, API, operator console and deployment. All 122 commits in the repository are mine.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "LangGraph",
      "SQLite",
      "Tailwind + shadcn/ui",
      "Recharts",
      "Vitest",
      "Docker",
      "Nginx + systemd",
      "GitHub Actions",
    ],
    tags: ["TypeScript", "Next.js", "LangGraph", "SQLite"],
    repo: "https://github.com/e277/Nexus-Grid",
    architecture: {
      summary: [
        "One Next.js process. Six publishers (UN Comtrade, World Bank, ISRIC SoilGrids, NASA POWER, Open-Meteo, NOAA) are fetched concurrently, each behind its own cache with a provenance record.",
        "A derived read model (the projection) turns those snapshots into per-state profiles, substitution opportunities and supplier→importer lanes. Nothing in it is entered by hand; it is rebuilt on the next fetch.",
        "Specialist agents (supply, demand, logistics, agronomy, climate, planting) interpret the projection under a supervisor. A LangGraph workflow runs perceive → assess → recommend → plan → approval gate → execute → monitor → recover for each gap, streaming every node to the console over server-sent events.",
        "Approved plans are posted to a real operator dashboard (an OpenClaw gateway). Rejected or escalated plans are never sent.",
      ],
      diagrams: [
        {
          src: "/images/nexus-grid/system-architecture.svg",
          alt: "System architecture: six public data sources feed a coordination core of projection, interpretation, agents and workflow, whose output lands in the operator console and gateway.",
          caption: "Sources → projection → agents → operator console.",
        },
        {
          src: "/images/nexus-grid/coordination-graph.svg",
          alt: "The coordination graph: eight LangGraph nodes, a human approval gate and a single re-plan edge from monitor back to assess.",
          caption: "Eight LangGraph nodes, a human approval gate, and one capped re-plan edge.",
        },
      ],
    },
    decisions: [
      {
        title: "One TypeScript process instead of a Python service plus a front end",
        why: "The first version had a separate Python API. Porting it into Next.js route handlers gave one deploy unit and one set of types shared by the API and the console.",
        rejected: "Keeping the Python service — two runtimes and a contract to keep in sync for a single-team project.",
      },
      {
        title: "No database or cache server",
        why: "The platform owns almost no data: every figure is derived from public sources and recomputed on the next fetch. Per-source in-process caches with provenance were enough, and Redis was removed.",
        rejected: "Redis and a relational database — infrastructure to operate for data the system doesn't own.",
      },
      {
        title: "LangGraph + a SQLite checkpointer for the approval gate",
        why: "The workflow started on a ~220-line hand-rolled graph runtime. It worked until a paused approval had to outlive the process — a human takes human time, and an in-memory gate dies on the next deploy. LangGraph's checkpointer is exactly that abstraction, so the node bodies stayed as pure functions and only the wiring moved.",
        rejected: "Growing a second, home-made implementation of durable execution.",
      },
      {
        title: "Free, keyless sources only",
        why: "A figure nobody else can reproduce is not evidence. Anyone can clone the repo and get the same numbers with nothing to sign up for.",
        rejected: "Paid or credentialed datasets, even where they had fields the free ones lack.",
      },
      {
        title: "The model is optional",
        why: "Every agent reading has a deterministic fallback, badged “rule-derived”. Model readings are cached for 15 minutes and revalidated in the background, because a model round-trip is too slow for a polling UI and is billed per call.",
      },
    ],
    hardParts: [
      {
        title: "“Unknown” was being scored as “clear”",
        body: "The supplier ranking treated a missing weather reading as perfect weather, so a state scored higher precisely because nothing was known about it — and the rationale text claimed clear skies. Unknown now scores 0.5, the rationale says “no current weather reading”, and suppliers that can't be placed on the map are dropped rather than ranked on a stub distance.",
      },
      {
        title: "A rate-limited soil API and coastlines with no data",
        body: "SoilGrids allows about five calls a minute and returns 503 beyond that, and it has no data over the urban, coastal pixels where capitals sit. Each state now carries a separate farmland coordinate; results are cached per state for a month (soil doesn't move), each refresh tops up three states, and failures are cached briefly so one bad point can't block the rest.",
      },
      {
        title: "The LLM misread two lists as one ranking",
        body: "The logistics agent was given both the ranked supplier shortlist and the raw lane list sorted by value, and reported that a nearer supplier had been ranked below a farther one — which it hadn't. The fix was to pass the shortlist instead of the raw lanes, not alongside them.",
      },
      {
        title: "GitHub Pages was never going to work",
        body: "The app uses Node.js API routes and process-local state, so it can't be hosted as a static site. The Pages workflow was replaced with a VM deploy: build a standalone bundle, ship it, atomically swap it into place and verify it through health endpoints.",
      },
    ],
    implementation: [
      {
        title: "Supplier ranking, weighted to 100",
        body: "Transit time (35, great-circle distance between main ports), weather at both ends (25, the weaker end sets the score), complementary planting windows (20, from NASA POWER) and established regional trade (20). Price, vessel capacity and port throughput aren't scored, and the API response says so — no free source publishes them.",
      },
      {
        title: "Failure isolation per source",
        body: "A publisher that doesn't answer is reported as pending, cached or unavailable — never quietly treated as zero — and degrades only its own slice of the picture.",
      },
      {
        title: "Human-in-the-loop with four outcomes",
        body: "LangGraph's interrupt() parks an urgent plan. The run resumes on the same thread with approved, modified, rejected or escalated; the last three carry an operator note recorded against the gate.",
      },
      {
        title: "One wrapper for every route",
        body: "Rate limiting, Prometheus metrics, audit logging and error mapping live in a single route wrapper, so every endpoint gets them by construction.",
      },
    ],
    testing: [
      "50+ Vitest tests across the coordination graph, projection, caching, supplier matching and naming layers.",
      "CI runs typecheck and a production build on every push.",
      "Data sources are verified against the live endpoints rather than mocked in CI — a known gap (see below).",
    ],
    operations: [
      "Docker Compose locally (app plus gateway); plain `npm run dev` works without Docker.",
      "Production: a Debian 12 VM. GitHub Actions builds the Next.js standalone bundle, ships it over SSH, atomically swaps it into place and verifies /api/health and /api/health/db.",
      "systemd service behind Nginx with TLS; separate service and deploy users, with sudo limited to the deploy script.",
      "Prometheus metrics endpoint, rate limiting on every route, and an audit trail of every agent action — including scans that found nothing.",
    ],
    metrics: {
      title: "What it finds (latest settled UN Comtrade year, 15 CARICOM states)",
      items: [
        { label: "Regional food imports", value: "$1.52B" },
        { label: "Traded inside CARICOM", value: "$137M" },
        {
          label: "Addressable imports",
          value: "$1.12B",
          note: "Bought from outside the region while a member state already supplies it — 12 commodity–importer pairs",
        },
        { label: "Live public data sources", value: "6", note: "No keys, no accounts, no seeded data" },
      ],
    },
    retrospective: [
      "Persist more from the start. Paused runs survive a restart, but source caches, agent memory and the audit trail are still in-memory and reset with the process.",
      "Record fixtures for each publisher so CI catches an upstream format change instead of relying on live checks.",
      "Decide the hosting model before the first deploy workflow — the Pages attempt cost a round trip that the architecture already ruled out.",
    ],
  },
  {
    slug: "legacy-user-service-migration",
    title: "Legacy User Service Migration",
    hook:
      "Migrated a legacy user service to Spring Boot on Java 17 — rewriting brittle SQL, adding caching and contract tests, and automating releases through Jenkins.",
    category: "Backend",
    company: "Westcoast",
    context:
      "Westcoast is a UK technology distributor. A legacy user service had tightly coupled code and brittle SQL that put heavy load on the database and caused production defects. The goal was to modernize it without breaking any downstream consumer.",
    role: "Software Developer — rebuilt the service and its data access, and updated the delivery pipeline.",
    stack: ["Java 17", "Spring Boot", "MSSQL", "LDAP", "Jenkins", "JUnit", "Mockito"],
    challenges: [
      "Untangling tightly coupled legacy code and brittle SQL",
      "Reducing database load from inefficient queries",
      "Ensuring zero regression for downstream consumers",
      "Establishing CI/CD for the modernized service",
    ],
    approach: [
      "Rebuilt the service with a layered Spring Boot architecture and DTO mapping, so the public contract no longer depended on the schema",
      "Optimized SQL queries and added indexes to cut response times",
      "Added caching for frequent reads, and contract tests to protect API consumers",
      "Updated Jenkins pipelines for consistent, automated deployments",
    ],
    outcomes: [
      "Faster, more stable responses on user-facing endpoints",
      "Fewer production defects tied to the service",
      "Lower operational overhead through automated builds and releases",
    ],
  },
  {
    slug: "invoice-workflow-tracker",
    title: "Invoice Workflow Tracker",
    hook:
      "Modelling the invoice lifecycle as explicit states with guarded transitions and an audit trail, so an invoice can't be processed twice or lost between warehouse and finance.",
    category: "Full Stack",
    status: "In development",
    company: "Facey Commodity",
    context:
      "At Facey Commodity, a Caribbean distributor, physical invoices move from print, through warehouse handoffs, to document upload and credit processing. The app tracks each handoff and records when documents are uploaded, with the auditability that compliance and credit checks require.",
    role: "Systems Analyst / Backend Developer",
    stack: ["Laravel", "PHP", "MySQL", "REST", "JavaScript"],
    challenges: [
      "Designing clear state transitions and preventing duplicate processing",
      "Auditability for compliance and credit checks",
      "Keeping the UI responsive while syncing status updates",
      "Integrating with the existing document repository",
    ],
    approach: [
      "Eloquent models with explicit workflow states and transition guards",
      "Invoice history persisted in MySQL with audit tables for traceability",
      "REST endpoints consumed by a lightweight JavaScript front end for live status",
    ],
    outcomes: [
      "One place to see where every invoice is, for both warehouse and finance",
      "Duplicate handling prevented by enforcing the workflow rather than relying on process",
      "Blockers surfaced earlier, before they delay credit processing",
    ],
  },
  {
    slug: "gps-tracking-dashboard",
    title: "GPS Tracking Dashboard",
    hook:
      "Turned GPS pings from mixed mobile devices into a near-real-time route dashboard, giving dispatch live visibility of van-sales routes.",
    category: "Full Stack",
    company: "Facey Commodity",
    context:
      "Facey Commodity runs van-sales routes across its distribution territory, and field operations had no live view of them. A Laravel API aggregates location pings and sales events into a single view so dispatchers can track routes, stops and coverage.",
    role: "Systems Analyst / Fullstack Developer",
    stack: ["Laravel", "PHP", "JavaScript", "MySQL"],
    challenges: [
      "Normalizing GPS data from different mobile devices and formats",
      "Rendering live route updates without overwhelming the browser",
      "Filtering by territory, driver and time window",
      "Keeping data fresh while limiting backend load",
    ],
    approach: [
      "Laravel API Resources serving paginated location and route summaries",
      "Map overlays with route playback in the front end",
      "Server-side caching for high-volume pings and filtered queries",
      "Role-based views so sales, dispatch and management each see what they need",
    ],
    outcomes: [
      "Real-time visibility into daily routes and delays",
      "Fewer support requests from field teams, through self-serve data",
      "Proactive rerouting when routes fall behind",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

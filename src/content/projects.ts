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
  status?: "In development" | "On hold";
  /** Ordered stages of the process the system tracks, rendered as a flow. */
  flow?: { title: string; steps: string[] };
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
      "Sole developer and individual contributor. I designed and built it end to end — data layer, agent workflow, API, operator console and deployment. All 122 commits in the repository are mine.",
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
      "Westcoast is a UK technology distributor. A legacy user service had tightly coupled code and brittle SQL that put heavy load on the database and caused production defects. The goal was to rebuild it as a standalone service — consuming internal APIs and feeding internal systems — without breaking any downstream consumer.",
    role:
      "Sole developer and individual contributor. I designed and built the service end to end — architecture, data access, caching, contract tests and the Jenkins pipeline.",
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
      "Tracks every physical invoice from warehouse print to DocuShare upload by its ERP sequence number, so a missing invoice can be traced to the exact handoff where it went missing — even when one invoice spans several pages.",
    category: "Full Stack",
    status: "On hold",
    company: "Facey Commodity",
    context:
      "At Facey Commodity, a Caribbean distributor, every order raised in the ERP produces a paper invoice that changes hands several times before the credit team can file it: printed in the warehouse, packed with the order, carried by a delivery driver, returned to the warehouse, then passed to credit for recording and upload to DocuShare. Invoices went missing along the way and nobody could say where — a problem for credit, which needs the signed paper on record.",
    role:
      "Sole developer and individual contributor. I designed the workflow model and schema and built the Laravel application and its front end.",
    stack: ["Laravel", "PHP", "MySQL", "REST", "JavaScript", "ERP integration", "DocuShare"],
    flow: {
      title: "The paper trail it tracks",
      steps: [
        "Order raised in ERP",
        "Invoice printed in warehouse",
        "Packed with order, handed to driver",
        "Delivered; invoice returned to warehouse",
        "Sent to credit team",
        "Recorded and uploaded to DocuShare",
      ],
    },
    challenges: [
      "Paper has no ID of its own — the system needs something stable to track across every handoff",
      "One invoice can span several printed pages, so counting sheets of paper gives the wrong answer",
      "Proving where an invoice went missing, not just that it did",
      "Fitting around the ERP and DocuShare rather than replacing either",
    ],
    approach: [
      "Keyed every invoice on its ERP sequence number, pulled from the ERP, so each handoff is recorded against the invoice rather than the paper",
      "Modelled the lifecycle as explicit states with guarded transitions in Laravel, so an invoice can only move to the next legal handoff",
      "Recorded every transition — who, when, from which stage to which — in an append-only audit table in MySQL",
      "REST endpoints and a lightweight JavaScript front end for scanning or confirming each handoff and seeing live status",
    ],
    hardParts: [
      {
        title: "An invoice is not a sheet of paper",
        body: "Long orders print across multiple pages, so tracking pages would count one invoice as several — or flag a page as missing when the invoice was complete. Every page carries the invoice's ERP sequence number, so the system reconciles on that number: pages roll up to one invoice, and a gap in the sequence is what signals a genuinely missing invoice.",
      },
    ],
    outcomes: [
      "Answers the question credit couldn't: which invoices are missing, and at which handoff they were last seen",
      "Sequence-number reconciliation catches gaps that a page count would hide",
      "A full audit trail of every handoff, for credit and compliance",
    ],
  },
  {
    slug: "gps-tracking-dashboard",
    title: "GPS Tracking Dashboard",
    hook:
      "A live map of every van in the fleet: reads GPS coordinates from van and tablet devices through the internal system API and plots them on OpenStreetMap, refreshing every 15 minutes.",
    category: "Full Stack",
    company: "Facey Commodity",
    context:
      "Facey Commodity runs van-sales routes across its distribution territory, and dispatch had no single view of where the fleet was. Every van — tens of vehicles — carries GPS on the van itself and on the sales tablet, and the coordinates were already available through an internal system API but not visualized anywhere.",
    role:
      "Sole developer and individual contributor. I built the Laravel application: the API integration, data processing and caching, and the map dashboard.",
    stack: ["Laravel", "PHP", "JavaScript", "MySQL", "OpenStreetMap", "REST"],
    metrics: {
      title: "Fleet coverage",
      items: [
        { label: "Vans tracked", value: "All", note: "The whole van fleet — tens of vehicles" },
        { label: "Position sources", value: "2", note: "GPS on the van and on the sales tablet" },
        { label: "Map refresh", value: "15 min" },
        { label: "Map tiles", value: "OSM", note: "OpenStreetMap — no per-request licensing cost" },
      ],
    },
    challenges: [
      "Positions arrive from two kinds of device per van, in different formats",
      "Keeping the map current without hammering the internal API",
      "Filtering by territory, driver and time window",
      "Serving sales, dispatch and management from one dashboard",
    ],
    approach: [
      "Laravel service that reads latitude/longitude from the internal system API and normalizes van and tablet readings into one format",
      "Map dashboard on OpenStreetMap, refreshed on a 15-minute cycle",
      "Server-side caching so every viewer reads the same snapshot instead of each one calling the API",
      "Filters and role-based views for sales, dispatch and management",
    ],
    outcomes: [
      "One live view of where the whole fleet is, instead of phone calls to drivers",
      "Fewer support requests from field teams, through self-serve data",
      "Dispatch can spot a van that has fallen behind and reroute",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

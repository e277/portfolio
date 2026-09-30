# Case Study Rewrites — Draft 1

> **Status update:** the site now features Nexus-Grid (lead), Legacy User Service Migration (Westcoast), Invoice Workflow Tracker and GPS Tracking Dashboard (Facey Commodity). Lunch Management, Inventory Photo Manager and Data Quality & Insights were removed. The "Need from you" questions below still apply to the three work projects — the answers will fill their empty framework sections.

Source: the six case studies in `projects.json`. Target role assumed: **senior backend / backend-leaning full-stack**, with fintech as the strongest fit given the banking and invoice/credit work. Tell me the actual target and I'll re-angle the hooks.

**How to read this:** everything written as plain prose is drawn from your existing content. Anything in `[[double brackets]]` is a placeholder I could not fill without inventing facts. Each case study ends with a **⚠️ Need from you** list — answer those and I'll produce final copy and wire it into the site.

---

## TL;DR — Portfolio verdict

| Project | Verdict | Why |
|---|---|---|
| Legacy User Service Migration | **Feature (lead)** | Only Java/Spring Boot story; migration + zero-regression + caching + CI is exactly what senior backend interviews probe. |
| Invoice Workflow Tracker | **Feature** | State machine, duplicate-processing prevention, audit trail — reads as fintech-grade correctness work. Strongest "why" potential. |
| GPS Tracking Dashboard | **Keep (3rd card)** | Ingestion of high-volume pings, normalization, caching under load — a real systems problem. Needs numbers. |
| Lunch Management App | **Cut, or fold into Invoice Workflow** | Reads as CRUD. The only interesting part (order-cutoff guards + duplicate prevention) is the same idea as the Invoice Workflow Tracker, told less convincingly. Keep the screenshot for the "About" page if you like. |
| Inventory Photo Manager | **Cut / demote to resume bullet** | Upload + tag + SKU mapping is standard. Revive only if there's a hard part (e.g., bulk-importing thousands of legacy images, storage costs). |
| Data Quality & Insights | **Move to resume / About** | Analysis work, not a system you built. Keep it only if you turned it into a repeatable pipeline (scheduled validations, alerting) — then it becomes a backend story. |

**Recommended homepage: 3 cards — Legacy User Service Migration, Invoice Workflow Tracker, GPS Tracking Dashboard.** Three strong case studies beat six thin ones. A hiring manager will read one, maybe two; make sure both are good.

### Problems that apply to *every* current case study

1. **Zero numbers.** Every result is qualitative ("improved response times", "reduced support requests"). This is the single biggest weakness. Even rough estimates ("approximately 2s → 300ms", "~40 tickets/week → ~10") are far better than none — label them "approximately".
2. **No "hard part."** Every project reads as smooth sailing. Interviewers don't believe it and it gives them nothing to dig into.
3. **No trade-offs.** None of them say what you considered and rejected. That's the section interviewers care about most.
4. **Ownership is vague.** Titles like "Systems Analyst / Fullstack Developer" don't say what *you* built vs. the team. Team size is never stated.
5. **Challenges, solutions and results are parallel bullet lists** that don't connect. Rewrite as cause → decision → effect.
6. **Honesty flag on Invoice Workflow Tracker:** the description says "Developing…" (in progress) but lists results. Either mark results as early/projected or wait until it ships.
7. **Stats in the hero don't match the skills list** (5 vs 6 languages, 4 vs 3 databases). A careful reader notices.

---

## 1 · Legacy User Service Migration  ⭐ FEATURE

### One-line hook
> Migrated a legacy user service to Spring Boot on Java 17 with zero downstream regressions, cutting p95 latency from `[[X]]`ms to `[[Y]]`ms through query rewrites, targeted indexes and a read cache.

### Context
The user service `[[what it did — authentication lookups? profile data? directory sync via LDAP?]]` for `[[which product / how many internal consumers]]` at `[[company type, e.g., a regional bank]]`. The legacy implementation was tightly coupled with brittle hand-written SQL, driving high database load and frequent production defects. Constraints: `[[timeline]]`, `[[team size]]`, and no breaking changes for `[[N]]` downstream consumers.

### My role & ownership
- `[[e.g., "I designed the new service layout and implemented the data-access layer and caching. A second developer ported the endpoints; QA ran regression."]]`
- Team: `[[solo / one of N]]`, position: `[[title]]`.

### Architecture & technical approach
**Stack:** Java 17, Spring Boot `[[version]]`, MSSQL `[[version]]`, LDAP `[[directory product]]`, Jenkins, `[[cache: Caffeine? Redis? Spring Cache abstraction?]]`.

**Shape:** consumers → REST controllers → service layer → repositories (MSSQL) / LDAP client, with DTO mapping at the boundary so the internal model could change without breaking the API contract. Read-heavy endpoints sit behind a cache.

*(Diagram to draw: consumers → API → [cache] → service → MSSQL + LDAP; show which calls hit cache.)*

**Key decisions (fill the WHY):**
- **Rewrite vs. refactor in place** — why a rebuild instead of strangling the old one incrementally? `[[?]]`
- **Layered architecture + DTOs** — decoupled the public contract from the schema so the SQL could be fixed without consumer changes.
- **Cache choice** — `[[in-process vs. distributed; why]]`. What's the invalidation strategy? TTL, write-through, evict on update?
- **Contract tests** — chosen to guarantee zero regressions for consumers. `[[Spring Cloud Contract? Pact? Recorded request/response replay?]]`

**Trade-offs considered and rejected:** `[[e.g., "Considered splitting into two services; rejected because one team owns it and deploy cadence was identical."]]`

### The hard part
`[[Need a real story. Common candidates here:]]`
- A consumer depended on an *undocumented* legacy behavior (null vs. empty string, sort order, casing) and the contract tests caught — or didn't catch — it.
- Cache served stale data after a user update in LDAP (who invalidates when the directory changes outside your service?).
- Cutover: how did you switch traffic? Big bang, shadow traffic, feature flag, per-consumer?

### Implementation details (pick 2–3)
- **Query/index fix:** `[[which query, what the plan looked like before (scan?), which index, rows touched]]`. A before/after execution-plan screenshot or 10-line SQL snippet is worth including here.
- **Caching:** key design + invalidation rule.
- **DTO mapping:** how you preserved legacy response shapes.

### Testing & quality
- Contract tests for consumer-facing endpoints; JUnit + Mockito unit tests.
- `[[coverage figure, integration tests against a real MSSQL (Testcontainers?), load test?]]`
- CI: Jenkins pipeline updated to `[[build → test → package → deploy to env]]`.

### Deployment & operations
`[[Where does it run — VM, Docker, on-prem app server? How is it monitored? Any alerting added?]]`

### Outcomes & metrics
| Metric | Before | After |
|---|---|---|
| p95 latency (key endpoint) | `[[ ]]` | `[[ ]]` |
| DB CPU / query count per request | `[[ ]]` | `[[ ]]` |
| Production defects tied to service (per month/quarter) | `[[ ]]` | `[[ ]]` |
| Deploy process | `[[manual, ~N hrs]]` | `[[automated, ~N min]]` |
| Downstream regressions at cutover | — | `[[0?]]` |

### What I'd do differently
`[[2–3 real ones, e.g., "Add structured logging/metrics before the rewrite so we had a real baseline", "Shadow traffic before cutover instead of relying only on contract tests."]]`

### ⚠️ Need from you
1. What did the service do, and who called it (how many consumers, roughly how many requests/day)?
2. Your exact ownership vs. the team's; team size.
3. Any number at all for latency or DB load before/after (even "roughly 2s → under 300ms").
4. What went wrong or surprised you during the migration.
5. How the cutover happened.
6. Where LDAP fits — it's in the tech list but nowhere in the story.
7. Your role is listed as "Software Developer / Data Analyst" — which applies here? A data-analyst title on your lead backend project undersells it.

---

## 2 · Invoice Workflow Tracker  ⭐ FEATURE

### One-line hook
> Modeled the invoice lifecycle as an explicit state machine with guarded transitions and a full audit trail, eliminating duplicate processing of `[[~N]]` invoices/day across warehouse and finance.

### Context
Physical invoices move from print → warehouse handoffs → document upload → credit processing at `[[company type — distributor?]]`. Tracking was `[[paper / spreadsheet / nothing]]`, so invoices were processed twice or stalled with nobody knowing where. Constraints: auditability for compliance and credit checks, integration with an existing document repository, `[[timeline, team size]]`.

### My role & ownership
`[[e.g., "Sole backend developer: designed the state model and schema, built the API. Front-end was a lightweight JS client I also wrote."]]` Status: `[[shipped on DATE / in pilot / in development]]`.

### Architecture & technical approach
**Stack:** Laravel `[[version]]`, PHP `[[version]]`, MySQL `[[version]]`, REST API, vanilla JS client.

**Shape:** JS client → REST endpoints → workflow service (state machine) → MySQL (invoices + append-only audit table) → document repository integration `[[how: API? shared file store? polling?]]`.

**Key decisions:**
- **Explicit states with guarded transitions** instead of free-form status fields — makes illegal transitions impossible rather than merely discouraged. `[[List the states, e.g., PRINTED → PICKED → DELIVERED → DOC_UPLOADED → CREDIT_READY → CLOSED.]]`
- **Append-only audit table** rather than `updated_at` columns — every transition records who, when, from-state, to-state. `[[Why not event sourcing? Probably: overkill for the team size; audit table gives 90% of the value.]]`
- **REST + polling vs. websockets** for "real-time" status — `[[which did you use and why?]]`

**Trade-offs rejected:** `[[e.g., a workflow engine package vs. hand-rolled state machine; a state-machine library vs. enum + transition map]]`.

### The hard part
`[[This project very likely has a great one — find it:]]`
- **Concurrency:** two users scanning/advancing the same invoice at once. Did you use a DB transaction with `SELECT … FOR UPDATE`, an optimistic-lock version column, or a unique constraint on (invoice_id, to_state)? *This is the single best interview topic in your whole portfolio if it happened.*
- Reprints/voids: what happens to an invoice that's reprinted mid-workflow?
- The document repository didn't expose what you needed.

### Implementation details
- **Transition guard** — a short snippet is appropriate here, e.g.:
  ```php
  // Only allowed transitions; anything else throws and is never persisted
  const TRANSITIONS = [
      'printed'   => ['picked'],
      'picked'    => ['delivered', 'returned'],
      'delivered' => ['doc_uploaded'],
      // ...
  ];
  ```
  `[[replace with your real code]]`
- **Idempotency / duplicate prevention** — how exactly? (unique index, idempotency key, row lock)
- **Audit schema** — columns and why.

### Testing & quality
`[[Feature tests for every legal and illegal transition? Concurrency test? What runs in CI?]]`

### Deployment & operations
`[[ ]]`

### Outcomes & metrics
| Metric | Before | After |
|---|---|---|
| Duplicate-processed invoices / month | `[[ ]]` | `[[ ]]` |
| Time to locate an invoice's status | `[[ ]]` | `[[ ]]` |
| Invoices tracked / day | — | `[[ ]]` |
| Avg. print → credit-ready time | `[[ ]]` | `[[ ]]` |

If not shipped yet: replace this with "Pilot results" or "Expected impact" and say so plainly.

### What I'd do differently
`[[ ]]`

### ⚠️ Need from you
1. Is it shipped? If not, what stage?
2. The actual states and transitions.
3. How duplicate processing is prevented at the database level — and whether you ever saw a race condition.
4. How the document-repository integration works.
5. Any volume or before/after numbers.

---

## 3 · GPS Tracking Dashboard  ✅ KEEP

### One-line hook
> Built an ingestion and query layer that turns `[[~N]]` GPS pings/day from mixed devices into a near-real-time route dashboard, giving dispatch live visibility of `[[N]]` van-sales routes.

### Context
Field operations had no live view of van-sales routes; dispatch relied on `[[phone calls?]]`. Location data arrived from different mobile devices in inconsistent formats. Constraint: keep data fresh without overloading the backend or the browser.

### My role & ownership
`[[ ]]`

### Architecture & technical approach
**Stack:** Laravel `[[version]]`, PHP, MySQL, JavaScript, `[[map library: Leaflet? Google Maps?]]`, `[[cache: Redis? file? database?]]`.

**Shape:** devices → ingestion endpoint → normalization → MySQL (pings, stops, sales events) → aggregated route summaries (cached) → API Resources (paginated) → Blade/JS map with playback.

**Key decisions:**
- **Normalize on ingest vs. on read** — `[[which, and why]]`.
- **Cache aggregated summaries** rather than raw pings — the dashboard needs routes, not every point.
- **Polling interval** — `[[N seconds; why that number]]`.
- **Pings table design** — `[[partitioning by date? composite index on (driver_id, recorded_at)? retention policy?]]` This is the part interviewers will poke at.

**Trade-offs rejected:** `[[e.g., websockets vs. polling; PostGIS vs. MySQL spatial vs. plain lat/lng columns; a queue for ingest vs. synchronous writes]]`.

### The hard part
`[[Candidates: the pings table grew until route queries slowed down; devices sent out-of-order or duplicate pings; clock skew between devices; the browser choked rendering thousands of points — how did you downsample?]]`

### Implementation details
- Index strategy for the time-window + driver filter.
- Point downsampling for map rendering `[[if any]]`.
- Role-based views (sales / dispatch / management).

### Testing & quality · Deployment & operations
`[[ ]]`

### Outcomes & metrics
| Metric | Before | After |
|---|---|---|
| Pings ingested / day | — | `[[ ]]` |
| Dashboard load time (1-day route) | `[[ ]]` | `[[ ]]` |
| Field-team support requests / week | `[[ ]]` | `[[ ]]` |
| On-time deliveries | `[[ ]]` | `[[ ]]` |

### ⚠️ Need from you
1. Ping volume and number of vehicles.
2. How the data reaches you (device app posting to your API? third-party GPS provider?).
3. What the caching actually is.
4. The claim "improved on-time deliveries" needs a number or it should go — interviewers will ask.

---

## 4 · Lunch Management App  ✂️ CUT (or merge)

**Why cut:** without a twist, a menu/order app reads as a tutorial project and dilutes the three strong ones.

**What's salvageable:** time-based order cutoffs and duplicate-order prevention are correctness problems — but the Invoice Workflow Tracker tells the same story better.

**If you keep it,** it needs a hook like:
> "Handled the 11:59 ordering rush for `[[N]]` staff: DB-level uniqueness plus a server-side cutoff guard so late or double orders are impossible, not just hidden in the UI."

…and a hard part (e.g., a race at the cutoff, timezone bugs, edits after a vendor summary was already exported). Also note Filament PHP is in the tech list — if the admin panel is Filament, say so; "Blade/JS UI" alone undersells the choice.

---

## 5 · Inventory Photo Manager  ✂️ DEMOTE to resume bullet

Suggested bullet:
> Built a Laravel image-management tool mapping product photos to `[[N]]` SKUs with validation, role-based access and an audit trail; cut sales reps' image lookup from minutes to seconds.

**Keep as a case study only if** there's a real engineering problem: migrating thousands of existing images with inconsistent names (how did you match them to SKUs?), storage/thumbnail generation, or large-upload performance.

---

## 6 · Data Quality & Insights  ➡️ MOVE to About/Resume

It's analysis work, not a system, and the "banking" context is its main strength. Suggested resume bullet:
> Wrote SQL validation and deduplication routines across `[[N]]` source systems for a bank's data-governance team, turning ad-hoc cleanup into reusable views and scripts `[[and reducing manual reconciliation by ~X hrs/week]]`.

**Upgrade path:** if the checks ran on a schedule and alerted on failures, it's a data-pipeline project — rewrite it that way.

---

## Site structure changes (after the content is final)

The framework calls for full case-study pages (800–1,500 words each). The current site shows case studies in a modal with a fixed schema (overview / challenges / solution / results). When your answers are in, I'll:

1. Extend `projects.json` with: `hook`, `context`, `ownership`, `teamSize`, `architecture`, `decisions[]` (decision + why + rejected alternative), `hardPart`, `testing`, `operations`, `metrics[]` (label / before / after), `retrospective[]`.
2. Replace the modal with dedicated, linkable case-study pages (the `#project-<id>` links already work, so the URLs can stay the same shape), with the architecture diagram at the top and a before/after metrics table.
3. Put the **one-line hook** on each homepage card instead of the current description.
4. Trim the homepage to 3 featured cards; move the others to a short "Other work" list or the resume.
5. Rewrite the skills section by proficiency rather than category, and drop anything you wouldn't want to be quizzed on (e.g., is JSF/JSP or XML worth listing for your target role?).
6. Add a resume page mirroring the same projects and wording.

**GitHub:** only one repo (this one) is visible to me. Worth pinning it with the README improvements, and pinning any public code related to the featured projects — even a small sanitized sample of the state machine or the caching layer would help a lot, since the work projects themselves are presumably private.

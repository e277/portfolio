# Ezra Muir — Portfolio

Personal portfolio and case studies, built with **Next.js 16 (App Router, static export)**, **Tailwind CSS v4** and **shadcn/ui-style components** (Radix + CVA), deployed to **GitHub Pages**.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run typecheck
```

## Project structure

```
src/
  app/
    layout.tsx               # Fonts, theme provider, header/footer, metadata
    page.tsx                 # Home: hero, case study cards, about/skills, contact
    projects/[slug]/page.tsx # One statically generated page per case study
    globals.css              # Design tokens (light/dark) and Tailwind setup
  components/
    ui/                      # shadcn-style primitives: Button, Badge, Card
    project-card.tsx, site-header.tsx, site-footer.tsx, theme-toggle.tsx
  content/
    projects.ts              # All case study content (typed)
    profile.ts               # Name, positioning, about, links, skills
public/images/               # Diagrams and screenshots
```

## Adding or editing a case study

Everything lives in `src/content/projects.ts`. Each project needs `slug`, `title`, `hook` (one sentence: problem + impact), `category`, `context`, `role` and `stack`. Every other section is optional and only rendered when present:

| Field | Section on the case study page |
| --- | --- |
| `architecture` (+ `diagrams`) | Architecture, with diagrams |
| `decisions` | Key decisions & trade-offs (with the rejected alternative) |
| `challenges`, `approach` | Challenges / Approach |
| `hardParts` | The hard part |
| `implementation` | Implementation details |
| `testing`, `operations` | Testing & quality / Deployment & operations |
| `metrics`, `outcomes` | Headline numbers / Outcomes (or "Expected impact" when `status` is set) |
| `retrospective` | What I'd do differently |

The first project in the array is shown as the featured card.

## Deployment

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

One-time setup: in the repository go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. The site will be served at `https://e277.github.io/portfolio/`. The base path is supplied by the workflow, so a custom domain works without code changes.

## Brand

The **ungu** mark is a single continuous stroke tracing the "u-n" of the name — read as a line of data flowing through a pipe — on an indigo-to-teal gradient (`#4f46e5` → `#0d9488`).

| File | Use |
| --- | --- |
| `src/components/logo.tsx` | `<LogoMark />` and `<Logo />` (mark + wordmark) React components |
| `src/app/icon.svg`, `src/app/apple-icon.png` | Favicon and iOS home-screen icon (picked up by Next.js automatically) |
| `public/og.png` | Link preview image for LinkedIn, Slack, X, etc. |
| `public/brand/ungu-mark.svg`, `ungu-mark-512.png` | The mark on its own — use for avatars (GitHub, LinkedIn) |
| `public/brand/ungu-logo-light.png` / `-dark.png` | Mark + wordmark, for light and dark backgrounds |

The `ungu-logo-*.svg` lockups render the wordmark as text in Geist; use the PNGs where Geist isn't installed.

# My Portfolio (Vanilla HTML/CSS/JS)

A modern, static portfolio that loads project data from `projects.json` and renders it with vanilla JavaScript. Each project opens a case study modal with a shareable link.

## Prerequisites
- Node.js 16+ (for using quick local servers via `npx`)

## Project structure
```
index.html              # Main portfolio page with project cards
css/styles.css          # Styles (includes case study page styling)
js/main.js              # Main logic, fetches projects.json and renders cards
projects.json           # Project data (case studies)
images/                 # Place images/logos here
```

## How it works
1. **Main page (index.html):** Hero, skills, project cards, and contact links.
2. **Project cards:** Rendered from `projects.json`, filterable by category (all/backend/fullstack) with per-category counts.
3. **Case studies:** Clicking a card opens a modal with the overview, challenges, solution, results, and technologies.
4. **Deep links:** Each case study has a shareable URL (`#project-<id>`, e.g. `index.html#project-6`), and the browser back button closes it.
5. **Theme:** Follows the visitor's OS light/dark preference until they pick one with the toggle; the choice is remembered.

## Running locally
```
npx serve .
# or
python3 -m http.server 8000
```

## Adding a project
Add an entry to `projects.json`:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Unique number; used in the `#project-<id>` URL |
| `title`, `description`, `overview` | yes | Plain text (HTML is escaped) |
| `category` | yes | `fullstack` or `backend` |
| `challenges`, `solution`, `results`, `technologies` | yes | Arrays of strings |
| `role` | no | Defaults to "Full Stack Developer" |
| `image`, `imageAlt` | no | Screenshot path (e.g. `images/foo.png`); shown in the modal and as the card background |

## Notes
- The site must be served over HTTP for `fetch('./projects.json')` to work; opening `index.html` via `file://` will block the request.
- Caching is disabled for the JSON request (`cache: 'no-cache'`), so edits to `projects.json` show on refresh.
- Accessibility: keyboard-operable cards and filters, focus-trapped dialog with focus return, skip link, visible focus styles, and `prefers-reduced-motion` support.

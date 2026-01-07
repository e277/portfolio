# Ezra Muir Portfolio (Vanilla HTML/CSS/JS)

A modern, static portfolio that loads project data from `projects.json` and renders it with vanilla JavaScript. Features dedicated case study pages for detailed project narratives. Requires running over HTTP (not `file://`) so the JSON can be fetched.

## Prerequisites
- Node.js 16+ (for using quick local servers via `npx`)

## Run locally
Run this command in the project root (`c:\Users\emuir\Documents\dev\Javascript\portfolio`):

```bash
npx serve .
```

Then open the printed URL (e.g., `http://localhost:3000`).

## Project structure
```
index.html              # Main portfolio page with project cards
case-study.html         # Case study detail page template (dynamic content)
css/styles.css          # Styles (includes case study page styling)
js/main.js              # Main logic, fetches projects.json and renders cards
js/case-study.js        # Case study page loader, fetches project by ID from URL
projects.json           # Project data (6 case studies with detailed info)
images/                 # Place images/logos here
```

## Editing content
- Update text/sections in `index.html` (hero/about, skills, contact).
- Update case studies in `projects.json` (title, category, description, overview, challenges, solution, results, technologies, optional image).
- Add project images to the `images/` folder and reference them in projects.json via the "image" field.

## How it works
1. **Main page (index.html):** Displays project cards with filtering by category (all/fullstack/backend)
2. **Project cards:** Click any project to navigate to its dedicated case study page
3. **Case study page (case-study.html):** Loads project data from projects.json based on URL query param (`?id=X`)
4. **Dynamic rendering:** js/case-study.js fetches and renders the project details, including image, overview, challenges, solution, results, and technologies

## URL structure
- **Main page:** `http://localhost:3000/` or `http://localhost:3000/index.html`
- **Case study:** `http://localhost:3000/case-study.html?id=1` (replace `1` with project ID)

## Notes
- The site must be served over HTTP for `fetch('./projects.json')` to work; opening `index.html` via `file://` will block the request.
- Caching is disabled for the JSON request (`cache: 'no-cache'`), so edits to `projects.json` show on refresh.
- Case study pages dynamically load project data, so adding/editing projects in `projects.json` automatically updates the detail pages.
- Each project needs an `id` field for the case study URL to work.

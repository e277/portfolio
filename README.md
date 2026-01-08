# My Portfolio (Vanilla HTML/CSS/JS)

A modern, static portfolio that loads project data from `projects.json` and renders it with vanilla JavaScript. Features dedicated case study for detailed project narratives.

## Prerequisites
- Node.js 16+ (for using quick local servers via `npx`)

## Project structure
```
index.html              # Main portfolio page with project cards
css/styles.css          # Styles (includes case study page styling)
js/main.js              # Main logic, fetches projects.json and renders cards
projects.json           # Project data (6 case studies with detailed info)
images/                 # Place images/logos here
```

## How it works
1. **Main page (index.html):** Displays project cards with filtering by category (all/fullstack/backend)
2. **Project cards:** Click any project card for detail modal popup for the project
3. **Case study:** Loads project data from projects.json
4. **Dynamic rendering:** Fetches and renders the project details, including image, overview, challenges, solution, results, and technologies

## Notes
- The site must be served over HTTP for `fetch('./projects.json')` to work; opening `index.html` via `file://` will block the request.
- Caching is disabled for the JSON request (`cache: 'no-cache'`), so edits to `projects.json` show on refresh.
- Case study pages dynamically load project data, so adding/editing projects in `projects.json` automatically updates the detail pages.
- Each project needs an `id` field for the case study URL to work.


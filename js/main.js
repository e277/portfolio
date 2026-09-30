/* ============================================
   PORTFOLIO JAVASCRIPT
   ============================================ */

// State
let projects = [];
let currentFilter = 'all';
let lastFocusedElement = null;
const defaultTitle = document.title;

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    setupActiveNavHighlight();
    setFooterYear();
    loadProjects().then(() => {
        updateFilterCounts();
        displayProjects(projects);
        openProjectFromHash();
    });
});

/* ============================================
   UTILITIES
   ============================================ */

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function listItemsHTML(items = []) {
    return items.map(item => `<li>${escapeHTML(item)}</li>`).join('');
}

function setFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================================
   THEME MANAGEMENT
   ============================================ */

// The initial theme is applied by an inline script in <head> to avoid a flash
// of the wrong theme; this keeps the toggle button in sync with it.
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    updateThemeToggle(isDarkTheme());
    themeToggle.addEventListener('click', toggleTheme);

    // Follow OS changes until the visitor picks a theme explicitly
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (e) => {
        if (getStoredTheme() === null) {
            applyTheme(e.matches);
        }
    });
}

function isDarkTheme() {
    return document.documentElement.dataset.theme === 'dark';
}

function getStoredTheme() {
    try {
        return localStorage.getItem('theme');
    } catch {
        return null;
    }
}

function applyTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    updateThemeToggle(dark);
}

function toggleTheme() {
    const dark = !isDarkTheme();
    applyTheme(dark);
    try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
        // Storage unavailable (private mode); theme still applies for this visit
    }
}

function updateThemeToggle(dark) {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = dark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.title = themeToggle.getAttribute('aria-label');
}

/* ============================================
   PROJECT MANAGEMENT
   ============================================ */

async function loadProjects() {
    try {
        const response = await fetch('./projects.json', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status}`);
        }
        projects = await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = [];
        showProjectsError(
            'Unable to load projects.json. If you are opening this file locally, start a local server (for example: "npx serve" in this folder) so fetch can read JSON files.'
        );
    }
}

function displayProjects(projectsToDisplay) {
    const projectsGrid = document.getElementById('projectsGrid');

    if (projects.length === 0) {
        return; // error message (if any) is already shown
    }

    projectsGrid.innerHTML = '';

    if (projectsToDisplay.length === 0) {
        projectsGrid.innerHTML = '<p class="project-empty">No projects found.</p>';
        return;
    }

    projectsToDisplay.forEach(project => {
        projectsGrid.appendChild(createProjectCard(project));
    });
}

function showProjectsError(message) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `<p class="project-error">${escapeHTML(message)}</p>`;
    }
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.category = project.category;

    const techHTML = project.technologies
        .map(tech => `<li class="tech-badge">${escapeHTML(tech)}</li>`)
        .join('');

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${escapeHTML(project.title)}</h3>
            <span class="project-category">${escapeHTML(formatCategory(project.category))}</span>
        </div>
        <div class="project-body">
            <p class="project-description">${escapeHTML(project.description)}</p>
            <ul class="project-tech" aria-label="Technologies">
                ${techHTML}
            </ul>
        </div>
        <div class="project-footer">
            <a href="#project-${escapeHTML(project.id)}" class="project-btn">
                View Case Study<span class="visually-hidden">: ${escapeHTML(project.title)}</span> <span aria-hidden="true">→</span>
            </a>
        </div>
    `;

    // Screenshots show as a tinted header background so every card stays the same height
    if (project.image) {
        const header = card.querySelector('.project-header');
        header.classList.add('has-image');
        const imageUrl = new URL(project.image, document.baseURI).href;
        header.style.setProperty('--header-image', `url("${imageUrl}")`);
    }

    // The link is the accessible control; clicking anywhere on the card follows it
    const link = card.querySelector('.project-btn');
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        if (window.getSelection().toString()) return; // allow selecting text
        link.click();
    });

    return card;
}

/* ============================================
   MODAL MANAGEMENT
   ============================================ */

function openProjectFromHash() {
    const match = window.location.hash.match(/^#project-(\d+)$/);
    if (match) {
        openCaseStudyModal(Number(match[1]));
    } else if (isModalOpen()) {
        closeCaseStudyModal({ updateHash: false });
    }
}

function isModalOpen() {
    return document.getElementById('caseStudyModal').classList.contains('active');
}

function openCaseStudyModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('caseStudyModal');
    if (!isModalOpen()) {
        lastFocusedElement = document.activeElement;
    }

    renderCaseStudyInModal(project);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const modalBody = modal.querySelector('.modal-body');
    modalBody.scrollTop = 0;
    modal.querySelector('.modal-content').focus();
}

function closeCaseStudyModal({ updateHash = true } = {}) {
    const modal = document.getElementById('caseStudyModal');
    if (!isModalOpen()) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.title = defaultTitle;

    if (updateHash && window.location.hash.startsWith('#project-')) {
        history.replaceState(null, '', window.location.pathname + window.location.search + '#projects');
    }

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus({ preventScroll: true });
    }
    lastFocusedElement = null;
}

function trapFocus(e) {
    const modal = document.getElementById('caseStudyModal');
    const focusable = modal.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const container = modal.querySelector('.modal-content');

    if (e.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function renderCaseStudyInModal(project) {
    document.title = `${project.title} | Ezra Muir`;

    // Header content
    document.getElementById('modalCaseStudyTitle').textContent = project.title;
    document.getElementById('modalCaseStudyDescription').textContent = project.description;
    const badge = document.getElementById('modalCategoryBadge');
    badge.textContent = formatCategory(project.category);
    badge.className = `category-badge category-${project.category}`;

    // Image container
    const imageContainer = document.getElementById('modalImageContainer');
    if (project.image) {
        imageContainer.innerHTML = `
            <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.imageAlt || project.title)}" class="case-study-image">
        `;
        imageContainer.hidden = false;
    } else {
        imageContainer.innerHTML = '';
        imageContainer.hidden = true;
    }

    // Meta info
    document.getElementById('modalRoleValue').textContent = project.role || 'Full Stack Developer';
    document.getElementById('modalCategoryValue').textContent = formatCategory(project.category);

    // Narrative sections
    document.getElementById('modalOverviewText').textContent = project.overview;
    document.getElementById('modalChallengesList').innerHTML = listItemsHTML(project.challenges);
    document.getElementById('modalSolutionList').innerHTML = listItemsHTML(project.solution);
    document.getElementById('modalResultsList').innerHTML = listItemsHTML(project.results);

    // Technologies
    document.getElementById('modalTechList').innerHTML = project.technologies
        .map(tech => `<li class="skill-tag">${escapeHTML(tech)}</li>`)
        .join('');
}

function formatCategory(category) {
    const categoryMap = {
        'fullstack': 'Full Stack',
        'backend': 'Backend'
    };
    return categoryMap[category] || category;
}

/* ============================================
   FILTERING
   ============================================ */

function filterProjects(category) {
    currentFilter = category;

    const filtered = category === 'all'
        ? projects
        : projects.filter(p => p.category === category);

    displayProjects(filtered);
    updateFilterButtons();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isActive = btn.dataset.filter === currentFilter;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
}

function updateFilterCounts() {
    if (projects.length === 0) return;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        const count = filter === 'all'
            ? projects.length
            : projects.filter(p => p.category === filter).length;
        const countEl = btn.querySelector('.filter-count');
        if (countEl) {
            countEl.textContent = count;
        }
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

function setupActiveNavHighlight() {
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = [...links]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => {
                const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('active', isCurrent);
                if (isCurrent) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

function setMobileMenu(open) {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            setMobileMenu(!navLinks.classList.contains('active'));
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', () => setMobileMenu(false));
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
    });

    // Case study deep links (#project-<id>) open the modal, and back/forward closes it
    window.addEventListener('hashchange', openProjectFromHash);

    // Modal close handlers
    const modal = document.getElementById('caseStudyModal');
    document.querySelector('.modal-close').addEventListener('click', () => closeCaseStudyModal());
    document.querySelector('.modal-overlay').addEventListener('click', () => closeCaseStudyModal());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isModalOpen()) {
                closeCaseStudyModal();
            } else if (navLinks.classList.contains('active')) {
                setMobileMenu(false);
                mobileMenuToggle.focus();
            }
        } else if (e.key === 'Tab' && modal.classList.contains('active')) {
            trapFocus(e);
        }
    });
}

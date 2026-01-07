/* ============================================
   PORTFOLIO JAVASCRIPT
   ============================================ */

// State
let projects = [];
let filteredProjects = [];
let currentFilter = 'all';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadProjects().then(() => displayProjects(projects));
    setupEventListeners();
});

/* ============================================
   THEME MANAGEMENT
   ============================================ */

function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
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
        filteredProjects = [...projects];
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = [];
        filteredProjects = [];
        showProjectsError(
            'Unable to load projects.json. If you are opening this file locally, start a local server (for example: "npx serve" in this folder) so fetch can read JSON files.'
        );
    }
}

function displayProjects(projectsToDisplay) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    if (projectsToDisplay.length === 0) {
        projectsGrid.innerHTML = '<p>No projects found.</p>';
        return;
    }
    
    projectsToDisplay.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function showProjectsError(message) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `<p class="project-error">${message}</p>`;
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.style.cursor = 'pointer';
    
    const techHTML = project.technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.title}</h3>
            <span class="project-category">${project.category}</span>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techHTML}
            </div>
        </div>
        <div class="project-footer">
            <a href="#" class="project-btn" data-project-id="${project.id}">View Case Study →</a>
        </div>
    `;
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
        e.preventDefault();
        openCaseStudyModal(project.id);
    });
    
    return card;
}

/* ============================================
   MODAL MANAGEMENT
   ============================================ */

function openCaseStudyModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('caseStudyModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show loading, hide content
    document.getElementById('modalLoadingState').style.display = 'block';
    document.getElementById('modalCaseStudyContent').style.display = 'none';
    
    // Small delay to show loading state
    setTimeout(() => {
        renderCaseStudyInModal(project);
        document.getElementById('modalLoadingState').style.display = 'none';
        document.getElementById('modalCaseStudyContent').style.display = 'block';
    }, 300);
}

function closeCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderCaseStudyInModal(project) {
    // Update page title
    document.title = `${project.title} - Ezra Muir Portfolio`;
    
    // Header content
    document.getElementById('modalCaseStudyTitle').textContent = project.title;
    document.getElementById('modalCaseStudyDescription').textContent = project.description;
    document.getElementById('modalCategoryBadge').textContent = formatCategory(project.category);
    document.getElementById('modalCategoryBadge').className = `category-badge category-${project.category}`;
    
    // Image container
    const imageContainer = document.getElementById('modalImageContainer');
    if (project.image) {
        imageContainer.innerHTML = `
            <img src="${project.image}" alt="${project.imageAlt || project.title}" class="case-study-image">
        `;
    } else {
        imageContainer.innerHTML = `
            <div class="case-study-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                    <rect width="200" height="200" fill="#e0e0e0"/>
                    <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="60" fill="#999">&lt;/&gt;</text>
                </svg>
            </div>
        `;
    }
    
    // Meta info
    document.getElementById('modalRoleValue').textContent = project.role || 'Full Stack Developer';
    document.getElementById('modalCategoryValue').textContent = formatCategory(project.category);
    
    // Overview
    document.getElementById('modalOverviewText').textContent = project.overview;
    
    // Challenges
    document.getElementById('modalChallengesList').innerHTML = project.challenges
        .map(challenge => `<li>${challenge}</li>`)
        .join('');
    
    // Solution
    document.getElementById('modalSolutionList').innerHTML = project.solution
        .map(item => `<li>${item}</li>`)
        .join('');
    
    // Results
    document.getElementById('modalResultsList').innerHTML = project.results
        .map(result => `<li>${result}</li>`)
        .join('');
    
    // Technologies
    document.getElementById('modalTechList').innerHTML = project.technologies
        .map(tech => `<span class="skill-tag">${tech}</span>`)
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
    
    if (category === 'all') {
        filteredProjects = [...projects];
    } else {
        filteredProjects = projects.filter(p => p.category === category);
    }
    
    displayProjects(filteredProjects);
    updateFilterButtons();
}

function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
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
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterProjects(e.target.dataset.filter);
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Modal close handlers
    const modal = document.getElementById('caseStudyModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeCaseStudyModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeCaseStudyModal);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeCaseStudyModal();
        }
    });
}

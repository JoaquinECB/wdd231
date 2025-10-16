// Navigation Module
export function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('header')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// Modal Module
export function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

export function openModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

// Data Loading Module
export async function loadRegions() {
    try {
        const response = await fetch('data/regions.json');
        if (!response.ok) throw new Error('Failed to fetch regions data');

        const data = await response.json();
        displayRegions(data.regions);
        localStorage.setItem('regionsData', JSON.stringify(data.regions));
    } catch (error) {
        console.error('Error loading regions:', error);
        const cached = localStorage.getItem('regionsData');
        if (cached) {
            displayRegions(JSON.parse(cached));
        }
    }
}

export async function loadStories() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('Failed to fetch stories data');

        const data = await response.json();
        displayStories(data.stories);
        localStorage.setItem('storiesData', JSON.stringify(data.stories));
    } catch (error) {
        console.error('Error loading stories:', error);
        const cached = localStorage.getItem('storiesData');
        if (cached) {
            displayStories(JSON.parse(cached));
        }
    }
}

function displayRegions(regions) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    mapContainer.innerHTML = '';

    regions.forEach(region => {
        const regionCard = document.createElement('div');
        regionCard.className = 'region-card';
        regionCard.innerHTML = `
            <h4>${region.name}</h4>
            <div class="data-box">
                <p><strong>Population:</strong> ${region.population}</p>
                <p><strong>Access Level:</strong> ${region.accessLevel}%</p>
                <p>${region.description}</p>
            </div>
        `;

        regionCard.addEventListener('click', () => {
            openModal(region.name, `
                <p><strong>Population:</strong> ${region.population}</p>
                <p><strong>Access Level:</strong> ${region.accessLevel}%</p>
                <p><strong>Details:</strong> ${region.description}</p>
                <p><strong>Challenges:</strong> ${region.challenges}</p>
            `);
        });

        mapContainer.appendChild(regionCard);
    });
}

function displayStories(stories) {
    const storiesContainer = document.getElementById('storiesContainer');
    if (!storiesContainer) return;

    storiesContainer.innerHTML = '';

    stories
        .filter(story => story.featured)
        .slice(0, 15)
        .forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.innerHTML = `
                <h4>${story.title}</h4>
                <p>${story.description}</p>
                <div class="data-box meta">
                    <p><strong>Region:</strong> ${story.region}</p>
                    <p><strong>People Helped:</strong> ${story.peopleHelped}</p>
                    <p><strong>Year:</strong> ${story.year}</p>
                </div>
            `;

            storyCard.addEventListener('click', () => {
                openModal(story.title, `
                    <p><strong>Region:</strong> ${story.region}</p>
                    <p><strong>Description:</strong> ${story.description}</p>
                    <p><strong>People Helped:</strong> ${story.peopleHelped.toLocaleString()}</p>
                    <p><strong>Year:</strong> ${story.year}</p>
                    <p><strong>Impact:</strong> ${story.impact}</p>
                `);
            });

            storiesContainer.appendChild(storyCard);
        });
}

// Form Module
export function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        region: formData.get('region'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    submissions.push(data);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    sessionStorage.setItem('formData', JSON.stringify(data));

    setTimeout(() => {
       window.location.href = 'form-response.html';
    }, 500);
    // ...existing
}

// Projects Module
export async function loadProjects() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('Failed to fetch projects data');

        const data = await response.json();
        displayProjects(data.stories);
        updateStatistics(data.stories);
        localStorage.setItem('projectsData', JSON.stringify(data.stories));
    } catch (error) {
        console.error('Error loading projects:', error);
        const cached = localStorage.getItem('projectsData');
        if (cached) {
            const projects = JSON.parse(cached);
            displayProjects(projects);
            updateStatistics(projects);
        }
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', getCategoryFromProject(project));
        projectCard.innerHTML = `
            <div class="project-header">
                <h4>${project.title}</h4>
                <span class="badge">${project.region}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="data-box">
                <p><strong>Year:</strong> ${project.year}</p>
                <p><strong>People Helped:</strong> ${project.peopleHelped.toLocaleString()}</p>
            </div>
            <button class="btn btn-secondary" onclick="viewProjectDetails('${project.id}')">View Details</button>
        `;

        container.appendChild(projectCard);
    });
}

function getCategoryFromProject(project) {
    if (project.title.includes('Water') || project.title.includes('Well') || project.title.includes('Pipeline')) {
        return 'infrastructure';
    } else if (project.title.includes('Education') || project.title.includes('Awareness')) {
        return 'education';
    } else if (project.title.includes('Conservation') || project.title.includes('Efficiency') || project.title.includes('Harvesting')) {
        return 'conservation';
    }
    return 'all';
}

export function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateStatistics(projects) {
    const totalProjects = projects.length;
    const totalPeople = projects.reduce((sum, project) => sum + project.peopleHelped, 0);
    const uniqueRegions = new Set(projects.map(project => project.region)).size;
    const averageImpact = Math.round((totalPeople / (totalProjects * 500)) * 100);

    const totalProjectsEl = document.getElementById('totalProjects');
    const totalPeopleEl = document.getElementById('totalPeople');
    const averageImpactEl = document.getElementById('averageImpact');
    const regionsReachedEl = document.getElementById('regionsReached');

    if (totalProjectsEl) totalProjectsEl.textContent = totalProjects;
    if (totalPeopleEl) totalPeopleEl.textContent = totalPeople.toLocaleString();
    if (averageImpactEl) averageImpactEl.textContent = Math.min(averageImpact, 100) + '%';
    if (regionsReachedEl) regionsReachedEl.textContent = uniqueRegions;
}

export function viewProjectDetails(projectId) {
    const projects = JSON.parse(localStorage.getItem('projectsData')) || [];
    const project = projects.find(p => p.id == projectId);

    if (project) {
        openModal(project.title, `
            <p><strong>Region:</strong> ${project.region}</p>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>People Helped:</strong> ${project.peopleHelped.toLocaleString()}</p>
            <p><strong>Year Started:</strong> ${project.year}</p>
            <p><strong>Impact:</strong> ${project.impact}</p>
        `);
    }
}

export function displayFormResponse() {
    const formData = sessionStorage.getItem('formData');
    const detailsBox = document.querySelector('.details-box');

    if (formData && detailsBox) {
        try {
            const data = JSON.parse(formData);
            const submissionDate = new Date(data.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            detailsBox.innerHTML = `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>Initiative Description:</strong> ${data.message}</p>
                <p><strong>Submission Date:</strong> ${submissionDate}</p>
                <p><strong>Reference ID:</strong> WFA-${Date.now().toString().slice(-8)}</p>
            `;
        } catch (error) {
            console.error('Error displaying form data:', error);
            detailsBox.innerHTML = '<p>Unable to display submission details. Please contact support.</p>';
        }
    }
}
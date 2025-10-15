import { setupNavigation } from './navigation.js';
import { setupModal } from './ui-components.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    loadProjectsData();
    setupFilters();
});

async function loadProjectsData() {
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
                <span class="project-badge">${project.region}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <p><strong>Year:</strong> ${project.year}</p>
                <p><strong>People Helped:</strong> ${project.peopleHelped.toLocaleString()}</p>
            </div>
            <button class="project-btn" onclick="viewProjectDetails('${project.id}', '${project.title}')">View Details</button>
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

function setupFilters() {
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

    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('totalPeople').textContent = totalPeople.toLocaleString();
    document.getElementById('averageImpact').textContent = Math.min(averageImpact, 100) + '%';
    document.getElementById('regionsReached').textContent = uniqueRegions;
}

function viewProjectDetails(projectId, projectTitle) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const projects = JSON.parse(localStorage.getItem('projectsData')) || [];
    const project = projects.find(p => p.id == projectId);

    if (project) {
        modalTitle.textContent = project.title;
        modalBody.innerHTML = `
            <p><strong>Region:</strong> ${project.region}</p>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>People Helped:</strong> ${project.peopleHelped.toLocaleString()}</p>
            <p><strong>Year Started:</strong> ${project.year}</p>
            <p><strong>Impact:</strong> ${project.impact}</p>
        `;

        modal.style.display = 'block';
    }
}

window.viewProjectDetails = viewProjectDetails;

function scrollToContact() {
    window.location.href = 'index.html#contactSection';
}
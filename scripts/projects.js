import {
    setupNavigation,
    setupModal,
    loadProjects,
    setupProjectFilters,
    viewProjectDetails
} from './modules.js';

// Initialize projects page
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    loadProjectsData();
    setupProjectFilters();
});

async function loadProjectsData() {
    try {
        await loadProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Global function for project details
window.viewProjectDetails = viewProjectDetails;

function scrollToContact() {
    window.location.href = 'index.html#contactSection';
}

window.scrollToContact = scrollToContact;
import {
    setupNavigation,
    setupModal,
    loadProjects,
    setupProjectFilters
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
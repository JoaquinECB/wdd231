import {
    setupNavigation,
    setupModal,
    loadRegions,
    loadStories,
    setupForm,
    displayFormResponse
} from './modules.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    setupForm();

    // Load data only on home page
    const currentPage = window.location.pathname.split('/').pop() || '';
    if (currentPage === 'final-project.html' || currentPage === 'finalproject.html' || currentPage === 'index.html' || currentPage === '') {
        loadHomePageData();
    }

    // Load form response data
    if (currentPage === 'form-response.html') {
        displayFormResponse();
    }
});

async function loadHomePageData() {
    try {
        await loadRegions();
        await loadStories();
    } catch (error) {
        console.error('Error loading home page data:', error);
    }
}

// CTA Button functionality
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const mapSection = document.querySelector('.bg-white');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Global function for project details
window.viewProjectDetails = function (projectId) {
    import('./modules.js').then(module => {
        module.viewProjectDetails(projectId);
    });
};
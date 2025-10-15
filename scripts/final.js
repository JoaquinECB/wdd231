import { setupNavigation } from './navigation.js';
import { loadRegions, loadStories } from './data-handler.js';
import { setupModal, setupForm } from './ui-components.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    setupForm();
    loadMapAndStories();
});

async function loadMapAndStories() {
    try {
        await loadRegions();
        await loadStories();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// CTA Button functionality
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const mapSection = document.querySelector('.interactive-map');
        mapSection.scrollIntoView({ behavior: 'smooth' });
    });
}
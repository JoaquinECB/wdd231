// Visit Message Functionality
function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    const messageDiv = document.getElementById('visit-message');

    if (!lastVisit) {
        messageDiv.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysDiff = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            messageDiv.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            messageDiv.textContent = "You last visited 1 day ago.";
        } else {
            messageDiv.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }

    localStorage.setItem('lastVisit', now);
}

// Load Attractions from JSON
async function loadAttractions() {
    try {
        const response = await fetch('data/attractions.json');
        const attractions = await response.json();

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        attractions.forEach(attraction => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h2>${attraction.name}</h2>
                <figure>
                    <img src="images/${attraction.image}" alt="${attraction.name}" loading="lazy">
                </figure>
                <address>${attraction.address}</address>
                <p>${attraction.description}</p>
                <button>Learn More</button>
            `;

            gallery.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading attractions:', error);
        document.getElementById('gallery').innerHTML = '<p class="loading">Unable to load attractions.</p>';
    }
}

// Footer Date Updates
const yearEl = document.getElementById('year');
const lastModEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModEl) lastModEl.textContent = document.lastModified;

// Initialize
displayVisitMessage();
loadAttractions();

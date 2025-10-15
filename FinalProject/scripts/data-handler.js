// Fetch regions data from local JSON file
export async function loadRegions() {
    try {
        const response = await fetch('data/regions.json');
        if (!response.ok) throw new Error('Failed to fetch regions data');

        const data = await response.json();
        displayRegions(data.regions);

        // Save to localStorage for persistence
        localStorage.setItem('regionsData', JSON.stringify(data.regions));
    } catch (error) {
        console.error('Error loading regions:', error);
        // Try to load from localStorage if available
        const cached = localStorage.getItem('regionsData');
        if (cached) {
            displayRegions(JSON.parse(cached));
        }
    }
}

// Fetch stories data from local JSON file
export async function loadStories() {
    try {
        const response = await fetch('data/stories.json');
        if (!response.ok) throw new Error('Failed to fetch stories data');

        const data = await response.json();
        displayStories(data.stories);

        // Save to localStorage for persistence
        localStorage.setItem('storiesData', JSON.stringify(data.stories));
    } catch (error) {
        console.error('Error loading stories:', error);
        // Try to load from localStorage if available
        const cached = localStorage.getItem('storiesData');
        if (cached) {
            displayStories(JSON.parse(cached));
        }
    }
}

// Display regions using template literals and DOM manipulation
function displayRegions(regions) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    mapContainer.innerHTML = '';

    regions.forEach(region => {
        const regionCard = document.createElement('div');
        regionCard.className = 'region-card';
        regionCard.innerHTML = `
            <h4>${region.name}</h4>
            <p><strong>Population:</strong> ${region.population}</p>
            <p><strong>Access Level:</strong> ${region.accessLevel}%</p>
            <p>${region.description}</p>
        `;

        regionCard.addEventListener('click', () => {
            openRegionModal(region);
        });

        mapContainer.appendChild(regionCard);
    });
}

// Display stories using template literals and DOM manipulation
function displayStories(stories) {
    const storiesContainer = document.getElementById('storiesContainer');
    if (!storiesContainer) return;

    storiesContainer.innerHTML = '';

    // Use filter and map to process stories efficiently
    const processedStories = stories
        .filter(story => story.featured)
        .slice(0, 15);

    processedStories.map(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.innerHTML = `
            <h4>${story.title}</h4>
            <p>${story.description}</p>
            <div class="story-meta">
                <p><strong>Region:</strong> ${story.region}</p>
                <p><strong>People Helped:</strong> ${story.peopleHelped}</p>
                <p><strong>Year:</strong> ${story.year}</p>
            </div>
        `;

        storyCard.addEventListener('click', () => {
            openStoryModal(story);
        });

        storiesContainer.appendChild(storyCard);
    });
}

// Open modal for region details
function openRegionModal(region) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = region.name;
    modalBody.innerHTML = `
        <p><strong>Population:</strong> ${region.population}</p>
        <p><strong>Access Level:</strong> ${region.accessLevel}%</p>
        <p><strong>Details:</strong> ${region.description}</p>
        <p><strong>Challenges:</strong> ${region.challenges}</p>
    `;

    modal.style.display = 'block';
}

// Open modal for story details
function openStoryModal(story) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = story.title;
    modalBody.innerHTML = `
        <p><strong>Region:</strong> ${story.region}</p>
        <p><strong>Description:</strong> ${story.description}</p>
        <p><strong>People Helped:</strong> ${story.peopleHelped}</p>
        <p><strong>Year:</strong> ${story.year}</p>
        <p><strong>Impact:</strong> ${story.impact}</p>
    `;

    modal.style.display = 'block';
}
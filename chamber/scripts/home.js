// Footer - Year and Last Modified
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Weather API Configuration
const API_KEY = 'aa3a3a9cb7035a5306c578f5a0e50beb';
const LAT = -12.0464; // Lima, Peru latitude
const LON = -77.0428; // Lima, Peru longitude

// Fetch and display weather data
async function fetchWeather() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) {
            throw new Error('Weather API request failed');
        }

        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error('Forecast API request failed');
        }

        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
    } catch (error) {
        console.error('Weather API Error:', error);
        document.getElementById('weather-content').innerHTML =
            '<p class="error">Unable to load weather data. Please add your API key.</p>';
    }
}

// Display weather information
function displayWeather(current, forecast) {
    const temp = Math.round(current.main.temp);
    const desc = current.weather[0].description;

    // Get 3-day forecast (filtering for one entry per day)
    const forecastDays = [];
    const processedDates = new Set();

    for (let item of forecast.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US');

        if (!processedDates.has(dateStr) && forecastDays.length < 3) {
            const hour = date.getHours();
            // Prefer noon readings for better accuracy
            if (hour >= 11 && hour <= 14) {
                processedDates.add(dateStr);
                forecastDays.push({
                    day: date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    }),
                    temp: Math.round(item.main.temp),
                    desc: item.weather[0].description
                });
            }
        }

        if (forecastDays.length >= 3) break;
    }

    // If we don't have 3 days with noon data, fill with any available data
    if (forecastDays.length < 3) {
        forecastDays.length = 0;
        processedDates.clear();

        for (let item of forecast.list) {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString('en-US');

            if (!processedDates.has(dateStr) && forecastDays.length < 3) {
                processedDates.add(dateStr);
                forecastDays.push({
                    day: date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    }),
                    temp: Math.round(item.main.temp),
                    desc: item.weather[0].description
                });
            }
        }
    }

    // Build weather HTML
    const weatherHTML = `
        <div class="weather-info">
            <div class="current-weather">
                <div class="temperature">${temp}°C</div>
                <div class="weather-desc">${desc}</div>
            </div>
            <div class="forecast">
                ${forecastDays.map(day => `
                    <div class="forecast-day">
                        <h4>${day.day}</h4>
                        <div class="forecast-temp">${day.temp}°C</div>
                        <p>${day.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('weather-content').innerHTML = weatherHTML;
}

// Load and display member spotlights
async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');

        if (!response.ok) {
            throw new Error('Failed to load members data');
        }

        const members = await response.json();

        // Filter for Gold (3) and Silver (2) members only
        const qualifiedMembers = members.filter(
            member => member.membership === 2 || member.membership === 3
        );

        if (qualifiedMembers.length === 0) {
            throw new Error('No qualified members found');
        }

        // Randomly select 2 or 3 members
        const spotlightCount = Math.random() > 0.5 ? 3 : 2;
        const selectedMembers = [];
        const availableMembers = [...qualifiedMembers];

        // Randomly select members without repetition
        for (let i = 0; i < spotlightCount && availableMembers.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableMembers.length);
            selectedMembers.push(availableMembers[randomIndex]);
            availableMembers.splice(randomIndex, 1);
        }

        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Spotlights Error:', error);
        document.getElementById('spotlights-container').innerHTML =
            '<p class="error">Unable to load member spotlights.</p>';
    }
}

// Display spotlight cards
function displaySpotlights(members) {
    // Map membership levels to names
    const membershipNames = {
        1: 'Bronze',
        2: 'Silver',
        3: 'Gold'
    };

    const spotlightsHTML = members.map(member => {
        const membershipLevel = membershipNames[member.membership];
        const cssClass = membershipLevel.toLowerCase();

        return `
            <div class="spotlight-card ${cssClass}">
                <div class="spotlight-header">
                    <img src="images/${member.image}" 
                         alt="${member.name} logo" 
                         class="spotlight-logo" 
                         onerror="this.style.display='none'">
                    <div class="spotlight-title">
                        <h3>${member.name}</h3>
                        <span class="membership-badge ${cssClass}">
                            ${membershipLevel} Member
                        </span>
                    </div>
                </div>
                <div class="spotlight-info">
                    <p><strong>📞 Phone:</strong> ${member.phone}</p>
                    <p><strong>📍 Address:</strong> ${member.address}</p>
                    <p><strong>🏢 Website:</strong> 
                        <a href="${member.website}" 
                           target="_blank" 
                           class="spotlight-website">
                            Visit Website
                        </a>
                    </p>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('spotlights-container').innerHTML = spotlightsHTML;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    loadSpotlights();
});
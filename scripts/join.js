import { setupNavigation, setupModal, openModal } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    loadMembershipTiers();
    loadTestimonials();
    setupMembershipForm();
});

async function loadMembershipTiers() {
    try {
        const response = await fetch('data/membership.json');
        if (!response.ok) throw new Error('Failed to fetch membership data');

        const data = await response.json();
        displayMembershipTiers(data.tiers);
        localStorage.setItem('membershipData', JSON.stringify(data.tiers));
    } catch (error) {
        console.error('Error loading membership tiers:', error);
        const cached = localStorage.getItem('membershipData');
        if (cached) {
            displayMembershipTiers(JSON.parse(cached));
        }
    }
}

function displayMembershipTiers(tiers) {
    const container = document.getElementById('membershipContainer');
    if (!container) return;

    container.innerHTML = '';

    tiers.forEach(tier => {
        const tierCard = document.createElement('div');
        tierCard.className = 'membership-card';
        tierCard.innerHTML = `
            <div class="tier-header">
                <h4>${tier.name}</h4>
                <p class="tier-price">${tier.price}</p>
            </div>
            <div class="data-box">
                <p><strong>Duration:</strong> ${tier.duration}</p>
                <p><strong>Members:</strong> ${tier.memberCount}</p>
            </div>
            <ul class="tier-features">
                ${tier.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-secondary" onclick="openMembershipModal('${tier.name}', '${tier.description}')">Learn More</button>
        `;

        tierCard.addEventListener('click', () => {
            openModal(tier.name, `
                <p><strong>Price:</strong> ${tier.price}</p>
                <p><strong>Duration:</strong> ${tier.duration}</p>
                <p><strong>Description:</strong> ${tier.description}</p>
                <h5>Features included:</h5>
                <ul>
                    ${tier.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `);
        });

        container.appendChild(tierCard);
    });
}

async function loadTestimonials() {
    try {
        const response = await fetch('data/testimonials.json');
        if (!response.ok) throw new Error('Failed to fetch testimonials');

        const data = await response.json();
        displayTestimonials(data.testimonials);
        localStorage.setItem('testimonialsData', JSON.stringify(data.testimonials));
    } catch (error) {
        console.error('Error loading testimonials:', error);
        const cached = localStorage.getItem('testimonialsData');
        if (cached) {
            displayTestimonials(JSON.parse(cached));
        }
    }
}

function displayTestimonials(testimonials) {
    const container = document.getElementById('testimonialContainer');
    if (!container) return;

    container.innerHTML = '';

    testimonials
        .slice(0, 6)
        .forEach(testimonial => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            testimonialCard.innerHTML = `
                <div class="testimonial-rating">
                    ${'⭐'.repeat(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-author">- ${testimonial.author}</p>
                <p class="testimonial-role">${testimonial.role}</p>
                <p class="testimonial-region">${testimonial.region}</p>
            `;

            container.appendChild(testimonialCard);
        });
}

function setupMembershipForm() {
    const form = document.getElementById('membershipForm');
    if (!form) return;

    form.addEventListener('submit', handleMembershipSubmit);
}

function handleMembershipSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const interests = Array.from(formData.getAll('interests'));

    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        membershipTier: formData.get('membershipTier'),
        interests: interests,
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('memberSubmissions')) || [];
    submissions.push(data);
    localStorage.setItem('memberSubmissions', JSON.stringify(submissions));

    sessionStorage.setItem('memberData', JSON.stringify(data));

    setTimeout(() => {
        window.location.href = 'join-response.html';
    }, 500);
}

window.openMembershipModal = function (tierName, description) {
    openModal(tierName, description);
};
import { setupNavigation, setupModal } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    displayMembershipData();
});

function displayMembershipData() {
    const memberData = sessionStorage.getItem('memberData');
    const detailsBox = document.querySelector('.details-box');

    if (memberData && detailsBox) {
        try {
            const data = JSON.parse(memberData);
            const joinDate = new Date(data.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const membershipTierDisplay = data.membershipTier.charAt(0).toUpperCase() + data.membershipTier.slice(1);
            const interestsList = data.interests.length > 0
                ? data.interests.join(', ')
                : 'Not specified';

            detailsBox.innerHTML = `
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                <p><strong>Country:</strong> ${data.country}</p>
                <p><strong>Membership Tier:</strong> ${membershipTierDisplay}</p>
                <p><strong>Areas of Interest:</strong> ${interestsList}</p>
                <p><strong>Newsletter:</strong> ${data.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
                <p><strong>Join Date:</strong> ${joinDate}</p>
                <p><strong>Member ID:</strong> WFA-${Date.now().toString().slice(-8)}</p>
            `;
        } catch (error) {
            console.error('Error displaying membership data:', error);
            detailsBox.innerHTML = '<p>Unable to display membership details. Please contact support.</p>';
        }
    } else {
        detailsBox.innerHTML = '<p>No membership data found. Please complete the membership form again.</p>';
    }
}
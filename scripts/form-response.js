import { setupNavigation } from './navigation.js';
import { setupModal } from './ui-components.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModal();
    displaySubmissionData();
});

function displaySubmissionData() {
    const formData = sessionStorage.getItem('formData');
    const detailsBox = document.getElementById('submissionDetails');

    if (formData) {
        try {
            const data = JSON.parse(formData);
            const submissionDate = new Date(data.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            detailsBox.innerHTML = `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>Initiative Description:</strong> ${data.message}</p>
                <p><strong>Submission Date:</strong> ${submissionDate}</p>
                <p><strong>Reference ID:</strong> ${generateRefId()}</p>
            `;
        } catch (error) {
            console.error('Error displaying form data:', error);
            detailsBox.innerHTML = '<p>Unable to display submission details. Please contact support.</p>';
        }
    } else {
        detailsBox.innerHTML = '<p>No submission data found. Please submit the form again.</p>';
    }
}

function generateRefId() {
    return 'WFA-' + Date.now().toString().slice(-8);
}
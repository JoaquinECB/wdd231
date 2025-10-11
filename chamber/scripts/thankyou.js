// Get URL parameters and display form data
document.addEventListener('DOMContentLoaded', function () {
    // Set footer dates
    const yearSpan = document.getElementById('year');
    const lastModifiedSpan = document.getElementById('lastModified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the container for application data
    const dataContainer = document.getElementById('applicationData');

    if (!dataContainer) return;

    // Define the required fields to display
    const fieldsToDisplay = [
        { param: 'firstName', label: 'First Name' },
        { param: 'lastName', label: 'Last Name' },
        { param: 'email', label: 'Email Address' },
        { param: 'mobile', label: 'Mobile Phone' },
        { param: 'organization', label: 'Organization' },
        { param: 'timestamp', label: 'Submitted On' }
    ];

    // Create and display each field
    fieldsToDisplay.forEach(field => {
        const value = urlParams.get(field.param);

        if (value) {
            // Create info item div
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';

            // Create label
            const label = document.createElement('div');
            label.className = 'info-label';
            label.textContent = field.label + ':';

            // Create value div
            const valueDiv = document.createElement('div');
            valueDiv.className = 'info-value';

            // Format timestamp if it's the timestamp field
            if (field.param === 'timestamp') {
                try {
                    const date = new Date(value);
                    valueDiv.textContent = date.toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch (e) {
                    valueDiv.textContent = value;
                }
            } else {
                valueDiv.textContent = value;
            }

            // Append to info item
            infoItem.appendChild(label);
            infoItem.appendChild(valueDiv);

            // Append to container
            dataContainer.appendChild(infoItem);
        }
    });

    // If no data was found, show a message
    if (dataContainer.children.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'No application data found. Please submit the form again.';
        noData.style.textAlign = 'center';
        noData.style.color = '#666';
        dataContainer.appendChild(noData);
    }
});
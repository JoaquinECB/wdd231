// Setup modal functionality
export function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Setup contact form functionality
export function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        region: formData.get('region'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Save form data to localStorage
    const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    submissions.push(data);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    // Log success (in production, this would send to a server)
    console.log('Form submitted successfully:', data);

    // Store data for the form response page
    sessionStorage.setItem('formData', JSON.stringify(data));

    // Redirect to form response page
    setTimeout(() => {
        window.location.href = 'form-response.html';
    }, 500);
}
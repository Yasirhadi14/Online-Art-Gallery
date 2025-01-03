document.addEventListener('DOMContentLoaded', function() {
    const artworks = document.querySelectorAll('.artwork');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    let interval;

    // Create navigation dots
    artworks.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => navigateToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Navigation function
    function navigateToSlide(index) {
        // Remove active class from current artwork and dot
        artworks[currentIndex].classList.remove('active');
        dotsContainer.children[currentIndex].classList.remove('active');
        
        // Update current index
        currentIndex = index;
        
        // Add active class to new artwork and dot
        artworks[currentIndex].classList.add('active');
        dotsContainer.children[currentIndex].classList.add('active');
    }

    // Auto-rotation function
    function startAutoRotation() {
        interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % artworks.length;
            navigateToSlide(nextIndex);
        }, 5000); // Change slide every 5 seconds
    }

    // Start auto-rotation
    startAutoRotation();

    // Pause auto-rotation when hovering over the gallery
    const galleryContainer = document.querySelector('.featured-artwork');
    galleryContainer.addEventListener('mouseenter', () => clearInterval(interval));
    galleryContainer.addEventListener('mouseleave', startAutoRotation);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// For About section
// Get form element
const contactForm = document.querySelector('.contact-form');

// Create an array to store contact submissions
let contactSubmissions = [];

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate form data
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!formData.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.message.trim()) {
        errors.push('Message is required');
    }
    
    return errors;
}

// Function to show error messages
function showErrors(errors) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create and show new error messages
    errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger mb-2';
        errorDiv.textContent = error;
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
    });
}

// Function to save contact submission
function saveContactSubmission(formData) {
    // Add timestamp to the submission
    const submission = {
        ...formData,
        timestamp: new Date().toISOString()
    };
    
    // Add to array
    contactSubmissions.push(submission);
    
    // Save to localStorage
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
    
    return submission;
}

// Function to clear form
function clearForm() {
    contactForm.reset();
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

// Load existing submissions from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedSubmissions = localStorage.getItem('contactSubmissions');
    if (savedSubmissions) {
        contactSubmissions = JSON.parse(savedSubmissions);
    }
});

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: contactForm.querySelector('input[type="text"]').value,
        email: contactForm.querySelector('input[type="email"]').value,
        message: contactForm.querySelector('textarea').value
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Save submission
    const submission = saveContactSubmission(formData);
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Clear form
    clearForm();
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
});

// Initialize favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to toggle favorite status
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// Function to update favorite buttons state
function updateFavoriteButtons() {
    document.querySelectorAll('.collection-item').forEach(item => {
        const id = item.dataset.id;
        const btn = item.querySelector('.favorite-btn');
        if (favorites.includes(id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Function to filter collections
function filterCollections(category) {
    const items = document.querySelectorAll('.collection-item');
    items.forEach(item => {
        const parent = item.closest('.col-md-6');
        if (category === 'all') {
            parent.classList.remove('hidden');
        } else if (category === 'favorites') {
            if (favorites.includes(item.dataset.id)) {
                parent.classList.remove('hidden');
            } else {
                parent.classList.add('hidden');
            }
        } else {
            if (parent.dataset.category === category) {
                parent.classList.remove('hidden');
            } else {
                parent.classList.add('hidden');
            }
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.closest('.collection-item').dataset.id;
            toggleFavorite(id);
        });
    });

    // Add click handlers to filter buttons
    document.querySelectorAll('.collection-filters button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.collection-filters button').forEach(b => 
                b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            // Filter collections
            filterCollections(e.target.dataset.filter);
        });
    });

    // Initialize favorite buttons state
    updateFavoriteButtons();
});
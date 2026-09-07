// ===================================
// CONTACT FORM HANDLER WITH MODAL
// ===================================

// ===================================
// GOOGLE APPS SCRIPT CONFIGURATION
// ===================================
// STEP 1: Replace this URL with your Google Apps Script Web App URL
// After deploying your script, you'll get a URL like:
// https://script.google.com/macros/s/AKfycbz.../exec
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzv7BMSqKxNJO-hoqXuyUd5jHgosf0g_Dh-g5hD_wM45MBZnrHBk6cbGLmZ0x79VEJGCQ/exec';

// Get form elements
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const sendButton = document.getElementById('sendButton');
const thankYouModal = document.getElementById('thankYouModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.querySelector('.modal-overlay');

// Handle send button click
if (sendButton) {
    sendButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            consent: document.getElementById('consent').checked
        };
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Submit to Google Sheets
        submitToGoogleSheets(formData);
    });
}

// Close modal handlers
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && thankYouModal.classList.contains('show')) {
        closeModal();
    }
});

// Form validation
function validateForm(data) {
    // Check if all fields are filled
    if (!data.fullName || !data.email || !data.phone || !data.message) {
        showMessage('Please fill in all fields.', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number (basic check)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return false;
    }
    
    // ===================================
    // CONSENT CHECKBOX VALIDATION
    // ===================================
    if (!data.consent) {
        // Scroll to checkbox
        const consentCheckbox = document.getElementById('consent');
        consentCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add red border to checkbox label
        const checkboxContainer = document.querySelector('.form-checkbox');
        checkboxContainer.style.border = '2px solid #e74c3c';
        checkboxContainer.style.padding = '10px';
        checkboxContainer.style.borderRadius = '5px';
        checkboxContainer.style.backgroundColor = '#ffe6e6';
        
        // Show error message
        showMessage('⚠️ Please accept the consent checkbox: "Accept the above information will be used to contact you"', 'error');
        
        // Remove red border after 3 seconds
        setTimeout(() => {
            checkboxContainer.style.border = '';
            checkboxContainer.style.padding = '';
            checkboxContainer.style.borderRadius = '';
            checkboxContainer.style.backgroundColor = '';
        }, 3000);
        
        return false;
    }
    
    return true;
}

// Submit form to Google Sheets
function submitToGoogleSheets(data) {
    // Show loading state
    const originalBtnText = sendButton.textContent;
    sendButton.textContent = 'SENDING...';
    sendButton.style.pointerEvents = 'none';
    sendButton.style.opacity = '0.7';
    
    // Prepare data for Google Sheets
    const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        message: data.message
    };
    
    // Submit to Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        // Success - Show modal
        console.log('✅ Form submitted successfully');
        contactForm.reset();
        showThankYouModal();
        
        // Track conversion
        trackConversion();
    })
    .catch((error) => {
        // Error
        console.error('❌ Form submission error:', error);
        showMessage('Something went wrong. Please try again or email us directly at hello@strydecoaching.com', 'error');
    })
    .finally(() => {
        // Reset button state
        sendButton.textContent = originalBtnText;
        sendButton.style.pointerEvents = 'auto';
        sendButton.style.opacity = '1';
    });
}

// Show thank you modal
function showThankYouModal() {
    thankYouModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Initialize modal animations
    createConfetti();
    
    // Track conversion
    trackConversion();
}

// Close modal
function closeModal() {
    thankYouModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    
    // Clear confetti
    const confettiContainer = document.getElementById('confetti');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }
}

// Show message to user
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
    }, 5000);
}

// ===================================
// CONFETTI ANIMATION (from thank-you.js)
// ===================================
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    const colors = ['#CBB484', '#1B201C', '#FFF4DC', '#10b981', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            
            // Random properties
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 100);
    }
}

// ===================================
// CONVERSION TRACKING (Optional)
// ===================================
function trackConversion() {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // Replace with your conversion ID
            'transaction_id': ''
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    // Custom tracking
    console.log('📊 Conversion tracked: Form submission successful');
}


// Alternative: EmailJS Integration (if preferred over Google Forms)
// Uncomment and configure if you want to use EmailJS instead

/*
// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

function submitWithEmailJS(data) {
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: data.fullName,
        from_email: data.email,
        phone: data.phone,
        message: data.message
    })
    .then(() => {
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        showMessage('Something went wrong. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
}
*/

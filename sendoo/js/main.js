// Enhanced JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Prevent scrolling when menu is open
            document.body.classList.toggle('no-scroll');
        });
    }

    // User dropdown menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();

            // Create dropdown if it doesn't exist
            if (!document.querySelector('.user-dropdown')) {
                const dropdown = document.createElement('div');
                dropdown.classList.add('user-dropdown');

                dropdown.innerHTML = `
                    <ul>
                        <li><a href="profile.html"><i class="fas fa-user"></i> My Profile</a></li>
                        <li><a href="history.html"><i class="fas fa-history"></i> Delivery History</a></li>
                        <li><a href="settings.html"><i class="fas fa-cog"></i> Settings</a></li>
                        <li class="divider"></li>
                        <li><a href="#" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                `;

                document.body.appendChild(dropdown);

                // Position dropdown
                const rect = userMenu.getBoundingClientRect();
                dropdown.style.top = rect.bottom + 'px';
                dropdown.style.right = (window.innerWidth - rect.right) + 'px';
            }

            // Toggle dropdown visibility
            const dropdown = document.querySelector('.user-dropdown');
            dropdown.classList.toggle('active');

            // Add logout functionality
            const logoutLink = dropdown.querySelector('.logout');
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Show confirmation dialog
                    if (confirm('Are you sure you want to logout?')) {
                        // Redirect to index page
                        window.location.href = 'index.html';
                    }
                });
            }

            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(event) {
                if (!userMenu.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.classList.remove('active');
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    }

    // Password toggle visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Add animation to elements
    const animateElements = document.querySelectorAll('.hero-content, .hero-image, .step, .vehicle-card, .cta, .footer-section');
    animateElements.forEach((element, index) => {
        // Add animation with staggered delay
        setTimeout(() => {
            element.classList.add('animate');
        }, 100 * index);
    });

    // Animate elements when scrolling into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .vehicle-card, .cta, .auth-card, .delivery-form-container');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');

                // Simple validation on blur
                if (this.hasAttribute('required') && this.value.trim() === '') {
                    this.parentElement.classList.add('error');
                    const errorElement = this.parentElement.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
                    }
                } else {
                    this.parentElement.classList.remove('error');
                    const errorElement = this.parentElement.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.innerHTML = '';
                    }
                }
            });
        });
    });

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Helper function to validate form fields
function validateField(field, errorId, regex, message) {
    const errorElement = document.getElementById(errorId);

    if (field.value.trim() === '') {
        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
        field.parentElement.classList.add('error');
        return false;
    } else if (regex && !regex.test(field.value)) {
        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
        field.parentElement.classList.add('error');
        return false;
    } else {
        errorElement.innerHTML = '';
        field.parentElement.classList.remove('error');
        return true;
    }
}

// Add CSS for enhanced UI elements
const styleElement = document.createElement('style');
styleElement.textContent = `
    /* Mobile Navigation */
    @media (max-width: 992px) {
        .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xl);
            transition: all 0.5s ease;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
            z-index: 100;
            padding: var(--spacing-xxl) 0;
        }

        .nav-links.active {
            right: 0;
        }

        .nav-links a {
            font-size: 1.2rem;
            padding: var(--spacing-md) var(--spacing-xl);
            width: 80%;
            text-align: center;
        }
    }

    /* User Dropdown */
    .user-dropdown {
        display: none;
        position: absolute;
        min-width: 220px;
        background-color: var(--white);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 100;
        border: 1px solid var(--gray-200);
        overflow: hidden;
        animation: fadeInDown 0.3s ease-out;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .user-dropdown.active {
        display: block;
    }

    .user-dropdown ul {
        padding: var(--spacing-sm) 0;
    }

    .user-dropdown ul li a {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        color: var(--gray-700);
        transition: all var(--transition-normal);
    }

    .user-dropdown ul li a:hover {
        background-color: var(--gray-100);
        color: var(--primary-color);
        padding-left: calc(var(--spacing-lg) + 5px);
    }

    .user-dropdown ul li.divider {
        height: 1px;
        background-color: var(--gray-200);
        margin: var(--spacing-sm) 0;
    }

    .user-dropdown ul li a.logout {
        color: var(--danger-color);
    }

    .user-dropdown ul li a.logout:hover {
        background-color: rgba(239, 68, 68, 0.1);
    }

    /* Form Enhancements */
    .input-icon.focused {
        position: relative;
    }

    .input-icon.focused::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--gradient-primary);
        animation: formFocus 0.3s ease-out forwards;
    }

    @keyframes formFocus {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(1);
        }
    }

    .input-icon.error input,
    .input-icon.error select,
    .input-icon.error textarea {
        border-color: var(--danger-color);
        background-color: rgba(239, 68, 68, 0.05);
    }

    .input-icon.error i {
        color: var(--danger-color);
    }

    /* Animation classes */
    .hero-content, .hero-image, .step, .vehicle-card, .cta, .footer-section, .auth-card, .delivery-form-container {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .hero-content.animate, .hero-image.animate, .step.animate, .vehicle-card.animate,
    .cta.animate, .footer-section.animate, .auth-card.animate, .delivery-form-container.animate {
        opacity: 1;
        transform: translateY(0);
    }

    /* No scroll for mobile menu */
    .no-scroll {
        overflow: hidden;
    }

    /* Preloader */
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .preloader.fade-out {
        opacity: 0;
        visibility: hidden;
    }

    .preloader-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(79, 70, 229, 0.2);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

document.head.appendChild(styleElement);

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const dots = document.querySelectorAll('.testimonial-dots .dot');

    if (testimonialSlider && dots.length > 0) {
        // Set up click events for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Update active dot
                document.querySelector('.dot.active').classList.remove('active');
                dot.classList.add('active');

                // Slide to the corresponding testimonial
                const cards = testimonialSlider.querySelectorAll('.testimonial-card');
                const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);

                // For mobile view, we stack vertically so no sliding needed
                if (window.innerWidth > 992) {
                    testimonialSlider.style.transform = `translateX(-${index * cardWidth}px)`;
                } else {
                    // Scroll to the card in mobile view
                    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        // Auto-rotate testimonials every 5 seconds
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % dots.length;
            dots[currentIndex].click();
        }, 5000);
    }
}

// Add preloader
const preloader = document.createElement('div');
preloader.classList.add('preloader');
preloader.innerHTML = '<div class="preloader-spinner"></div>';
document.body.appendChild(preloader);

// Hide preloader when page is loaded or after a maximum timeout
const maxPreloaderTime = 3000; // 3 seconds maximum wait time
let preloaderRemoved = false;

// Function to remove preloader
function removePreloader() {
    if (!preloaderRemoved) {
        preloaderRemoved = true;
        preloader.classList.add('fade-out');
        setTimeout(function() {
            if (preloader.parentNode) {
                preloader.remove();
            }
            // Initialize testimonial slider after preloader is gone
            initTestimonialSlider();
        }, 300);
    }
}

// Remove preloader when page is loaded
window.addEventListener('load', function() {
    setTimeout(removePreloader, 300);
});

// Set a maximum time to wait for loading
setTimeout(removePreloader, maxPreloaderTime);
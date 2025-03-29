// Main JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-menu')) {
                const mobileMenu = document.createElement('div');
                mobileMenu.classList.add('mobile-menu');
                
                // Clone nav links and auth buttons for mobile menu
                const navLinksClone = navLinks.cloneNode(true);
                const authButtonsClone = authButtons.cloneNode(true);
                
                mobileMenu.appendChild(navLinksClone);
                mobileMenu.appendChild(authButtonsClone);
                
                document.body.appendChild(mobileMenu);
            }
            
            // Toggle mobile menu display
            const mobileMenu = document.querySelector('.mobile-menu');
            mobileMenu.classList.toggle('active');
            
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
                        <li><a href="index.html" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
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
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(event) {
                if (!userMenu.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.classList.remove('active');
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    }
    
    // Add animation to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 300);
    }
    
    // Animate elements when scrolling into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .vehicle-card, .cta');
        
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
});

// Helper function to validate form fields
function validateField(field, errorId, regex, message) {
    const errorElement = document.getElementById(errorId);
    
    if (field.value.trim() === '') {
        errorElement.textContent = 'This field is required';
        field.classList.add('error');
        return false;
    } else if (regex && !regex.test(field.value)) {
        errorElement.textContent = message;
        field.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        field.classList.remove('error');
        return true;
    }
}

// Add CSS for mobile menu
const styleElement = document.createElement('style');
styleElement.textContent = `
    .mobile-menu {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: var(--white);
        z-index: 1000;
        padding: var(--spacing-xxl);
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
    }
    
    .mobile-menu.active {
        display: flex;
    }
    
    .mobile-menu .nav-links,
    .mobile-menu .auth-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: var(--spacing-xxl);
        gap: var(--spacing-lg);
        width: 100%;
    }
    
    .mobile-menu .nav-links a,
    .mobile-menu .auth-buttons a {
        font-size: 1.25rem;
        padding: var(--spacing-md) 0;
        width: 100%;
        text-align: center;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    .user-dropdown {
        display: none;
        position: absolute;
        min-width: 200px;
        background-color: var(--white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 100;
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
        transition: all 0.3s ease;
    }
    
    .user-dropdown ul li a:hover {
        background-color: var(--gray-100);
        color: var(--primary-color);
    }
    
    .user-dropdown ul li.divider {
        height: 1px;
        background-color: var(--gray-200);
        margin: var(--spacing-sm) 0;
    }
    
    .user-dropdown ul li a.logout {
        color: var(--danger-color);
    }
    
    /* Animation classes */
    .hero, .step, .vehicle-card, .cta {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .hero.animate, .step.animate, .vehicle-card.animate, .cta.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(styleElement);
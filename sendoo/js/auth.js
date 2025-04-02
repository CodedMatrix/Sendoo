// Authentication JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle functionality
    initPasswordToggle();

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form fields
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const rememberMe = document.getElementById('rememberMe');

            // Validate email
            const emailValid = validateField(
                email,
                email.parentElement.nextElementSibling,
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please enter a valid email address'
            );

            // Validate password
            const passwordValid = validateField(
                password,
                password.parentElement.nextElementSibling,
                null,
                null
            );

            // If all fields are valid, proceed with login
            if (emailValid && passwordValid) {
                // Show loading state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loader"></div> Logging in...';
                submitButton.disabled = true;

                // Simulate API call with timeout
                setTimeout(function() {
                    // For demo purposes, we'll just redirect to index-logged-in
                    // In a real app, you would make an API call to verify credentials
                    window.location.href = 'index-logged-in.html';

                    // Reset button state (in case the redirect fails)
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }

    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form fields
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const agreeTerms = document.getElementById('agreeTerms');

            // Validate full name
            const nameValid = validateField(
                fullName,
                fullName.parentElement.nextElementSibling,
                null,
                null
            );

            // Validate email
            const emailValid = validateField(
                email,
                email.parentElement.nextElementSibling,
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please enter a valid email address'
            );

            // Validate password
            const passwordValid = validateField(
                password,
                password.parentElement.nextElementSibling,
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                'Password must be at least 8 characters with letters and numbers'
            );

            // Validate confirm password
            let confirmPasswordValid = false;
            if (confirmPassword.value.trim() === '') {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
                confirmPassword.parentElement.classList.add('error');
            } else if (confirmPassword.value !== password.value) {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match';
                confirmPassword.parentElement.classList.add('error');
            } else {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '';
                confirmPassword.parentElement.classList.remove('error');
                confirmPasswordValid = true;
            }

            // Validate terms agreement
            let termsValid = true;
            if (agreeTerms && !agreeTerms.checked) {
                const errorElement = agreeTerms.parentElement.nextElementSibling;
                if (errorElement) {
                    errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> You must agree to the terms';
                }
                termsValid = false;
            } else if (agreeTerms) {
                const errorElement = agreeTerms.parentElement.nextElementSibling;
                if (errorElement) {
                    errorElement.innerHTML = '';
                }
            }

            // If all fields are valid, proceed with registration
            if (nameValid && emailValid && passwordValid && confirmPasswordValid && termsValid) {
                // Show loading state
                const submitButton = registerForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loader"></div> Creating account...';
                submitButton.disabled = true;

                // Simulate API call with timeout
                setTimeout(function() {
                    // For demo purposes, we'll just redirect to index-logged-in
                    // In a real app, you would make an API call to register the user
                    window.location.href = 'index-logged-in.html';

                    // Reset button state (in case the redirect fails)
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }

    // Password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        // Create strength meter if it doesn't exist
        if (!document.querySelector('.password-strength')) {
            const strengthMeter = document.createElement('div');
            strengthMeter.classList.add('password-strength');
            strengthMeter.innerHTML = `
                <div class="strength-meter">
                    <div class="strength-meter-fill"></div>
                </div>
                <div class="strength-text"></div>
            `;

            // Insert after password field
            passwordInput.parentElement.insertAdjacentElement('afterend', strengthMeter);
        }

        // Update strength meter on input
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthMeterFill = document.querySelector('.strength-meter-fill');
            const strengthText = document.querySelector('.strength-text');

            // Calculate password strength
            let strength = 0;

            // Length check
            if (password.length >= 8) strength += 25;

            // Character variety checks
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;

            // Update UI
            strengthMeterFill.style.width = strength + '%';

            // Set color based on strength
            if (strength <= 25) {
                strengthMeterFill.style.backgroundColor = 'var(--danger-color)';
                strengthText.textContent = 'Weak';
                strengthText.style.color = 'var(--danger-color)';
            } else if (strength <= 50) {
                strengthMeterFill.style.backgroundColor = 'var(--warning-color)';
                strengthText.textContent = 'Fair';
                strengthText.style.color = 'var(--warning-color)';
            } else if (strength <= 75) {
                strengthMeterFill.style.backgroundColor = 'var(--primary-color)';
                strengthText.textContent = 'Good';
                strengthText.style.color = 'var(--primary-color)';
            } else {
                strengthMeterFill.style.backgroundColor = 'var(--success-color)';
                strengthText.textContent = 'Strong';
                strengthText.style.color = 'var(--success-color)';
            }
        });
    }
});

// Add CSS for auth components
const authStyleElement = document.createElement('style');
authStyleElement.textContent = `
    /* Password strength meter */
    .password-strength {
        margin-top: 5px;
        margin-bottom: 15px;
    }

    .strength-meter {
        height: 4px;
        background-color: var(--gray-200);
        border-radius: var(--radius-full);
        overflow: hidden;
        margin-bottom: 5px;
    }

    .strength-meter-fill {
        height: 100%;
        width: 0;
        background-color: var(--danger-color);
        border-radius: var(--radius-full);
        transition: width 0.3s ease, background-color 0.3s ease;
    }

    .strength-text {
        font-size: 0.8rem;
        text-align: right;
        font-weight: 600;
    }

    /* Loader for buttons */
    button .loader {
        width: 20px;
        height: 20px;
        border-width: 2px;
        margin-right: 10px;
        border-color: rgba(255, 255, 255, 0.3);
        border-top-color: var(--white);
    }
`;

document.head.appendChild(authStyleElement);

// Function to initialize password toggle functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the password input field (sibling of this button)
            const passwordInput = this.previousElementSibling.previousElementSibling;

            // Toggle between password and text type
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
}

// Helper function to validate form fields
function validateField(field, errorElement, pattern, errorMessage) {
    if (field.value.trim() === '') {
        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
        field.parentElement.classList.add('error');
        return false;
    } else if (pattern && !pattern.test(field.value)) {
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
        field.parentElement.classList.add('error');
        return false;
    } else {
        errorElement.innerHTML = '';
        field.parentElement.classList.remove('error');
        return true;
    }
} 

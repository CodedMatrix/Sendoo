// Settings JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Password form handling
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const currentPassword = document.getElementById('currentPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            
            // Validate current password
            const currentPasswordValid = validateField(
                currentPassword,
                currentPassword.parentElement.nextElementSibling,
                null,
                null
            );
            
            // Validate new password
            const newPasswordValid = validateField(
                newPassword,
                newPassword.parentElement.nextElementSibling,
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                'Password must be at least 8 characters with letters and numbers'
            );
            
            // Validate confirm password
            let confirmPasswordValid = false;
            if (confirmPassword.value.trim() === '') {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
                confirmPassword.parentElement.classList.add('error');
            } else if (confirmPassword.value !== newPassword.value) {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match';
                confirmPassword.parentElement.classList.add('error');
            } else {
                confirmPassword.parentElement.nextElementSibling.innerHTML = '';
                confirmPassword.parentElement.classList.remove('error');
                confirmPasswordValid = true;
            }
            
            // If all fields are valid, proceed with password update
            if (currentPasswordValid && newPasswordValid && confirmPasswordValid) {
                // Show loading state
                const submitButton = passwordForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loader"></div> Updating...';
                submitButton.disabled = true;
                
                // Simulate API call with timeout
                setTimeout(function() {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('alert', 'alert-success');
                    successMessage.innerHTML = `
                        <div class="alert-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="alert-content">
                            <h4>Success!</h4>
                            <p>Your password has been updated successfully.</p>
                        </div>
                    `;
                    
                    // Insert success message before form
                    passwordForm.parentElement.insertBefore(successMessage, passwordForm);
                    
                    // Reset form
                    passwordForm.reset();
                    
                    // Remove success message after 3 seconds
                    setTimeout(function() {
                        successMessage.remove();
                    }, 3000);
                    
                    // Reset button state
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
    
    // Notification preferences form handling
    const notificationForm = document.getElementById('notificationForm');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = notificationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<div class="loader"></div> Saving...';
            submitButton.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(function() {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success');
                successMessage.innerHTML = `
                    <div class="alert-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="alert-content">
                        <h4>Success!</h4>
                        <p>Your notification preferences have been updated successfully.</p>
                    </div>
                `;
                
                // Insert success message before form
                notificationForm.parentElement.insertBefore(successMessage, notificationForm);
                
                // Remove success message after 3 seconds
                setTimeout(function() {
                    successMessage.remove();
                }, 3000);
                
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Add payment method button
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            alert('This feature is coming soon!');
        });
    }
    
    // Deactivate account button
    const deactivateBtn = document.querySelector('.btn-warning');
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.')) {
                alert('Your account has been deactivated. You will be logged out now.');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Delete account button
    const deleteBtn = document.querySelector('.btn-danger');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('WARNING: This action cannot be undone. Are you absolutely sure you want to permanently delete your account and all associated data?')) {
                alert('Your account has been deleted. You will be redirected to the homepage.');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to logout?')) {
                // Redirect to index page
                window.location.href = 'index.html';
            }
        });
    });
});

// Helper function to validate form fields
function validateField(field, errorElement, regex, message) {
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
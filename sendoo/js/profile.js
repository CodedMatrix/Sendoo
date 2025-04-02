// Profile JavaScript for Sendoo

document.addEventListener('DOMContentLoaded', function() {
    // Edit profile functionality
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const cancelEditBtn = document.querySelector('.cancel-edit-btn');
    const profileForm = document.getElementById('profileForm');
    const profileFormActions = profileForm.querySelector('.form-actions');
    const profileInputs = profileForm.querySelectorAll('input');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Enable form fields
            profileInputs.forEach(input => {
                input.disabled = false;
            });
            
            // Show form actions
            profileFormActions.style.display = 'flex';
            
            // Hide edit button
            editProfileBtn.style.display = 'none';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Disable form fields
            profileInputs.forEach(input => {
                input.disabled = true;
            });
            
            // Hide form actions
            profileFormActions.style.display = 'none';
            
            // Show edit button
            editProfileBtn.style.display = 'inline-flex';
            
            // Reset form to original values
            profileForm.reset();
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            profileInputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    isValid = false;
                    input.parentElement.classList.add('error');
                    const errorElement = input.parentElement.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
                    }
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitButton = profileForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loader"></div> Saving...';
                submitButton.disabled = true;
                
                // Simulate API call with timeout
                setTimeout(function() {
                    // Disable form fields
                    profileInputs.forEach(input => {
                        input.disabled = true;
                    });
                    
                    // Hide form actions
                    profileFormActions.style.display = 'none';
                    
                    // Show edit button
                    editProfileBtn.style.display = 'inline-flex';
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('alert', 'alert-success');
                    successMessage.innerHTML = `
                        <div class="alert-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="alert-content">
                            <h4>Success!</h4>
                            <p>Your profile has been updated successfully.</p>
                        </div>
                    `;
                    
                    // Insert success message before form
                    profileForm.parentElement.insertBefore(successMessage, profileForm);
                    
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

    // Edit address functionality
    const editAddressBtn = document.querySelector('.edit-address-btn');
    const cancelAddressBtn = document.querySelector('.cancel-address-btn');
    const addressForm = document.getElementById('addressForm');
    const addressFormActions = addressForm.querySelector('.form-actions');
    const addressInputs = addressForm.querySelectorAll('input');

    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', function() {
            // Enable form fields
            addressInputs.forEach(input => {
                input.disabled = false;
            });
            
            // Show form actions
            addressFormActions.style.display = 'flex';
            
            // Hide edit button
            editAddressBtn.style.display = 'none';
        });
    }

    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
            // Disable form fields
            addressInputs.forEach(input => {
                input.disabled = true;
            });
            
            // Hide form actions
            addressFormActions.style.display = 'none';
            
            // Show edit button
            editAddressBtn.style.display = 'inline-flex';
            
            // Reset form to original values
            addressForm.reset();
        });
    }

    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            addressInputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    isValid = false;
                    input.parentElement.classList.add('error');
                    const errorElement = input.parentElement.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> This field is required';
                    }
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitButton = addressForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<div class="loader"></div> Saving...';
                submitButton.disabled = true;
                
                // Simulate API call with timeout
                setTimeout(function() {
                    // Disable form fields
                    addressInputs.forEach(input => {
                        input.disabled = true;
                    });
                    
                    // Hide form actions
                    addressFormActions.style.display = 'none';
                    
                    // Show edit button
                    editAddressBtn.style.display = 'inline-flex';
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('alert', 'alert-success');
                    successMessage.innerHTML = `
                        <div class="alert-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="alert-content">
                            <h4>Success!</h4>
                            <p>Your address has been updated successfully.</p>
                        </div>
                    `;
                    
                    // Insert success message before form
                    addressForm.parentElement.insertBefore(successMessage, addressForm);
                    
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
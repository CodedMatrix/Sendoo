// Form validation utilities for Sendoo

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
const isValidPhone = (phone) => {
  // Allow various formats with optional country code
  const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with strength and feedback
 */
const validatePassword = (password) => {
  // Check password strength
  let strength = 0;
  let feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    strength += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add at least one uppercase letter');
  } else {
    strength += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add at least one lowercase letter');
  } else {
    strength += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push('Add at least one number');
  } else {
    strength += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Add at least one special character');
  } else {
    strength += 1;
  }
  
  // Determine strength label
  let strengthLabel = '';
  let strengthColor = '';
  let strengthPercentage = (strength / 5) * 100;
  
  if (strength < 2) {
    strengthLabel = 'Weak';
    strengthColor = '#dc3545'; // danger
  } else if (strength < 4) {
    strengthLabel = 'Moderate';
    strengthColor = '#ffc107'; // warning
  } else {
    strengthLabel = 'Strong';
    strengthColor = '#28a745'; // success
  }
  
  return {
    isValid: strength >= 3,
    strength,
    strengthLabel,
    strengthColor,
    strengthPercentage,
    feedback
  };
};

/**
 * Validates a name (first name or last name)
 * @param {string} name - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
const isValidName = (name) => {
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return name.length >= 2 && nameRegex.test(name);
};

/**
 * Validates a zip/postal code
 * @param {string} zipCode - The zip code to validate
 * @param {string} country - The country (optional)
 * @returns {boolean} - Whether the zip code is valid
 */
const isValidZipCode = (zipCode, country = 'US') => {
  // Different formats for different countries
  const zipRegexes = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    // Add more countries as needed
    DEFAULT: /^[A-Za-z0-9\s-]{3,10}$/
  };
  
  const regex = zipRegexes[country] || zipRegexes.DEFAULT;
  return regex.test(zipCode);
};

/**
 * Validates a tracking number
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {boolean} - Whether the tracking number is valid
 */
const isValidTrackingNumber = (trackingNumber) => {
  // Sendoo tracking number format: SD-XXXXXX-XXXX
  const trackingRegex = /^SD-\d{6}-\d{4}$/;
  return trackingRegex.test(trackingNumber);
};

/**
 * Validates a weight value
 * @param {number|string} weight - The weight to validate
 * @returns {boolean} - Whether the weight is valid
 */
const isValidWeight = (weight) => {
  const weightNum = parseFloat(weight);
  return !isNaN(weightNum) && weightNum > 0 && weightNum <= 1000;
};

/**
 * Validates dimensions (length, width, height)
 * @param {number|string} value - The dimension value to validate
 * @returns {boolean} - Whether the dimension is valid
 */
const isValidDimension = (value) => {
  const dimensionNum = parseFloat(value);
  return !isNaN(dimensionNum) && dimensionNum > 0 && dimensionNum <= 300;
};

/**
 * Validates a form field and shows validation feedback
 * @param {HTMLElement} inputElement - The input element to validate
 * @param {Function} validationFn - The validation function to use
 * @param {string} errorMessage - The error message to show if validation fails
 * @returns {boolean} - Whether the field is valid
 */
const validateField = (inputElement, validationFn, errorMessage) => {
  const value = inputElement.value.trim();
  const isValid = validationFn(value);
  
  // Get the form group element
  const formGroup = inputElement.closest('.form-group');
  
  // Remove any existing error message
  const existingError = formGroup.querySelector('.validation-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add or remove validation classes
  if (isValid) {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
  } else {
    inputElement.classList.remove('is-valid');
    inputElement.classList.add('is-invalid');
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = errorMessage;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    formGroup.appendChild(errorElement);
  }
  
  return isValid;
};

/**
 * Validates a password field and shows strength meter
 * @param {HTMLElement} passwordInput - The password input element
 * @param {HTMLElement} strengthMeter - The strength meter element (optional)
 * @param {HTMLElement} strengthText - The strength text element (optional)
 * @returns {boolean} - Whether the password is valid
 */
const validatePasswordField = (passwordInput, strengthMeter = null, strengthText = null) => {
  const password = passwordInput.value;
  const result = validatePassword(password);
  
  // Get the form group element
  const formGroup = passwordInput.closest('.form-group');
  
  // Remove any existing error message
  const existingError = formGroup.querySelector('.validation-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add or remove validation classes
  if (result.isValid) {
    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
  } else {
    passwordInput.classList.remove('is-valid');
    passwordInput.classList.add('is-invalid');
    
    // Add error message with the first feedback item
    if (result.feedback.length > 0) {
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      errorElement.textContent = result.feedback[0];
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      formGroup.appendChild(errorElement);
    }
  }
  
  // Update strength meter if provided
  if (strengthMeter) {
    const strengthBar = strengthMeter.querySelector('.strength-bar');
    if (strengthBar) {
      strengthBar.style.width = `${result.strengthPercentage}%`;
      strengthBar.style.backgroundColor = result.strengthColor;
    }
  }
  
  // Update strength text if provided
  if (strengthText) {
    strengthText.textContent = `Password strength: ${result.strengthLabel}`;
    strengthText.style.color = result.strengthColor;
  }
  
  return result.isValid;
};

/**
 * Validates a confirm password field
 * @param {HTMLElement} passwordInput - The password input element
 * @param {HTMLElement} confirmInput - The confirm password input element
 * @returns {boolean} - Whether the passwords match
 */
const validateConfirmPassword = (passwordInput, confirmInput) => {
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const isValid = password === confirmPassword && password.length > 0;
  
  // Get the form group element
  const formGroup = confirmInput.closest('.form-group');
  
  // Remove any existing error message
  const existingError = formGroup.querySelector('.validation-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add or remove validation classes
  if (isValid) {
    confirmInput.classList.remove('is-invalid');
    confirmInput.classList.add('is-valid');
  } else {
    confirmInput.classList.remove('is-valid');
    confirmInput.classList.add('is-invalid');
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = 'Passwords do not match';
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    formGroup.appendChild(errorElement);
  }
  
  return isValid;
};

/**
 * Sets up validation for a registration form
 * @param {HTMLFormElement} form - The registration form element
 */
const setupRegistrationFormValidation = (form) => {
  const firstNameInput = form.querySelector('#firstName');
  const lastNameInput = form.querySelector('#lastName');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const passwordInput = form.querySelector('#password');
  const confirmPasswordInput = form.querySelector('#confirmPassword');
  const strengthMeter = form.querySelector('.strength-meter');
  const strengthBar = form.querySelector('.strength-bar');
  const strengthText = form.querySelector('.strength-text');
  
  // Validate first name
  if (firstNameInput) {
    firstNameInput.addEventListener('blur', () => {
      validateField(
        firstNameInput,
        isValidName,
        'Please enter a valid first name (at least 2 characters, letters only)'
      );
    });
  }
  
  // Validate last name
  if (lastNameInput) {
    lastNameInput.addEventListener('blur', () => {
      validateField(
        lastNameInput,
        isValidName,
        'Please enter a valid last name (at least 2 characters, letters only)'
      );
    });
  }
  
  // Validate email
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(
        emailInput,
        isValidEmail,
        'Please enter a valid email address'
      );
    });
  }
  
  // Validate phone
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      validateField(
        phoneInput,
        isValidPhone,
        'Please enter a valid phone number'
      );
    });
  }
  
  // Validate password
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      validatePasswordField(passwordInput, strengthMeter, strengthText);
    });
    
    passwordInput.addEventListener('blur', () => {
      validatePasswordField(passwordInput, strengthMeter, strengthText);
      
      // Also validate confirm password if it has a value
      if (confirmPasswordInput && confirmPasswordInput.value) {
        validateConfirmPassword(passwordInput, confirmPasswordInput);
      }
    });
  }
  
  // Validate confirm password
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', () => {
      validateConfirmPassword(passwordInput, confirmPasswordInput);
    });
  }
  
  // Validate form on submit
  form.addEventListener('submit', (e) => {
    let isValid = true;
    
    // Validate all fields
    if (firstNameInput) {
      isValid = validateField(
        firstNameInput,
        isValidName,
        'Please enter a valid first name (at least 2 characters, letters only)'
      ) && isValid;
    }
    
    if (lastNameInput) {
      isValid = validateField(
        lastNameInput,
        isValidName,
        'Please enter a valid last name (at least 2 characters, letters only)'
      ) && isValid;
    }
    
    if (emailInput) {
      isValid = validateField(
        emailInput,
        isValidEmail,
        'Please enter a valid email address'
      ) && isValid;
    }
    
    if (phoneInput) {
      isValid = validateField(
        phoneInput,
        isValidPhone,
        'Please enter a valid phone number'
      ) && isValid;
    }
    
    if (passwordInput) {
      isValid = validatePasswordField(passwordInput, strengthMeter, strengthText) && isValid;
    }
    
    if (confirmPasswordInput) {
      isValid = validateConfirmPassword(passwordInput, confirmPasswordInput) && isValid;
    }
    
    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault();
      
      // Scroll to the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });
};

/**
 * Sets up validation for a login form
 * @param {HTMLFormElement} form - The login form element
 */
const setupLoginFormValidation = (form) => {
  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');
  
  // Validate email
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(
        emailInput,
        isValidEmail,
        'Please enter a valid email address'
      );
    });
  }
  
  // Validate form on submit
  form.addEventListener('submit', (e) => {
    let isValid = true;
    
    // Validate email
    if (emailInput) {
      isValid = validateField(
        emailInput,
        isValidEmail,
        'Please enter a valid email address'
      ) && isValid;
    }
    
    // Validate password (just check if it's not empty)
    if (passwordInput) {
      isValid = validateField(
        passwordInput,
        (value) => value.length > 0,
        'Please enter your password'
      ) && isValid;
    }
    
    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault();
      
      // Scroll to the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });
};

/**
 * Sets up validation for a delivery form
 * @param {HTMLFormElement} form - The delivery form element
 */
const setupDeliveryFormValidation = (form) => {
  // Package details
  const packageTypeSelect = form.querySelector('#packageType');
  const weightInput = form.querySelector('#weight');
  const lengthInput = form.querySelector('#length');
  const widthInput = form.querySelector('#width');
  const heightInput = form.querySelector('#height');
  
  // Pickup address
  const pickupStreetInput = form.querySelector('#pickupStreet');
  const pickupCityInput = form.querySelector('#pickupCity');
  const pickupStateInput = form.querySelector('#pickupState');
  const pickupZipInput = form.querySelector('#pickupZip');
  const pickupCountryInput = form.querySelector('#pickupCountry');
  
  // Delivery address
  const deliveryStreetInput = form.querySelector('#deliveryStreet');
  const deliveryCityInput = form.querySelector('#deliveryCity');
  const deliveryStateInput = form.querySelector('#deliveryState');
  const deliveryZipInput = form.querySelector('#deliveryZip');
  const deliveryCountryInput = form.querySelector('#deliveryCountry');
  
  // Recipient details
  const recipientNameInput = form.querySelector('#recipientName');
  const recipientPhoneInput = form.querySelector('#recipientPhone');
  const recipientEmailInput = form.querySelector('#recipientEmail');
  
  // Validate weight
  if (weightInput) {
    weightInput.addEventListener('blur', () => {
      validateField(
        weightInput,
        isValidWeight,
        'Please enter a valid weight (between 0 and 1000)'
      );
    });
  }
  
  // Validate dimensions
  const dimensionInputs = [lengthInput, widthInput, heightInput];
  dimensionInputs.forEach(input => {
    if (input) {
      input.addEventListener('blur', () => {
        validateField(
          input,
          isValidDimension,
          'Please enter a valid dimension (between 0 and 300)'
        );
      });
    }
  });
  
  // Validate address fields
  const addressInputs = [
    pickupStreetInput, pickupCityInput, pickupStateInput, pickupZipInput,
    deliveryStreetInput, deliveryCityInput, deliveryStateInput, deliveryZipInput
  ];
  
  addressInputs.forEach(input => {
    if (input) {
      input.addEventListener('blur', () => {
        validateField(
          input,
          (value) => value.length > 0,
          'This field is required'
        );
      });
    }
  });
  
  // Validate zip codes
  if (pickupZipInput && pickupCountryInput) {
    pickupZipInput.addEventListener('blur', () => {
      validateField(
        pickupZipInput,
        (value) => isValidZipCode(value, pickupCountryInput.value),
        'Please enter a valid zip/postal code'
      );
    });
  }
  
  if (deliveryZipInput && deliveryCountryInput) {
    deliveryZipInput.addEventListener('blur', () => {
      validateField(
        deliveryZipInput,
        (value) => isValidZipCode(value, deliveryCountryInput.value),
        'Please enter a valid zip/postal code'
      );
    });
  }
  
  // Validate recipient name
  if (recipientNameInput) {
    recipientNameInput.addEventListener('blur', () => {
      validateField(
        recipientNameInput,
        (value) => value.length >= 2,
        'Please enter the recipient\'s name (at least 2 characters)'
      );
    });
  }
  
  // Validate recipient phone
  if (recipientPhoneInput) {
    recipientPhoneInput.addEventListener('blur', () => {
      validateField(
        recipientPhoneInput,
        isValidPhone,
        'Please enter a valid phone number'
      );
    });
  }
  
  // Validate recipient email (optional)
  if (recipientEmailInput) {
    recipientEmailInput.addEventListener('blur', () => {
      // Only validate if a value is entered
      if (recipientEmailInput.value.trim()) {
        validateField(
          recipientEmailInput,
          isValidEmail,
          'Please enter a valid email address'
        );
      } else {
        // Remove validation classes if empty
        recipientEmailInput.classList.remove('is-invalid', 'is-valid');
        
        // Remove any existing error message
        const formGroup = recipientEmailInput.closest('.form-group');
        const existingError = formGroup.querySelector('.validation-error');
        if (existingError) {
          existingError.remove();
        }
      }
    });
  }
  
  // Validate form on next button click
  const nextButtons = form.querySelectorAll('.btn-next');
  nextButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Get the current step
      const currentStep = button.closest('.form-step');
      const stepIndex = parseInt(currentStep.dataset.step);
      
      // Determine which fields to validate based on the current step
      let fieldsToValidate = [];
      
      if (stepIndex === 1) {
        // Package details step
        fieldsToValidate = [packageTypeSelect, weightInput];
        
        // Only validate dimensions if they're filled in
        if (lengthInput && lengthInput.value) fieldsToValidate.push(lengthInput);
        if (widthInput && widthInput.value) fieldsToValidate.push(widthInput);
        if (heightInput && heightInput.value) fieldsToValidate.push(heightInput);
      } else if (stepIndex === 2) {
        // Addresses step
        fieldsToValidate = [
          pickupStreetInput, pickupCityInput, pickupStateInput, pickupZipInput,
          deliveryStreetInput, deliveryCityInput, deliveryStateInput, deliveryZipInput
        ];
      } else if (stepIndex === 3) {
        // Recipient details step
        fieldsToValidate = [recipientNameInput, recipientPhoneInput];
        
        // Only validate email if it's filled in
        if (recipientEmailInput && recipientEmailInput.value) {
          fieldsToValidate.push(recipientEmailInput);
        }
      }
      
      // Validate all fields for this step
      let isValid = true;
      
      fieldsToValidate.forEach(input => {
        if (!input) return;
        
        let validationFn;
        let errorMessage;
        
        // Determine validation function and error message based on input
        if (input === weightInput) {
          validationFn = isValidWeight;
          errorMessage = 'Please enter a valid weight (between 0 and 1000)';
        } else if ([lengthInput, widthInput, heightInput].includes(input)) {
          validationFn = isValidDimension;
          errorMessage = 'Please enter a valid dimension (between 0 and 300)';
        } else if ([pickupZipInput, deliveryZipInput].includes(input)) {
          const countryInput = input === pickupZipInput ? pickupCountryInput : deliveryCountryInput;
          validationFn = (value) => isValidZipCode(value, countryInput.value);
          errorMessage = 'Please enter a valid zip/postal code';
        } else if (input === recipientPhoneInput) {
          validationFn = isValidPhone;
          errorMessage = 'Please enter a valid phone number';
        } else if (input === recipientEmailInput) {
          validationFn = isValidEmail;
          errorMessage = 'Please enter a valid email address';
        } else {
          validationFn = (value) => value.length > 0;
          errorMessage = 'This field is required';
        }
        
        // Validate the field
        isValid = validateField(input, validationFn, errorMessage) && isValid;
      });
      
      // Prevent going to next step if validation fails
      if (!isValid) {
        e.preventDefault();
        
        // Scroll to the first invalid field
        const firstInvalid = currentStep.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      }
    });
  });
};

/**
 * Sets up validation for a tracking form
 * @param {HTMLFormElement} form - The tracking form element
 */
const setupTrackingFormValidation = (form) => {
  const trackingInput = form.querySelector('#trackingNumber');
  
  // Validate tracking number
  if (trackingInput) {
    trackingInput.addEventListener('blur', () => {
      validateField(
        trackingInput,
        isValidTrackingNumber,
        'Please enter a valid tracking number (format: SD-XXXXXX-XXXX)'
      );
    });
  }
  
  // Validate form on submit
  form.addEventListener('submit', (e) => {
    let isValid = true;
    
    // Validate tracking number
    if (trackingInput) {
      isValid = validateField(
        trackingInput,
        isValidTrackingNumber,
        'Please enter a valid tracking number (format: SD-XXXXXX-XXXX)'
      ) && isValid;
    }
    
    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault();
      
      // Focus on the tracking input
      if (trackingInput) {
        trackingInput.focus();
      }
    }
  });
};

// Add CSS for validation styles
const addValidationStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .is-valid {
      border-color: #28a745 !important;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .is-invalid {
      border-color: #dc3545 !important;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .input-with-icon .is-valid,
    .input-with-icon .is-invalid {
      background-position: right calc(2.375em + 0.1875rem) center;
    }
    
    .strength-meter {
      height: 5px;
      background-color: #e1e5eb;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }
    
    .strength-bar {
      height: 100%;
      width: 0;
      background-color: #dc3545;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    .strength-text {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0;
    }
  `;
  document.head.appendChild(style);
};

// Initialize validation on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add validation styles
  addValidationStyles();
  
  // Setup form validation based on form type
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    setupRegistrationFormValidation(registrationForm);
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    setupLoginFormValidation(loginForm);
  }
  
  const deliveryForm = document.getElementById('delivery-form');
  if (deliveryForm) {
    setupDeliveryFormValidation(deliveryForm);
  }
  
  const trackingForm = document.getElementById('tracking-form');
  if (trackingForm) {
    setupTrackingFormValidation(trackingForm);
  }
});
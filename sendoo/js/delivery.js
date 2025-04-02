// Delivery creation logic for Sendoo
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the multi-step form
    initMultiStepForm();

    // Add validation for the package details form
    initPackageDetailsValidation();

    // Initialize location form content
    initLocationForm();

    // Initialize vehicle selection form
    initVehicleForm();

    // Initialize payment form
    initPaymentForm();
});

// Function to initialize the multi-step form navigation
function initMultiStepForm() {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    // Set up next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the current active step
            const currentStep = document.querySelector('.form-step.active');
            const currentIndex = Array.from(steps).indexOf(currentStep);

            // Validate the current step before proceeding
            if (validateStep(currentIndex + 1)) {
                // Hide current step
                currentStep.classList.remove('active');

                // Show next step
                steps[currentIndex + 1].classList.add('active');

                // Update progress bar
                updateProgressBar(currentIndex + 1);

                // Scroll to top of form
                document.querySelector('.delivery-form-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Set up previous button click handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the current active step
            const currentStep = document.querySelector('.form-step.active');
            const currentIndex = Array.from(steps).indexOf(currentStep);

            // Hide current step
            currentStep.classList.remove('active');

            // Show previous step
            steps[currentIndex - 1].classList.add('active');

            // Update progress bar
            updateProgressBar(currentIndex - 1);

            // Scroll to top of form
            document.querySelector('.delivery-form-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Function to update the progress bar
    function updateProgressBar(stepIndex) {
        progressSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
                if (index < stepIndex) {
                    step.classList.add('completed');
                } else {
                    step.classList.remove('completed');
                }
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        progressLines.forEach((line, index) => {
            if (index < stepIndex) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });

        // Log the current step for debugging
        console.log('Current step:', stepIndex + 1);
    }
}

// Function to validate each step
function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1: // Package details validation
            return validatePackageDetails();
        case 2: // Location validation
            return validateLocations();
        case 3: // Vehicle selection validation
            return validateVehicleSelection();
        case 4: // Payment validation
            return validatePayment();
        default:
            return true;
    }
}

// Validate package details form
function validatePackageDetails() {
    const packageType = document.getElementById('packageType');
    const packageWeight = document.getElementById('packageWeight');

    let isValid = true;

    // Check package type
    if (packageType.value === "" || packageType.value === null) {
        showError(packageType, 'Please select a package type');
        isValid = false;
    } else {
        clearError(packageType);
    }

    // Check package weight
    if (packageWeight.value === "" || packageWeight.value <= 0) {
        showError(packageWeight, 'Please enter a valid weight');
        isValid = false;
    } else {
        clearError(packageWeight);
    }

    return isValid;
}

// Helper function to show error message
function showError(inputElement, message) {
    // Find the parent form-group
    const formGroup = inputElement.closest('.form-group');

    // Add error class to the input
    inputElement.classList.add('error');

    // Create error message if it doesn't exist
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }

    // Set error message
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    // Highlight the input by scrolling to it
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add a shake animation for better feedback
    inputElement.classList.add('shake');
    setTimeout(() => {
        inputElement.classList.remove('shake');
    }, 500);
}

// Helper function to clear error message
function clearError(inputElement) {
    // Find the parent form-group
    const formGroup = inputElement.closest('.form-group');

    // Remove error class from the input
    inputElement.classList.remove('error');

    // Clear error message
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Initialize package details form validation
function initPackageDetailsValidation() {
    const packageType = document.getElementById('packageType');
    const packageWeight = document.getElementById('packageWeight');

    // Add input event listeners for real-time validation
    packageType.addEventListener('change', function() {
        if (this.value !== "") {
            clearError(this);
        }
    });

    packageWeight.addEventListener('input', function() {
        if (this.value > 0) {
            clearError(this);
        }
    });
}

// Initialize location form content
function initLocationForm() {
    const locationStep = document.getElementById('step2');

    // Only populate if the step is empty
    if (locationStep && locationStep.children.length <= 1) {
        locationStep.innerHTML = `
            <h2>Pickup & Delivery Locations</h2>
            <p>Tell us where to pick up and deliver your package</p>

            <form id="locationsForm" class="delivery-form">
                <div class="form-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Pickup Information</h3>

                    <div class="form-group">
                        <label for="pickupAddress">Pickup Address</label>
                        <input type="text" id="pickupAddress" name="pickupAddress" placeholder="Enter full address" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="pickupDate">Pickup Date</label>
                            <input type="date" id="pickupDate" name="pickupDate" required>
                        </div>

                        <div class="form-group">
                            <label for="pickupTime">Pickup Time</label>
                            <select id="pickupTime" name="pickupTime" required>
                                <option value="" disabled selected>Select time</option>
                                <option value="morning">Morning (8AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 4PM)</option>
                                <option value="evening">Evening (4PM - 8PM)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pickupInstructions">Special Instructions (Optional)</label>
                        <textarea id="pickupInstructions" name="pickupInstructions" placeholder="Any details for the pickup driver" rows="2"></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-map-pin"></i> Delivery Information</h3>

                    <div class="form-group">
                        <label for="deliveryAddress">Delivery Address</label>
                        <input type="text" id="deliveryAddress" name="deliveryAddress" placeholder="Enter full address" required>
                    </div>

                    <div class="form-group">
                        <label for="recipientName">Recipient Name</label>
                        <input type="text" id="recipientName" name="recipientName" placeholder="Who will receive the package" required>
                    </div>

                    <div class="form-group">
                        <label for="recipientPhone">Recipient Phone</label>
                        <input type="tel" id="recipientPhone" name="recipientPhone" placeholder="Recipient's contact number" required>
                    </div>

                    <div class="form-group">
                        <label for="deliveryInstructions">Delivery Instructions (Optional)</label>
                        <textarea id="deliveryInstructions" name="deliveryInstructions" placeholder="Any details for the delivery driver" rows="2"></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-outline prev-step">Back to Package</button>
                    <button type="button" class="btn btn-primary next-step">Continue to Vehicle</button>
                </div>
            </form>
        `;
    }
}

// Validate locations form
function validateLocations() {
    const pickupAddress = document.getElementById('pickupAddress');
    const pickupDate = document.getElementById('pickupDate');
    const pickupTime = document.getElementById('pickupTime');
    const deliveryAddress = document.getElementById('deliveryAddress');
    const recipientName = document.getElementById('recipientName');
    const recipientPhone = document.getElementById('recipientPhone');

    let isValid = true;

    // Validate required fields
    const requiredFields = [
        { element: pickupAddress, message: 'Pickup address is required' },
        { element: pickupDate, message: 'Pickup date is required' },
        { element: pickupTime, message: 'Pickup time is required' },
        { element: deliveryAddress, message: 'Delivery address is required' },
        { element: recipientName, message: 'Recipient name is required' },
        { element: recipientPhone, message: 'Recipient phone is required' }
    ];

    requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
            showError(field.element, field.message);
            isValid = false;
        } else {
            clearError(field.element);
        }
    });

    // Validate phone number format
    if (recipientPhone.value.trim() && !/^\d{10,15}$/.test(recipientPhone.value.replace(/[-()\s]/g, ''))) {
        showError(recipientPhone, 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

// Initialize vehicle selection form
function initVehicleForm() {
    const vehicleStep = document.getElementById('step3');

    // Only populate if the step is empty
    if (vehicleStep && vehicleStep.children.length <= 1) {
        vehicleStep.innerHTML = `
            <h2>Select Delivery Vehicle</h2>
            <p>Choose the right vehicle for your package</p>

            <form id="vehicleForm" class="delivery-form">
                <div class="vehicle-options-grid">
                    <div class="vehicle-option">
                        <input type="radio" id="bike" name="vehicleType" value="bike">
                        <label for="bike" class="vehicle-card">
                            <div class="vehicle-icon">
                                <i class="fas fa-bicycle"></i>
                            </div>
                            <h3>Bike Delivery</h3>
                            <p>Small packages, fast delivery</p>
                            <ul class="vehicle-features">
                                <li><i class="fas fa-check"></i> Up to 5kg</li>
                                <li><i class="fas fa-check"></i> City areas only</li>
                                <li><i class="fas fa-check"></i> Fastest option</li>
                                <li><i class="fas fa-check"></i> Eco-friendly</li>
                            </ul>
                            <div class="vehicle-price">$9.99</div>
                        </label>
                    </div>

                    <div class="vehicle-option">
                        <input type="radio" id="car" name="vehicleType" value="car">
                        <label for="car" class="vehicle-card">
                            <div class="vehicle-icon">
                                <i class="fas fa-car"></i>
                            </div>
                            <h3>Car Delivery</h3>
                            <p>Medium packages, balanced speed</p>
                            <ul class="vehicle-features">
                                <li><i class="fas fa-check"></i> Up to 20kg</li>
                                <li><i class="fas fa-check"></i> Wider range</li>
                                <li><i class="fas fa-check"></i> Good value</li>
                                <li><i class="fas fa-check"></i> Weather protected</li>
                            </ul>
                            <div class="vehicle-price">$14.99</div>
                        </label>
                    </div>

                    <div class="vehicle-option">
                        <input type="radio" id="truck" name="vehicleType" value="truck">
                        <label for="truck" class="vehicle-card">
                            <div class="vehicle-icon">
                                <i class="fas fa-truck"></i>
                            </div>
                            <h3>Truck Delivery</h3>
                            <p>Large packages, furniture, bulky items</p>
                            <ul class="vehicle-features">
                                <li><i class="fas fa-check"></i> 20kg and above</li>
                                <li><i class="fas fa-check"></i> Any location</li>
                                <li><i class="fas fa-check"></i> Most capacity</li>
                                <li><i class="fas fa-check"></i> Professional handling</li>
                            </ul>
                            <div class="vehicle-price">$24.99</div>
                        </label>
                    </div>
                </div>

                <div class="delivery-options">
                    <h3>Delivery Options</h3>

                    <div class="option-group">
                        <input type="checkbox" id="expressDelivery" name="expressDelivery">
                        <label for="expressDelivery">Express Delivery (+$5.00)</label>
                    </div>

                    <div class="option-group">
                        <input type="checkbox" id="weekendDelivery" name="weekendDelivery">
                        <label for="weekendDelivery">Weekend Delivery (+$3.00)</label>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-outline prev-step">Back to Locations</button>
                    <button type="button" class="btn btn-primary next-step">Continue to Payment</button>
                </div>
            </form>
        `;

        // Add click handler for vehicle cards
        const vehicleCards = vehicleStep.querySelectorAll('.vehicle-card');
        vehicleCards.forEach(card => {
            card.addEventListener('click', function() {
                // Clear any previous error
                clearError(document.querySelector('input[name="vehicleType"]'));
            });
        });
    }
}

// Validate vehicle selection
function validateVehicleSelection() {
    const vehicleOptions = document.querySelectorAll('input[name="vehicleType"]');
    let isSelected = false;

    vehicleOptions.forEach(option => {
        if (option.checked) {
            isSelected = true;
        }
    });

    if (!isSelected) {
        // Show error on the first vehicle option
        showError(vehicleOptions[0], 'Please select a vehicle type');
        return false;
    }

    return true;
}

// Initialize payment form
function initPaymentForm() {
    const paymentStep = document.getElementById('step4');

    // Only populate if the step is empty
    if (paymentStep && paymentStep.children.length <= 1) {
        paymentStep.innerHTML = `
            <h2>Payment Information</h2>
            <p>Complete your delivery request with payment</p>

            <form id="paymentForm" class="delivery-form">
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-item">
                        <span>Base Delivery Fee:</span>
                        <span id="baseDeliveryFee">$14.99</span>
                    </div>
                    <div class="summary-item">
                        <span>Additional Services:</span>
                        <span id="additionalServices">$0.00</span>
                    </div>
                    <div class="summary-item">
                        <span>Tax:</span>
                        <span id="taxAmount">$1.50</span>
                    </div>
                    <div class="summary-item total">
                        <span>Total:</span>
                        <span id="totalAmount">$16.49</span>
                    </div>
                </div>

                <div class="payment-methods">
                    <h3>Payment Method</h3>

                    <div class="payment-options">
                        <div class="payment-option">
                            <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" checked>
                            <label for="creditCard">
                                <i class="fas fa-credit-card"></i> Credit Card
                            </label>
                        </div>

                        <div class="payment-option">
                            <input type="radio" id="paypal" name="paymentMethod" value="paypal">
                            <label for="paypal">
                                <i class="fab fa-paypal"></i> PayPal
                            </label>
                        </div>

                        <div class="payment-option">
                            <input type="radio" id="applePay" name="paymentMethod" value="applePay">
                            <label for="applePay">
                                <i class="fab fa-apple-pay"></i> Apple Pay
                            </label>
                        </div>
                    </div>

                    <div id="creditCardForm" class="payment-form-section">
                        <div class="form-group">
                            <label for="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiryDate">Expiry Date</label>
                                <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                            </div>

                            <div class="form-group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv" placeholder="123" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="cardholderName">Cardholder Name</label>
                            <input type="text" id="cardholderName" name="cardholderName" placeholder="Name on card" required>
                        </div>
                    </div>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="termsAgree" name="termsAgree" required>
                    <label for="termsAgree">I agree to the <a href="#">Terms of Service</a> and <a href="#">Delivery Policy</a></label>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-outline prev-step">Back to Vehicle</button>
                    <button type="submit" class="btn btn-primary">Complete Order</button>
                </div>
            </form>
        `;

        // Add submit handler for the payment form
        const paymentForm = paymentStep.querySelector('#paymentForm');
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validatePayment()) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<div class="loader"></div> Processing...';
                submitButton.disabled = true;

                // Simulate payment processing
                setTimeout(function() {
                    // Redirect to confirmation page
                    window.location.href = 'delivery-confirmation.html';
                }, 2000);
            }
        });

        // Toggle payment method forms
        const paymentMethods = paymentStep.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment form sections
                const paymentForms = paymentStep.querySelectorAll('.payment-form-section');
                paymentForms.forEach(form => form.style.display = 'none');

                // Show the selected payment form
                const selectedForm = paymentStep.querySelector(`#${this.value}Form`);
                if (selectedForm) {
                    selectedForm.style.display = 'block';
                }
            });
        });
    }
}

// Validate payment form
function validatePayment() {
    const termsAgree = document.getElementById('termsAgree');
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

    let isValid = true;

    // Check terms agreement
    if (!termsAgree.checked) {
        showError(termsAgree, 'You must agree to the terms');
        isValid = false;
    } else {
        clearError(termsAgree);
    }

    // Validate credit card fields if credit card is selected
    if (selectedPaymentMethod && selectedPaymentMethod.value === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');
        const cardholderName = document.getElementById('cardholderName');

        // Simple validation for demo purposes
        if (!cardNumber.value.trim() || cardNumber.value.replace(/\s/g, '').length < 16) {
            showError(cardNumber, 'Please enter a valid card number');
            isValid = false;
        } else {
            clearError(cardNumber);
        }

        if (!expiryDate.value.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
            showError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        } else {
            clearError(expiryDate);
        }

        if (!cvv.value.trim() || !/^\d{3,4}$/.test(cvv.value)) {
            showError(cvv, 'Please enter a valid CVV');
            isValid = false;
        } else {
            clearError(cvv);
        }

        if (!cardholderName.value.trim()) {
            showError(cardholderName, 'Please enter the cardholder name');
            isValid = false;
        } else {
            clearError(cardholderName);
        }
    }

    return isValid;
}

// Add CSS for the multi-step form
const deliveryStyleElement = document.createElement('style');
deliveryStyleElement.textContent = `
    /* Form section styling */
    .form-section {
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-lg);
        background-color: var(--gray-50);
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
    }

    .form-section h3 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
        color: var(--primary-color);
    }

    .form-section h3 i {
        color: var(--primary-color);
    }

    .form-row {
        display: flex;
        gap: var(--spacing-lg);
    }

    .form-row .form-group {
        flex: 1;
    }

    /* Vehicle options grid */
    .vehicle-options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }

    .vehicle-option {
        position: relative;
    }

    .vehicle-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .vehicle-option .vehicle-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-lg);
        background-color: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-normal);
        height: 100%;
    }

    .vehicle-option input[type="radio"]:checked + .vehicle-card {
        border-color: var(--primary-color);
        background-color: rgba(79, 70, 229, 0.05);
        box-shadow: 0 0 0 2px var(--primary-color);
    }

    .vehicle-option .vehicle-card:hover {
        border-color: var(--primary-light);
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
    }

    .vehicle-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-light);
        color: var(--primary-color);
        border-radius: var(--radius-full);
        margin-bottom: var(--spacing-md);
        font-size: 1.5rem;
    }

    .vehicle-features {
        width: 100%;
        margin: var(--spacing-md) 0;
        padding-left: 0;
        list-style: none;
    }

    .vehicle-features li {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);
        font-size: 0.9rem;
    }

    .vehicle-features li i {
        color: var(--success-color);
    }

    .vehicle-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-top: auto;
    }

    /* Delivery options */
    .delivery-options {
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-lg);
        background-color: var(--gray-50);
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
    }

    .delivery-options h3 {
        margin-bottom: var(--spacing-md);
        color: var(--gray-800);
    }

    /* Order summary */
    .order-summary {
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-lg);
        background-color: var(--gray-50);
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
    }

    .order-summary h3 {
        margin-bottom: var(--spacing-md);
        color: var(--gray-800);
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--gray-200);
    }

    .summary-item.total {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--gray-900);
        border-bottom: none;
        padding-top: var(--spacing-md);
    }

    /* Payment methods */
    .payment-methods {
        margin-bottom: var(--spacing-xl);
    }

    .payment-methods h3 {
        margin-bottom: var(--spacing-md);
        color: var(--gray-800);
    }

    .payment-options {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
    }

    .payment-option {
        position: relative;
    }

    .payment-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .payment-option label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        background-color: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-normal);
    }

    .payment-option input[type="radio"]:checked + label {
        border-color: var(--primary-color);
        background-color: rgba(79, 70, 229, 0.05);
    }

    .payment-option label:hover {
        border-color: var(--primary-light);
    }

    .payment-option label i {
        font-size: 1.2rem;
    }

    .payment-form-section {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-lg);
        background-color: var(--gray-50);
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .form-row {
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .vehicle-options-grid {
            grid-template-columns: 1fr;
        }

        .payment-options {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(deliveryStyleElement); 

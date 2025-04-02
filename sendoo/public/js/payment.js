// Payment functions for Sendoo

// API URL
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('sendoo_token');
};

// Create payment intent
const createPaymentIntent = async (deliveryId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ deliveryId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to create payment intent');
    }

    return data;
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  }
};

// Confirm payment
const confirmPayment = async (deliveryId, paymentIntentId, paymentMethodId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/payments/confirm/${deliveryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ paymentIntentId, paymentMethodId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to confirm payment');
    }

    return data;
  } catch (error) {
    console.error('Confirm payment error:', error);
    throw error;
  }
};

// Get payment history
const getPaymentHistory = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/payments/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get payment history');
    }

    return data;
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
};

// Initialize Stripe payment form
const initializeStripePayment = (clientSecret, deliveryId, amount) => {
  // Make sure Stripe.js is loaded
  if (!window.Stripe) {
    console.error('Stripe.js not loaded');
    return;
  }
  
  // Initialize Stripe
  const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  const elements = stripe.elements();
  
  // Create card element
  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Poppins", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };
  
  const card = elements.create('card', { style });
  card.mount('#card-element');
  
  // Handle validation errors
  card.addEventListener('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
  
  // Handle form submission
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Disable form submission
    document.getElementById('submit-button').disabled = true;
    document.getElementById('payment-processing').style.display = 'block';
    
    try {
      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: document.getElementById('cardholder-name').value
          }
        }
      });
      
      if (result.error) {
        // Show error message
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        
        // Re-enable form submission
        document.getElementById('submit-button').disabled = false;
        document.getElementById('payment-processing').style.display = 'none';
      } else {
        // Payment succeeded
        if (result.paymentIntent.status === 'succeeded') {
          // Confirm payment on server
          await confirmPayment(
            deliveryId,
            result.paymentIntent.id,
            result.paymentIntent.payment_method
          );
          
          // Show success message
          document.getElementById('payment-form').style.display = 'none';
          document.getElementById('payment-success').style.display = 'block';
          
          // Redirect to delivery history after 3 seconds
          setTimeout(() => {
            window.location.href = '/pages/history.html';
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Show error message
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message || 'An error occurred during payment processing.';
      
      // Re-enable form submission
      document.getElementById('submit-button').disabled = false;
      document.getElementById('payment-processing').style.display = 'none';
    }
  });
};
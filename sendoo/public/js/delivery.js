// Delivery functions for Sendoo

// API URL
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('sendoo_token');
};

// Create a new delivery
const createDelivery = async (deliveryData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(deliveryData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to create delivery');
    }

    return data;
  } catch (error) {
    console.error('Create delivery error:', error);
    throw error;
  }
};

// Get all user deliveries
const getDeliveries = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/deliveries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get deliveries');
    }

    return data;
  } catch (error) {
    console.error('Get deliveries error:', error);
    throw error;
  }
};

// Get delivery by ID
const getDeliveryById = async (deliveryId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/deliveries/${deliveryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get delivery');
    }

    return data;
  } catch (error) {
    console.error('Get delivery error:', error);
    throw error;
  }
};

// Update delivery
const updateDelivery = async (deliveryId, deliveryData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/deliveries/${deliveryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(deliveryData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to update delivery');
    }

    return data;
  } catch (error) {
    console.error('Update delivery error:', error);
    throw error;
  }
};

// Cancel delivery
const cancelDelivery = async (deliveryId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/deliveries/${deliveryId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to cancel delivery');
    }

    return data;
  } catch (error) {
    console.error('Cancel delivery error:', error);
    throw error;
  }
};

// Track delivery by tracking number
const trackDelivery = async (trackingNumber) => {
  try {
    const response = await fetch(`${API_URL}/deliveries/track/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to track delivery');
    }

    return data;
  } catch (error) {
    console.error('Track delivery error:', error);
    throw error;
  }
};

// Calculate delivery price estimate
const calculatePriceEstimate = (packageType, weight, vehicleType) => {
  let basePrice = 0;
  
  // Base price by package type
  switch (packageType) {
    case 'Small':
      basePrice = 10;
      break;
    case 'Medium':
      basePrice = 20;
      break;
    case 'Large':
      basePrice = 35;
      break;
    case 'Extra Large':
      basePrice = 50;
      break;
    default:
      basePrice = 15;
  }
  
  // Add weight factor
  const weightFactor = Math.max(1, weight / 5);
  
  // Add vehicle factor
  let vehicleFactor = 1;
  switch (vehicleType) {
    case 'Bicycle':
      vehicleFactor = 0.8;
      break;
    case 'Motorcycle':
      vehicleFactor = 1;
      break;
    case 'Car':
      vehicleFactor = 1.2;
      break;
    case 'Van':
      vehicleFactor = 1.5;
      break;
    case 'Truck':
      vehicleFactor = 2;
      break;
    default:
      vehicleFactor = 1;
  }
  
  return Math.round((basePrice * weightFactor * vehicleFactor) * 100) / 100;
};

// Format delivery status for display
const formatDeliveryStatus = (status) => {
  switch (status) {
    case 'Pending':
      return '<span class="badge badge-warning">Pending</span>';
    case 'Confirmed':
      return '<span class="badge badge-primary">Confirmed</span>';
    case 'Picked Up':
      return '<span class="badge badge-info">Picked Up</span>';
    case 'In Transit':
      return '<span class="badge badge-info">In Transit</span>';
    case 'Delivered':
      return '<span class="badge badge-success">Delivered</span>';
    case 'Cancelled':
      return '<span class="badge badge-danger">Cancelled</span>';
    default:
      return '<span class="badge badge-secondary">Unknown</span>';
  }
};

// Format date for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
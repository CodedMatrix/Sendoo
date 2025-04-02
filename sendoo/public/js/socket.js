// Real-time updates for Sendoo using WebSockets

// Initialize WebSocket connection
const initializeSocket = () => {
  const token = localStorage.getItem('sendoo_token');
  
  if (!token) {
    console.warn('No authentication token found for WebSocket connection');
    return null;
  }
  
  // Create WebSocket connection
  const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socketUrl = `${socketProtocol}//${window.location.host}/ws?token=${token}`;
  const socket = new WebSocket(socketUrl);
  
  // Connection opened
  socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established');
  });
  
  // Listen for messages
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    
    // Handle different types of messages
    switch (data.type) {
      case 'DELIVERY_UPDATE':
        handleDeliveryUpdate(data.payload);
        break;
      case 'PAYMENT_UPDATE':
        handlePaymentUpdate(data.payload);
        break;
      case 'NOTIFICATION':
        showNotification(data.payload);
        break;
      default:
        console.log('Received message:', data);
    }
  });
  
  // Connection closed
  socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed');
    
    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      initializeSocket();
    }, 5000);
  });
  
  // Connection error
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });
  
  return socket;
};

// Handle delivery status updates
const handleDeliveryUpdate = (data) => {
  // Update UI if on tracking page
  const trackingContainer = document.getElementById('tracking-container');
  if (trackingContainer && data.trackingNumber) {
    // Update status badge
    const statusBadge = document.getElementById('delivery-status');
    if (statusBadge) {
      statusBadge.innerHTML = formatDeliveryStatus(data.status);
    }
    
    // Update timeline
    updateDeliveryTimeline(data.status);
    
    // Show notification
    showToast(`Delivery status updated to: ${data.status}`);
  }
  
  // Update delivery history if on history page
  const historyContainer = document.getElementById('delivery-history');
  if (historyContainer) {
    // Refresh delivery history
    loadDeliveryHistory();
  }
};

// Handle payment updates
const handlePaymentUpdate = (data) => {
  // Update UI if on payment page
  const paymentContainer = document.getElementById('payment-container');
  if (paymentContainer && data.deliveryId) {
    // Update payment status
    const paymentStatus = document.getElementById('payment-status');
    if (paymentStatus) {
      paymentStatus.innerHTML = `Payment ${data.status}`;
      paymentStatus.className = `badge badge-${data.status === 'succeeded' ? 'success' : 'warning'}`;
    }
    
    // Show notification
    showToast(`Payment status: ${data.status}`);
    
    // Redirect if payment succeeded
    if (data.status === 'succeeded') {
      setTimeout(() => {
        window.location.href = '/pages/payment-success.html?id=' + data.deliveryId;
      }, 2000);
    }
  }
};

// Show notification toast
const showToast = (message, type = 'info') => {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  // Style the toast
  toast.style.backgroundColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
  toast.style.color = 'white';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '4px';
  toast.style.marginBottom = '10px';
  toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  toast.style.display = 'flex';
  toast.style.justifyContent = 'space-between';
  toast.style.alignItems = 'center';
  toast.style.minWidth = '300px';
  toast.style.maxWidth = '400px';
  toast.style.animation = 'fadeIn 0.3s ease';
  
  // Add close button functionality
  const closeButton = toast.querySelector('.toast-close');
  closeButton.addEventListener('click', () => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  });
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toastContainer.contains(toast)) {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
};

// Show browser notification
const showNotification = (data) => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return;
  }
  
  // Check if permission is granted
  if (Notification.permission === 'granted') {
    createNotification(data);
  } else if (Notification.permission !== 'denied') {
    // Request permission
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        createNotification(data);
      }
    });
  }
};

// Create browser notification
const createNotification = (data) => {
  const notification = new Notification('Sendoo', {
    body: data.message,
    icon: '/images/logo.png'
  });
  
  notification.onclick = () => {
    window.focus();
    if (data.url) {
      window.location.href = data.url;
    }
    notification.close();
  };
};

// Update delivery timeline based on status
const updateDeliveryTimeline = (status) => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineItems.length) return;
  
  const statusOrder = ['Pending', 'Confirmed', 'Picked Up', 'In Transit', 'Delivered'];
  const currentStatusIndex = statusOrder.indexOf(status);
  
  if (currentStatusIndex === -1) return;
  
  timelineItems.forEach((item, index) => {
    if (index < currentStatusIndex) {
      // Completed steps
      item.classList.add('completed');
      item.classList.remove('active');
    } else if (index === currentStatusIndex) {
      // Current step
      item.classList.add('active');
      item.classList.remove('completed');
    } else {
      // Future steps
      item.classList.remove('active', 'completed');
    }
  });
};

// Add CSS for animations and toast
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    
    .toast {
      transition: all 0.3s ease;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add styles
  addStyles();
  
  // Initialize WebSocket if user is logged in
  if (localStorage.getItem('sendoo_token')) {
    const socket = initializeSocket();
    
    // Store socket in window for global access
    window.sendooSocket = socket;
  }
});
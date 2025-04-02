// Main JavaScript file for Sendoo

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Initialize IndexedDB for offline storage
const initIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('sendoo-offline', 1);

        request.onerror = event => {
            console.error('IndexedDB error:', event.target.error);
            reject('Error opening database');
        };

        request.onsuccess = event => {
            console.log('IndexedDB opened successfully');
            resolve(event.target.result);
        };

        request.onupgradeneeded = event => {
            const db = event.target.result;

            // Create stores for offline data
            if (!db.objectStoreNames.contains('pending-deliveries')) {
                db.createObjectStore('pending-deliveries', { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains('pending-tracking')) {
                db.createObjectStore('pending-tracking', { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains('cached-deliveries')) {
                db.createObjectStore('cached-deliveries', { keyPath: 'id' });
            }
        };
    });
};

// Save delivery data for offline use
const saveDeliveryOffline = (deliveryData, token) => {
    return new Promise((resolve, reject) => {
        initIndexedDB()
            .then(db => {
                const transaction = db.transaction('pending-deliveries', 'readwrite');
                const store = transaction.objectStore('pending-deliveries');

                const request = store.add({
                    data: deliveryData,
                    token,
                    timestamp: Date.now()
                });

                request.onsuccess = event => {
                    console.log('Delivery saved for offline sync');
                    resolve(event.target.result);
                };

                request.onerror = event => {
                    console.error('Error saving delivery offline:', event.target.error);
                    reject('Failed to save delivery offline');
                };
            })
            .catch(error => {
                console.error('IndexedDB error:', error);
                reject(error);
            });
    });
};

// Save tracking request for offline use
const saveTrackingOffline = (trackingNumber) => {
    return new Promise((resolve, reject) => {
        initIndexedDB()
            .then(db => {
                const transaction = db.transaction('pending-tracking', 'readwrite');
                const store = transaction.objectStore('pending-tracking');

                const request = store.add({
                    trackingNumber,
                    timestamp: Date.now()
                });

                request.onsuccess = event => {
                    console.log('Tracking request saved for offline sync');
                    resolve(event.target.result);
                };

                request.onerror = event => {
                    console.error('Error saving tracking offline:', event.target.error);
                    reject('Failed to save tracking offline');
                };
            })
            .catch(error => {
                console.error('IndexedDB error:', error);
                reject(error);
            });
    });
};

// Cache delivery data
const cacheDelivery = (delivery) => {
    return new Promise((resolve, reject) => {
        initIndexedDB()
            .then(db => {
                const transaction = db.transaction('cached-deliveries', 'readwrite');
                const store = transaction.objectStore('cached-deliveries');

                const request = store.put(delivery);

                request.onsuccess = event => {
                    console.log('Delivery cached successfully');
                    resolve();
                };

                request.onerror = event => {
                    console.error('Error caching delivery:', event.target.error);
                    reject('Failed to cache delivery');
                };
            })
            .catch(error => {
                console.error('IndexedDB error:', error);
                reject(error);
            });
    });
};

// Get cached delivery
const getCachedDelivery = (id) => {
    return new Promise((resolve, reject) => {
        initIndexedDB()
            .then(db => {
                const transaction = db.transaction('cached-deliveries', 'readonly');
                const store = transaction.objectStore('cached-deliveries');

                const request = store.get(id);

                request.onsuccess = event => {
                    resolve(event.target.result);
                };

                request.onerror = event => {
                    console.error('Error getting cached delivery:', event.target.error);
                    reject('Failed to get cached delivery');
                };
            })
            .catch(error => {
                console.error('IndexedDB error:', error);
                reject(error);
            });
    });
};

// Check online status
const isOnline = () => {
    return navigator.onLine;
};

// Show toast notification
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

        .offline-indicator {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};

// Show offline indicator
const showOfflineIndicator = () => {
    // Remove existing indicator if any
    const existingIndicator = document.querySelector('.offline-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.innerHTML = `
        <i class="fas fa-wifi-slash"></i>
        <span>You are offline. Some features may be limited.</span>
    `;

    document.body.appendChild(indicator);
};

// Hide offline indicator
const hideOfflineIndicator = () => {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
        indicator.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 300);
    }
};

// Monitor online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
    hideOfflineIndicator();
    showToast('You are back online!', 'success');

    // Trigger background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('sync-deliveries');
            registration.sync.register('sync-tracking');
        });
    }
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    showOfflineIndicator();
    showToast('You are offline. Some features may be limited.', 'error');
});

document.addEventListener('DOMContentLoaded', function() {
    // Add styles
    addStyles();

    // Check initial online status
    if (!isOnline()) {
        showOfflineIndicator();
    }

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.hamburger') && !event.target.closest('.nav-links')) {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');

    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');

        // Check if current path matches nav item or if we're on index and the item is home
        if (currentLocation.includes(itemPath) && itemPath !== 'index.html') {
            item.classList.add('active');
        } else if (currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) {
            if (itemPath === 'index.html' || itemPath === './') {
                item.classList.add('active');
            }
        }
    });
});
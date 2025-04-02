// Sendoo Service Worker for offline support

const CACHE_NAME = 'sendoo-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/auth.js',
  '/js/delivery.js',
  '/js/payment.js',
  '/js/validation.js',
  '/js/socket.js',
  '/pages/login.html',
  '/pages/register.html',
  '/pages/dashboard.html',
  '/pages/create-delivery.html',
  '/pages/track-delivery.html',
  '/pages/history.html',
  '/pages/profile.html',
  '/pages/settings.html',
  '/pages/verify-email.html',
  '/pages/reset-password.html',
  '/pages/forgot-password.html',
  '/pages/contact.html',
  '/images/hero-delivery.svg',
  '/images/logo.png',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Successfully installed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Successfully activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API requests (we don't want to cache these)
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For other requests, try the network first, then fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the response for future use
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // For image requests, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/images/fallback-image.png');
            }
            
            // For other assets, just return what we have
            return new Response('Resource not available offline');
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received:', event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Sendoo Notification',
        body: event.data.text()
      };
    }
  }
  
  const title = data.title || 'Sendoo Notification';
  const options = {
    body: data.body || 'Something new happened!',
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  const url = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync event:', event.tag);
  
  if (event.tag === 'sync-deliveries') {
    event.waitUntil(syncDeliveries());
  } else if (event.tag === 'sync-tracking') {
    event.waitUntil(syncTracking());
  }
});

// Sync pending deliveries
async function syncDeliveries() {
  try {
    const db = await openDatabase();
    const pendingDeliveries = await db.getAll('pending-deliveries');
    
    console.log('[Service Worker] Syncing pending deliveries:', pendingDeliveries);
    
    for (const delivery of pendingDeliveries) {
      try {
        const response = await fetch('/api/deliveries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': delivery.token
          },
          body: JSON.stringify(delivery.data)
        });
        
        if (response.ok) {
          // If successful, remove from pending
          await db.delete('pending-deliveries', delivery.id);
          
          // Show notification
          self.registration.showNotification('Delivery Synced', {
            body: 'Your delivery has been successfully submitted.',
            icon: '/images/logo.png'
          });
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync delivery:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncDeliveries:', error);
  }
}

// Sync pending tracking requests
async function syncTracking() {
  try {
    const db = await openDatabase();
    const pendingTracking = await db.getAll('pending-tracking');
    
    console.log('[Service Worker] Syncing pending tracking requests:', pendingTracking);
    
    for (const tracking of pendingTracking) {
      try {
        const response = await fetch(`/api/deliveries/track/${tracking.trackingNumber}`);
        
        if (response.ok) {
          // If successful, remove from pending
          await db.delete('pending-tracking', tracking.id);
          
          // Get tracking data
          const data = await response.json();
          
          // Show notification
          self.registration.showNotification('Tracking Updated', {
            body: `Status: ${data.status}`,
            icon: '/images/logo.png',
            data: {
              url: `/pages/track-delivery.html?tracking=${tracking.trackingNumber}`
            }
          });
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync tracking:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncTracking:', error);
  }
}

// Open IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sendoo-offline', 1);
    
    request.onerror = event => {
      reject('Error opening database');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      
      resolve({
        getAll: (storeName) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = event => {
              resolve(event.target.result);
            };
            
            request.onerror = event => {
              reject('Error getting data from store');
            };
          });
        },
        delete: (storeName, id) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = event => {
              resolve();
            };
            
            request.onerror = event => {
              reject('Error deleting data from store');
            };
          });
        }
      });
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create stores for offline data
      if (!db.objectStoreNames.contains('pending-deliveries')) {
        db.createObjectStore('pending-deliveries', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pending-tracking')) {
        db.createObjectStore('pending-tracking', { keyPath: 'id' });
      }
    };
  });
}
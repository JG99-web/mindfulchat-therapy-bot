const CACHE_NAME = 'mindfulai-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Cache essential assets
const CACHE_ASSETS = [
  '/',
  '/chat',
  '/crisis-resources',
  '/offline.html',
  '/manifest.json',
  // Add your main CSS and JS files here when built
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential files');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external API calls (OpenAI) - let them fail gracefully
  if (event.request.url.includes('api.openai.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, try to serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return empty response
            return new Response('', {
              status: 408,
              statusText: 'Request Timeout'
            });
          });
      })
  );
});

// Handle background sync for offline mood tracking
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-mood') {
    console.log('Service Worker: Background sync for mood data');
    event.waitUntil(syncMoodData());
  }
});

// Handle push notifications for crisis alerts
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Your wellness check-in is ready',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'wellness-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'chat',
        title: 'Start Chat',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'mood',
        title: 'Mood Check',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MindfulAI Wellness Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let url = '/';
  if (event.action === 'chat') {
    url = '/chat';
  } else if (event.action === 'mood') {
    url = '/chat?mood=true';
  }

  event.waitUntil(
    clients.openWindow(url)
  );
});

// Sync mood data when connection is restored
async function syncMoodData() {
  try {
    // Get pending mood data from IndexedDB or localStorage
    const pendingData = localStorage.getItem('pendingMoodData');
    if (pendingData) {
      // Process pending mood data
      console.log('Service Worker: Syncing mood data', pendingData);
      // Clear pending data after successful sync
      localStorage.removeItem('pendingMoodData');
    }
  } catch (error) {
    console.error('Service Worker: Mood sync failed', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded successfully');

const CACHE_NAME = 'bontrager-v5-20260418';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/favicon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

// ═══════════════════════════════════════════════════════════════════
// INSTALL EVENT - Cache critical app shell
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(APP_SHELL).catch(err => {
          console.warn('⚠️ Some assets failed to cache (this is OK):', err);
          // Continue even if some assets fail
          return Promise.resolve();
        });
      })
      .catch(err => {
        console.error('❌ Cache open failed:', err);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// ═══════════════════════════════════════════════════════════════════
// ACTIVATE EVENT - Clean up old caches
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️  Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// ═══════════════════════════════════════════════════════════════════
// FETCH EVENT - Network first, fallback to cache
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external/cross-origin requests (but you can modify this)
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Strategy: Network First for HTML, Cache First for everything else
  
  // For HTML documents: try network first, fallback to cache
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response && response.status === 200 && response.type !== 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('📦 Serving from cache (offline):', request.url);
                return cachedResponse;
              }
              // Return offline page if available
              return caches.match('./index.html');
            });
        })
    );
    return;
  }
  
  // For everything else (CSS, JS, images, etc.): cache first
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return from cache if available
        if (cachedResponse) {
          // Update cache in background
          fetch(request).then(response => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
          }).catch(() => {}); // Silently fail in background
          
          return cachedResponse;
        }
        
        // Not in cache, try network
        return fetch(request)
          .then(response => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(err => {
            // Network failed and not in cache
            console.warn('⚠️ Failed to fetch and not in cache:', request.url);
            
            // Return placeholder response
            return new Response('Offline - content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// ═══════════════════════════════════════════════════════════════════
// MESSAGE EVENT - Handle messages from clients
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_APP_SHELL') {
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(APP_SHELL).catch(err => console.warn('Cache refresh failed:', err));
    });
  }
});

console.log('✅ Service Worker loaded and ready');


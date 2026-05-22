const CACHE_NAME = 'bontrager-v0.0.2-offline-anat';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './data/ch11/ch11-data.js',
  './anatomy-images/head-neck-skull.svg',
  './anatomy-images/thorax-lungs-heart.svg',
  './anatomy-images/thorax-bony-cage.svg',
  './anatomy-images/full-skeleton.svg',
  './icons/icon-96.png',
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
// FETCH EVENT - Network first for HTML, Cache first for everything else
// Cross-origin images (anatomy diagrams) are cached for offline use
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Strategy: Network First for same-origin HTML, Cache First for everything else
  // Cross-origin image requests (anatomy images from GitHub CDN) are handled
  // with cache-first so they work offline after the first visit.
  
  // For same-origin HTML documents: try network first, fallback to cache
  const accept = request.headers.get('accept') || '';
  if (url.origin === self.location.origin && accept.includes('text/html')) {
    event.respondWith(
      fetch(request)
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
  
  // For everything else (same-origin assets AND cross-origin images): cache first
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return from cache if available
        if (cachedResponse) {
          // Update cache in background for same-origin assets only
          if (url.origin === self.location.origin) {
            fetch(request).then(response => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, responseClone);
                });
              }
            }).catch(() => {}); // Silently fail in background
          }
          return cachedResponse;
        }
        
        // Not in cache, try network
        return fetch(request)
          .then(response => {
            // Cache successful same-origin responses and cross-origin image responses
            // (opaque responses from cross-origin have type 'opaque' and status 0)
            const cacheable = response && (
              response.status === 200 ||
              response.type === 'opaque'
            );
            if (cacheable) {
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

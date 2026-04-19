const CACHE_NAME = 'bontrager-v7-anatomy-offline';
const ANATOMY_CACHE_NAME = 'bontrager-anatomy-v1';
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

// All anatomy images referenced in ANATOMY_DATA — pre-cached for offline use
const ANATOMY_IMAGE_URLS = [
  // Full-body skeleton background
  'https://github.com/user-attachments/assets/923d2151-4c18-4377-a084-1c8d0a7a6a19',
  // Head & Neck
  'https://github.com/user-attachments/assets/a29241d0-35aa-40c4-9f10-7fbee68a8a90',
  // Right Chest — PA chest diagram
  'https://github.com/user-attachments/assets/cca89d97-e931-4239-96d1-27d19d7ae5a4',
  // Left Chest — lateral chest diagram
  'https://github.com/user-attachments/assets/f409b0ea-b52f-410e-85c4-0c171f1f8e02',
  // Abdomen
  'https://github.com/user-attachments/assets/0c31f769-6d7c-4f98-849e-aa8b79ee53ef',
  // Spine
  'https://github.com/user-attachments/assets/efc22033-8e60-49f0-aeb6-91b5ef3f62fc',
  // Shoulder — AP view
  'https://github.com/user-attachments/assets/e089ff67-05e5-4870-8f3e-7a9724cbdec5',
  // Shoulder — axial/lateral view
  'https://github.com/user-attachments/assets/eb54dce0-51b6-4afc-a537-c26d4561d594',
  // Upper Arm (Humerus)
  'https://github.com/user-attachments/assets/1f699ad7-03f0-484c-8624-508b09fa3c97',
  // Forearm & Elbow
  'https://github.com/user-attachments/assets/d8a6109f-786d-4fdb-8214-2bc7effe1d28',
  // Wrist & Hand
  'https://github.com/user-attachments/assets/c2a42a2b-20fb-486f-8dcd-bb199f714819',
  // Pelvis & Hip
  'https://github.com/user-attachments/assets/3c4af9c9-295b-48e8-a37d-1afd4717470c',
  // Knee
  'https://github.com/user-attachments/assets/1980cde7-e841-4d94-868d-72d2afe30fad',
  // Leg & Ankle
  'https://github.com/user-attachments/assets/2a609706-3fcf-41b6-ae71-f18446439122',
  // Foot
  'https://github.com/user-attachments/assets/90759fa9-df11-4f2b-85e6-8b6fbff09763'
];

// ═══════════════════════════════════════════════════════════════════
// INSTALL EVENT - Cache critical app shell + anatomy images
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache same-origin app shell
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('📦 Caching app shell...');
          return cache.addAll(APP_SHELL).catch(err => {
            console.warn('⚠️ Some assets failed to cache (this is OK):', err);
            return Promise.resolve();
          });
        })
        .catch(err => {
          console.error('❌ Cache open failed:', err);
        }),
      // Pre-cache anatomy images from GitHub CDN (cross-origin, opaque response)
      caches.open(ANATOMY_CACHE_NAME)
        .then(cache => {
          console.log('🦴 Pre-caching anatomy images...');
          const fetches = ANATOMY_IMAGE_URLS.map(url =>
            fetch(url, { mode: 'no-cors' })
              .then(response => {
                if (response) {
                  return cache.put(new Request(url), response);
                }
              })
              .catch(() => {
                // Network may be unavailable; ignore — images will be cached on first use
              })
          );
          return Promise.all(fetches);
        })
        .catch(() => {})
    ])
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// ═══════════════════════════════════════════════════════════════════
// ACTIVATE EVENT - Clean up old caches
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activating...');
  
  const VALID_CACHES = [CACHE_NAME, ANATOMY_CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!VALID_CACHES.includes(cacheName)) {
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

  // ── Cross-origin anatomy images (GitHub CDN) ──────────────────────
  // Cache-first: serve from anatomy cache when offline, fetch & cache when online
  if (url.hostname === 'github.com' && url.pathname.startsWith('/user-attachments/')) {
    event.respondWith(
      caches.open(ANATOMY_CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached) {
            // Update cache in background when online
            if (navigator.onLine !== false) {
              fetch(request, { mode: 'no-cors' })
                .then(r => { if (r) cache.put(request, r); })
                .catch(() => {});
            }
            return cached;
          }
          // Not in cache — fetch and cache
          return fetch(request, { mode: 'no-cors' })
            .then(response => {
              if (response) {
                const clone = response.clone();
                cache.put(request, clone).catch(() => {});
              }
              return response;
            })
            .catch(() => {
              console.warn('⚠️ Anatomy image unavailable offline:', request.url);
              return new Response('', { status: 503 });
            });
        })
      )
    );
    return;
  }

  // Skip other cross-origin requests
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

  // Triggered by the "Download Anatomy for Offline" button
  if (event.data && event.data.type === 'CACHE_ANATOMY_IMAGES') {
    const port = event.ports && event.ports[0];
    caches.open(ANATOMY_CACHE_NAME).then(cache => {
      let done = 0;
      const total = ANATOMY_IMAGE_URLS.length;
      const fetches = ANATOMY_IMAGE_URLS.map(url =>
        fetch(url, { mode: 'no-cors' })
          .then(response => {
            if (response) {
              return cache.put(new Request(url), response).then(() => {
                done++;
                if (port) port.postMessage({ type: 'ANATOMY_CACHE_PROGRESS', done, total });
              });
            }
          })
          .catch(() => {
            done++;
            if (port) port.postMessage({ type: 'ANATOMY_CACHE_PROGRESS', done, total, failed: true });
          })
      );
      Promise.all(fetches).then(() => {
        if (port) port.postMessage({ type: 'ANATOMY_CACHE_DONE', total });
      });
    });
  }

  // Check which anatomy images are already cached
  if (event.data && event.data.type === 'CHECK_ANATOMY_CACHE') {
    const port = event.ports && event.ports[0];
    caches.open(ANATOMY_CACHE_NAME).then(cache =>
      Promise.all(ANATOMY_IMAGE_URLS.map(url =>
        cache.match(new Request(url)).then(r => !!r)
      ))
    ).then(results => {
      const cached = results.filter(Boolean).length;
      const total = ANATOMY_IMAGE_URLS.length;
      if (port) port.postMessage({ type: 'ANATOMY_CACHE_STATUS', cached, total });
    });
  }
});

console.log('✅ Service Worker loaded and ready');


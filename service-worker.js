// ══════════════════════════════════════════════
// SERVICE WORKER — Offline Support & Caching
// ══════════════════════════════════════════════

const CACHE_NAME = 'bontrager-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/core.js',
  './js/auth.js',
  './js/ui.js',
  './js/features.js',
  './js/viewer.js',
  './js/editor.js',
  './js/zoom.js',
  './js/pwa.js',
  './js/ai.js',
  './manifest.json'
];

// ═══ INSTALL ═══
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Some assets failed to cache:', err);
        // Continue even if some assets fail
        return Promise.resolve();
      });
    })
  );
  
  self.skipWaiting();
});

// ═══ ACTIVATE ═══
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  self.clients.claim();
});

// ═══ FETCH ═══
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Allow GitHub user-attachments (anatomy images) through; skip all other cross-origin
  const isGitHubAsset =
    (url.hostname === 'github.com' && url.pathname.startsWith('/user-attachments/')) ||
    url.hostname === 'objects.githubusercontent.com';

  if (url.origin !== location.origin && !isGitHubAsset) {
    return;
  }

  // Cache-first strategy for GitHub anatomy images
  if (isGitHubAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && (response.status === 200 || response.type === 'opaque')) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => new Response('', { status: 503, statusText: 'Offline' }));
        })
      )
    );
    return;
  }

  // Network-first strategy for HTML documents
  if (request.headers.get('accept').includes('text/html')) {
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
          // Fall back to cache on network error
          return caches.match(request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('./index.html');
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for other assets
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
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
          .catch(() => {
            // Return offline fallback
            console.log('Request failed, returning offline content:', request.url);
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

// ═══ BACKGROUND SYNC ═══
self.addEventListener('sync', event => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

function syncQuizResults() {
  // Placeholder for syncing quiz results when online
  console.log('Syncing quiz results...');
  return Promise.resolve();
}

function syncProgress() {
  // Placeholder for syncing progress when online
  console.log('Syncing progress...');
  return Promise.resolve();
}

// ═══ MESSAGE HANDLING ═══
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (event.data.action === 'getCacheSize') {
    caches.open(CACHE_NAME).then(cache => {
      // Rough cache size estimation
      cache.keys().then(keys => {
        event.ports[0].postMessage({ 
          success: true, 
          cacheSize: keys.length 
        });
      });
    });
  }
});

console.log('Service Worker loaded');

const CACHE_NAME = 'bontrager-v6';
const IMAGES_CACHE = 'bontrager-images-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './db.js',
  './offline-manager.js',

  // PWA icons
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

// Install: cache core app files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove outdated caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== IMAGES_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for images, stale-while-revalidate for core files
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Images: cache-first, update cache in background on network hit
  if (url.pathname.includes('/renamed_images/')) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => null);
          return cached || networkFetch || new Response('Image unavailable offline', { status: 503 });
        })
      )
    );
    return;
  }

  // Core app files: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Message handler: cache a batch of images on demand (used by offline-manager)
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'CACHE_IMAGES') {
    var images = event.data.images;
    if (!Array.isArray(images)) return;
    event.waitUntil(
      caches.open(IMAGES_CACHE).then(cache =>
        Promise.all(
          images.map(filename =>
            fetch('renamed_images/' + filename)
              .then(response => { if (response.ok) return cache.put('renamed_images/' + filename, response); })
              .catch(() => {})
          )
        )
      )
    );
  }

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

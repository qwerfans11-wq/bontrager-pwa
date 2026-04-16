const CACHE_NAME = 'bontrager-v6';
const IMAGES_CACHE = 'bontrager-images-v1';
const DB_NAME = 'BontragerOfflineDB';
const IMAGES_STORE = 'images';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './db.js',
  './chapters-config.js',
  './offline-manager.js',

  // أيقونات PWA
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

// ── IndexedDB helper (inline for SW context) ──────────────────────────────
let _swDb = null;
function _openDB() {
  if (_swDb) return Promise.resolve(_swDb);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'filename' });
      }
      if (!db.objectStoreNames.contains('chapters')) {
        db.createObjectStore('chapters', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { _swDb = e.target.result; resolve(_swDb); };
    req.onerror = () => reject(req.error);
  });
}

function _getImageFromDB(filename) {
  return _openDB().then(db => new Promise((resolve) => {
    try {
      const tx = db.transaction(IMAGES_STORE, 'readonly');
      const store = tx.objectStore(IMAGES_STORE);
      const req = store.get(filename);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  })).catch(() => null);
}

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────────────────────
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

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Handle renamed_images/* — Network-first with IndexedDB fallback
  if (url.pathname.includes('/renamed_images/')) {
    const filename = url.pathname.split('/renamed_images/').pop();
    event.respondWith(
      fetch(event.request)
        .then(networkResp => {
          // Cache successful network responses in the images cache
          if (networkResp.ok) {
            const copy = networkResp.clone();
            caches.open(IMAGES_CACHE).then(c => c.put(event.request, copy));
          }
          return networkResp;
        })
        .catch(() =>
          // Network failed — try IndexedDB first
          _getImageFromDB(filename).then(blob => {
            if (blob) {
              return new Response(blob, {
                status: 200,
                headers: { 'Content-Type': 'image/jpeg' }
              });
            }
            // Fall back to images cache
            return caches.match(event.request).then(cached => {
              if (cached) return cached;
              // Return an SVG placeholder so img elements don't show broken icons
              const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#1e2a44"/><text x="100" y="95" text-anchor="middle" fill="#4b5867" font-size="12" font-family="sans-serif">📡 Offline</text><text x="100" y="115" text-anchor="middle" fill="#4b5867" font-size="10" font-family="sans-serif">Image not available</text></svg>';
              return new Response(svg, {
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            });
          })
        )
    );
    return;
  }

  // All other requests — Cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(resp => {
        if (resp.ok && event.request.method === 'GET') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

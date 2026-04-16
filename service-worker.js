const CACHE_NAME = 'bontrager-v6';
const DB_NAME = 'bontrager-offline';
const STORE_IMAGES = 'images';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './db.js',
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

// فتح IndexedDB داخل Service Worker
function _swOpenDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'filename' });
      }
      if (!db.objectStoreNames.contains('chapters')) {
        db.createObjectStore('chapters', { keyPath: 'id' });
      }
    };
  });
}

async function _swGetImage(filename) {
  try {
    const db = await _swOpenDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_IMAGES, 'readonly');
      const req = tx.objectStore(STORE_IMAGES).get(filename);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// استراتيجية: Network First مع IndexedDB fallback للصور
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // الصور من renamed_images/: جرب الشبكة أولاً ثم IndexedDB
  if (url.pathname.includes('/renamed_images/')) {
    event.respondWith(_swHandleImage(event.request, url));
    return;
  }

  // باقي الملفات: Cache First مع fallback للشبكة
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request).catch(() => caches.match('./index.html')))
  );
});

async function _swHandleImage(request, url) {
  // أولاً: جرب الشبكة
  try {
    const resp = await fetch(request);
    if (resp.ok) return resp;
  } catch (e) {
    // الشبكة غير متاحة — تابع للـ IndexedDB
  }

  // ثانياً: جرب IndexedDB
  const filename = url.pathname.split('/').pop();
  const blob = await _swGetImage(filename);
  if (blob) {
    return new Response(blob, {
      status: 200,
      headers: { 'Content-Type': blob.type || 'image/jpeg' }
    });
  }

  // أخيراً: جرب Cache API
  const cached = await caches.match(request);
  if (cached) return cached;

  return new Response('', { status: 503, statusText: 'Image not available offline' });
}

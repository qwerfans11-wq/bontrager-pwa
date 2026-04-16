const CACHE_NAME = 'bontrager-v6';
const IMAGES_CACHE = 'bontrager-images-v1';

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

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker — حذف الكاشات القديمة
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

// استراتيجية Network-First مع IndexedDB fallback للصور
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isImage = url.pathname.includes('renamed_images/');

  if (isImage) {
    // للصور: شبكة أولاً، ثم كاش الصور، ثم IndexedDB (عبر postMessage)
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(IMAGES_CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            if (cached) return cached;
            // لا يوجد في الكاش — الصفحة ستعالج الطلب عبر IndexedDB
            return new Response('', { status: 503, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // للملفات الأخرى: شبكة أولاً، ثم كاش التطبيق
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

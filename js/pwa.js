// ══════════════════════════════════════════════
// PWA MODULE — Progressive Web App Features
// ══════════════════════════════════════════════

let deferredPrompt;
let pwaInstalled = false;

// ═══ PWA INITIALIZATION ═══
function initPWA() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(reg => {
      console.log('Service Worker registered:', reg);
    }).catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  }
  
  // Install event listener
  window.addEventListener('beforeinstallprompt', _onBeforeInstallPrompt);
  window.addEventListener('appinstalled', _onAppInstalled);
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    pwaInstalled = true;
  }
  
  // Check dismiss history
  const dismissed = localStorage.getItem('bontrager_pwa_dismissed_v1');
  if (dismissed) {
    const dismissTime = parseInt(dismissed);
    const now = Date.now();
    if (now - dismissTime < 7 * 24 * 60 * 60 * 1000) {
      // Still within 7-day dismiss period
      return;
    }
  }
  
  // Show install banner after delay
  setTimeout(_showInstallBanner, 2000);
}

// ═══ INSTALL PROMPT ═══
function _onBeforeInstallPrompt(e) {
  e.preventDefault();
  deferredPrompt = e;
}

function _onAppInstalled() {
  console.log('App installed');
  pwaInstalled = true;
  deferredPrompt = null;
  _hideInstallBanner();
}

// ═══ INSTALL BANNER ═══
function _showInstallBanner() {
  if (deferredPrompt && !pwaInstalled) {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.style.display = 'flex';
    }
  }
}

function _hideInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

function pwaInstall() {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA install');
    }
    deferredPrompt = null;
  });
}

function pwaDismiss() {
  localStorage.setItem('bontrager_pwa_dismissed_v1', Date.now().toString());
  _hideInstallBanner();
}

// ═══ OFFLINE STATUS ═══
function getOnlineStatus() {
  return navigator.onLine;
}

function updateOnlineIcon() {
  const icon = document.getElementById('online-status-icon');
  if (icon) {
    icon.textContent = getOnlineStatus() ? '🌐 Online' : '📴 Offline';
    icon.style.color = getOnlineStatus() ? '#4CAF50' : '#FF9800';
  }
}

window.addEventListener('online', updateOnlineIcon);
window.addEventListener('offline', updateOnlineIcon);

// ═══ MANIFEST DATA ═══
function getPWAManifest() {
  return {
    name: 'Bontrager Positioning Guide',
    short_name: 'Bontrager',
    description: 'Complete radiographic positioning guide (10th Edition) with offline support',
    start_url: './',
    scope: './',
    display: 'standalone',
    theme_color: '#1a1a1a',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    icons: [
      {
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: 'icons/screenshot1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ],
    categories: ['medical', 'education', 'reference'],
    shortcuts: [
      {
        name: 'Learn',
        short_name: 'Learn',
        description: 'Start learning positions',
        url: './?page=learn',
        icons: [{ src: 'icons/learn-icon.png', sizes: '192x192' }]
      },
      {
        name: 'Quiz',
        short_name: 'Quiz',
        description: 'Take a quiz',
        url: './?page=quiz',
        icons: [{ src: 'icons/quiz-icon.png', sizes: '192x192' }]
      }
    ]
  };
}

// ═══ CACHE MANAGEMENT ═══
const CACHE_NAME = 'bontrager-v1';
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
  './manifest.json'
];

function _cacheAssets() {
  if ('caches' in window) {
    caches.open(CACHE_NAME).then(cache => {
      STATIC_ASSETS.forEach(asset => {
        cache.add(asset).catch(err => {
          console.log('Failed to cache:', asset, err);
        });
      });
    });
  }
}

function _clearOldCaches() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name !== CACHE_NAME) {
          caches.delete(name);
        }
      });
    });
  }
}

// ═══ OFFLINE NOTIFICATION ═══
function showOfflineNotification() {
  const notification = document.getElementById('offline-notification');
  if (notification && !getOnlineStatus()) {
    notification.style.display = 'block';
    notification.textContent = '⚠️ You are offline. Content loaded from cache.';
  }
}

function hideOfflineNotification() {
  const notification = document.getElementById('offline-notification');
  if (notification && getOnlineStatus()) {
    notification.style.display = 'none';
  }
}

window.addEventListener('online', hideOfflineNotification);
window.addEventListener('offline', showOfflineNotification);

// ═══ INITIALIZATION ═══
function initPWAModule() {
  initPWA();
  updateOnlineIcon();
  _cacheAssets();
  _clearOldCaches();
}

// Call on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWAModule);
} else {
  initPWAModule();
}

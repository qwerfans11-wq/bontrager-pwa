// BontragerDB — IndexedDB manager for offline image storage
// Stores images as blobs keyed by filename, tracks chapter download state.

const DB_NAME = 'BontragerOfflineDB';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';
const CHAPTERS_STORE = 'chapters';

let _db = null;

async function initDB() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'filename' });
      }
      if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
        db.createObjectStore(CHAPTERS_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

async function saveImage(chapterId, filename, blob) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readwrite');
    const store = tx.objectStore(IMAGES_STORE);
    store.put({ filename, chapterId, blob, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getImage(filename) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly');
    const store = tx.objectStore(IMAGES_STORE);
    const req = store.get(filename);
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => reject(req.error);
  });
}

async function getStorageUsage() {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly');
    const store = tx.objectStore(IMAGES_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result || [];
      let bytes = 0;
      items.forEach(item => { if (item.blob) bytes += item.blob.size; });
      resolve(bytes);
    };
    req.onerror = () => resolve(0);
  });
}

async function getChapterStorageUsage(chapterId) {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly');
    const store = tx.objectStore(IMAGES_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = (req.result || []).filter(i => i.chapterId === chapterId);
      let bytes = 0;
      items.forEach(item => { if (item.blob) bytes += item.blob.size; });
      resolve({ bytes, count: items.length });
    };
    req.onerror = () => resolve({ bytes: 0, count: 0 });
  });
}

async function getDownloadedImageSet(chapterId) {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly');
    const store = tx.objectStore(IMAGES_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const filenames = (req.result || [])
        .filter(i => i.chapterId === chapterId)
        .map(i => i.filename);
      resolve(new Set(filenames));
    };
    req.onerror = () => resolve(new Set());
  });
}

async function deleteChapter(chapterId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readwrite');
    const store = tx.objectStore(IMAGES_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const items = (req.result || []).filter(i => i.chapterId === chapterId);
      items.forEach(item => store.delete(item.filename));
      tx.oncomplete = () => resolve(items.length);
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

async function getDownloadedChapters() {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(CHAPTERS_STORE, 'readonly');
    const store = tx.objectStore(CHAPTERS_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

async function markChapterDownloaded(chapterId, imageCount, bytes) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAPTERS_STORE, 'readwrite');
    const store = tx.objectStore(CHAPTERS_STORE);
    store.put({ id: chapterId, imageCount, bytes, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function removeChapterRecord(chapterId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAPTERS_STORE, 'readwrite');
    const store = tx.objectStore(CHAPTERS_STORE);
    store.delete(chapterId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
}

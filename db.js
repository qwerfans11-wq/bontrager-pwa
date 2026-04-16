// db.js — IndexedDB manager for offline image storage

const DB_NAME = 'bontrager-offline';
const DB_VERSION = 1;
const STORE_IMAGES = 'images';
const STORE_CHAPTERS = 'chapters';

let _dbPromise = null;

function _openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'filename' });
      }
      if (!db.objectStoreNames.contains(STORE_CHAPTERS)) {
        db.createObjectStore(STORE_CHAPTERS, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => {
      _dbPromise = null;
      reject(e.target.error);
    };
  });
  return _dbPromise;
}

async function saveImage(filename, blob, chapterId) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    tx.objectStore(STORE_IMAGES).put({ filename, blob, chapterId, ts: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function getImage(filename) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).get(filename);
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => resolve(null);
  });
}

async function isImageCached(filename) {
  const db = await _openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).count(filename);
    req.onsuccess = () => resolve(req.result > 0);
    req.onerror = () => resolve(false);
  });
}

async function deleteChapterImages(chapterId) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.chapterId === chapterId) cursor.delete();
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function getStorageStats() {
  const db = await _openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).openCursor();
    const byChapter = {};
    let totalBytes = 0;
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const { chapterId, blob } = cursor.value;
        const size = blob ? blob.size : 0;
        if (!byChapter[chapterId]) byChapter[chapterId] = { count: 0, bytes: 0 };
        byChapter[chapterId].count++;
        byChapter[chapterId].bytes += size;
        totalBytes += size;
        cursor.continue();
      } else {
        resolve({ byChapter, totalBytes });
      }
    };
    req.onerror = () => resolve({ byChapter: {}, totalBytes: 0 });
  });
}

async function saveChapterStatus(chapterId, status) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CHAPTERS, 'readwrite');
    tx.objectStore(STORE_CHAPTERS).put({ id: chapterId, ...status });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function getChapterStatus(chapterId) {
  const db = await _openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_CHAPTERS, 'readonly');
    const req = tx.objectStore(STORE_CHAPTERS).get(chapterId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

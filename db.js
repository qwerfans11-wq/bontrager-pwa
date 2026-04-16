// ══════════════════════════════════════════════
// DB.JS — IndexedDB Manager for Bontrager PWA
// Stores images as blobs for offline use
// ══════════════════════════════════════════════

class BontragerDB {
  constructor() {
    this.dbName = 'BontragerOfflineDB';
    this.dbVersion = 1;
    this.db = null;
  }

  async initDB() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.dbVersion);
      req.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Store individual images keyed by filename
        if (!db.objectStoreNames.contains('images')) {
          const imgStore = db.createObjectStore('images', { keyPath: 'name' });
          imgStore.createIndex('chapterId', 'chapterId', { unique: false });
        }
        // Store chapter metadata (download status, timestamp, etc.)
        if (!db.objectStoreNames.contains('chapters')) {
          db.createObjectStore('chapters', { keyPath: 'id' });
        }
      };
      req.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async saveImage(chapterId, imageName, blob) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put({ name: imageName, chapterId, blob, savedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getImage(imageName) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const req = tx.objectStore('images').get(imageName);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteChapter(chapterId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['images', 'chapters'], 'readwrite');
      const imgStore = tx.objectStore('images');
      const idx = imgStore.index('chapterId');
      const cursorReq = idx.openCursor(IDBKeyRange.only(chapterId));
      cursorReq.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.objectStore('chapters').delete(chapterId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async saveChapterMeta(chapterId, meta) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('chapters', 'readwrite');
      tx.objectStore('chapters').put({ id: chapterId, ...meta, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getChapterMeta(chapterId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('chapters', 'readonly');
      const req = tx.objectStore('chapters').get(chapterId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getDownloadedChapters() {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('chapters', 'readonly');
      const req = tx.objectStore('chapters').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getStorageUsage() {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const req = tx.objectStore('images').getAll();
      req.onsuccess = () => {
        const total = (req.result || []).reduce((sum, rec) => {
          return sum + (rec.blob ? rec.blob.size : 0);
        }, 0);
        resolve(total);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getChapterImageCount(chapterId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const idx = tx.objectStore('images').index('chapterId');
      const req = idx.count(IDBKeyRange.only(chapterId));
      req.onsuccess = () => resolve(req.result || 0);
      req.onerror = () => reject(req.error);
    });
  }
}

// Singleton instance
const bontragerDB = new BontragerDB();

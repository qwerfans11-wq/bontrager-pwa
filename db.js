// db.js — IndexedDB manager for Bontrager PWA
// Stores image blobs and metadata for offline access
'use strict';

const BontragerDB = (function () {
  const DB_NAME = 'bontrager-images-db';
  const DB_VERSION = 1;
  const STORE_IMAGES = 'images';

  let _db = null;

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (_db) { resolve(_db); return; }
      if (!window.indexedDB) { reject(new Error('IndexedDB not supported')); return; }

      var req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        var database = e.target.result;
        if (!database.objectStoreNames.contains(STORE_IMAGES)) {
          database.createObjectStore(STORE_IMAGES, { keyPath: 'filename' });
        }
      };

      req.onsuccess = function (e) {
        _db = e.target.result;
        // Handle unexpected DB close
        _db.onclose = function () { _db = null; };
        _db.onerror = function (ev) { console.warn('BontragerDB error:', ev.target.error); };
        resolve(_db);
      };

      req.onerror = function (e) { reject(e.target.error); };
      req.onblocked = function () { reject(new Error('IndexedDB open blocked')); };
    });
  }

  function saveImage(filename, blob) {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readwrite');
        var store = tx.objectStore(STORE_IMAGES);
        var record = { filename: filename, blob: blob, size: blob.size, timestamp: Date.now() };
        var req = store.put(record);
        req.onsuccess = function () { resolve(); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getImage(filename) {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readonly');
        var store = tx.objectStore(STORE_IMAGES);
        var req = store.get(filename);
        req.onsuccess = function (e) { resolve(e.target.result || null); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function deleteImage(filename) {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readwrite');
        var store = tx.objectStore(STORE_IMAGES);
        var req = store.delete(filename);
        req.onsuccess = function () { resolve(); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getAllKeys() {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readonly');
        var store = tx.objectStore(STORE_IMAGES);
        var req = store.getAllKeys();
        req.onsuccess = function (e) { resolve(e.target.result || []); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getAllMeta() {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readonly');
        var store = tx.objectStore(STORE_IMAGES);
        var req = store.openCursor();
        var results = [];
        req.onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            results.push({ filename: cursor.value.filename, size: cursor.value.size, timestamp: cursor.value.timestamp });
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function clearAll() {
    return openDB().then(function (database) {
      return new Promise(function (resolve, reject) {
        var tx = database.transaction(STORE_IMAGES, 'readwrite');
        var store = tx.objectStore(STORE_IMAGES);
        var req = store.clear();
        req.onsuccess = function () { resolve(); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getStorageInfo() {
    return getAllMeta().then(function (items) {
      var totalSize = items.reduce(function (acc, item) { return acc + (item.size || 0); }, 0);
      return { totalSize: totalSize, count: items.length };
    });
  }

  return {
    openDB: openDB,
    saveImage: saveImage,
    getImage: getImage,
    deleteImage: deleteImage,
    getAllKeys: getAllKeys,
    getAllMeta: getAllMeta,
    clearAll: clearAll,
    getStorageInfo: getStorageInfo
  };
})();

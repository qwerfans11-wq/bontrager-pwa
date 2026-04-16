// offline-manager.js — Offline functionality orchestrator for Bontrager PWA
// Manages image downloading, caching, and status tracking using IndexedDB
'use strict';

var OfflineManager = (function () {
  var IMAGES_BASE = 'renamed_images/';

  // In-memory blob URL cache to avoid recreating ObjectURLs
  var _blobCache = {};

  // Track filenames currently being downloaded
  var _downloading = {};

  // ── Helpers ──────────────────────────────────────────────────────────────

  function _getImageData() {
    return (typeof IMAGE_DATA !== 'undefined') ? IMAGE_DATA : {};
  }

  // Return deduplicated list of all image filenames in IMAGE_DATA
  function getAllImageFilenames() {
    var seen = {};
    var result = [];
    var data = _getImageData();
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      var entry = data[keys[i]];
      var files = (entry.positions || []).concat(entry.xrays || []);
      for (var j = 0; j < files.length; j++) {
        if (!seen[files[j]]) { seen[files[j]] = true; result.push(files[j]); }
      }
    }
    return result;
  }

  // Return all image filenames whose prefix matches a chapter keyword list
  function getImagesForChapter(prefixes) {
    if (!prefixes || prefixes.length === 0) return getAllImageFilenames();
    var all = getAllImageFilenames();
    return all.filter(function (f) {
      for (var i = 0; i < prefixes.length; i++) {
        if (f.indexOf(prefixes[i]) === 0) return true;
      }
      return false;
    });
  }

  // ── Blob URL management ───────────────────────────────────────────────────

  // Return cached blob URL synchronously (null if not in memory)
  function getCachedImageSrc(filename) {
    return _blobCache[filename] || null;
  }

  // Load image from IndexedDB and return a blob URL (async)
  function loadCachedImage(filename) {
    if (_blobCache[filename]) return Promise.resolve(_blobCache[filename]);
    if (typeof BontragerDB === 'undefined') return Promise.resolve(null);

    return BontragerDB.getImage(filename).then(function (record) {
      if (record && record.blob) {
        var url = URL.createObjectURL(record.blob);
        _blobCache[filename] = url;
        return url;
      }
      return null;
    }).catch(function () { return null; });
  }

  // ── Download logic ────────────────────────────────────────────────────────

  // Fetch a single image, save to IndexedDB, and register blob URL
  function _downloadSingle(filename) {
    if (_blobCache[filename]) return Promise.resolve(0);
    if (_downloading[filename]) return _downloading[filename];

    var url = IMAGES_BASE + filename;
    var promise = fetch(url).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.blob();
    }).then(function (blob) {
      if (typeof BontragerDB === 'undefined') return blob.size;
      return BontragerDB.saveImage(filename, blob).then(function () {
        var blobUrl = URL.createObjectURL(blob);
        _blobCache[filename] = blobUrl;
        return blob.size;
      });
    }).finally(function () {
      delete _downloading[filename];
    });

    _downloading[filename] = promise;
    return promise;
  }

  /**
   * Download a list of image filenames with progress reporting.
   * @param {string[]} filenames
   * @param {function({downloaded, failed, total, totalBytes})} onProgress
   * @returns {Promise<{downloaded, failed, total, totalBytes}>}
   */
  function downloadImages(filenames, onProgress) {
    var downloaded = 0;
    var failed = 0;
    var totalBytes = 0;
    var total = filenames.length;

    // Process sequentially to avoid flooding the network
    var chain = Promise.resolve();
    filenames.forEach(function (filename) {
      chain = chain.then(function () {
        return _downloadSingle(filename).then(function (bytes) {
          totalBytes += (bytes || 0);
          downloaded++;
        }).catch(function () {
          failed++;
        }).then(function () {
          if (onProgress) onProgress({ downloaded: downloaded, failed: failed, total: total, totalBytes: totalBytes });
        });
      });
    });

    return chain.then(function () {
      return { downloaded: downloaded, failed: failed, total: total, totalBytes: totalBytes };
    });
  }

  // Download all images from IMAGE_DATA
  function downloadAllImages(onProgress) {
    return downloadImages(getAllImageFilenames(), onProgress);
  }

  // ── Cache status ──────────────────────────────────────────────────────────

  // Check how many of the given filenames are in IndexedDB
  function getCacheStatus(filenames) {
    if (typeof BontragerDB === 'undefined') {
      return Promise.resolve({ cached: 0, total: filenames.length });
    }
    return BontragerDB.getAllKeys().then(function (keys) {
      var keySet = {};
      keys.forEach(function (k) { keySet[k] = true; });
      var cached = filenames.filter(function (f) { return keySet[f]; }).length;
      return { cached: cached, total: filenames.length };
    }).catch(function () {
      return { cached: 0, total: filenames.length };
    });
  }

  function getAllCacheStatus() {
    return getCacheStatus(getAllImageFilenames());
  }

  // ── Clear cache ───────────────────────────────────────────────────────────

  function clearAllCache() {
    // Revoke all blob URLs
    var keys = Object.keys(_blobCache);
    for (var i = 0; i < keys.length; i++) {
      try { URL.revokeObjectURL(_blobCache[keys[i]]); } catch (e) { /* ignore */ }
    }
    _blobCache = {};

    if (typeof BontragerDB !== 'undefined') {
      return BontragerDB.clearAll();
    }
    return Promise.resolve();
  }

  // ── Storage info ──────────────────────────────────────────────────────────

  function getStorageInfo() {
    var dbInfo = (typeof BontragerDB !== 'undefined')
      ? BontragerDB.getStorageInfo()
      : Promise.resolve({ totalSize: 0, count: 0 });

    var quotaInfo = (navigator.storage && navigator.storage.estimate)
      ? navigator.storage.estimate()
      : Promise.resolve({ quota: null, usage: null });

    return Promise.all([dbInfo, quotaInfo]).then(function (results) {
      return {
        totalSize: results[0].totalSize,
        count: results[0].count,
        quota: results[1].quota,
        usage: results[1].usage
      };
    }).catch(function () {
      return { totalSize: 0, count: 0, quota: null, usage: null };
    });
  }

  // ── Image element helper ──────────────────────────────────────────────────

  /**
   * Try to load a cached version of an image into an <img> element.
   * If a cached blob URL exists it is applied immediately; otherwise an async
   * lookup is performed and the src is updated when the blob is ready.
   */
  function applyCachedSrc(imgElement, filename) {
    var cached = getCachedImageSrc(filename);
    if (cached) {
      imgElement.src = cached;
      return;
    }
    // Async fallback — only replaces src if the DB lookup succeeds
    loadCachedImage(filename).then(function (url) {
      if (url && imgElement) imgElement.src = url;
    });
  }

  return {
    getAllImageFilenames: getAllImageFilenames,
    getImagesForChapter: getImagesForChapter,
    getCachedImageSrc: getCachedImageSrc,
    loadCachedImage: loadCachedImage,
    downloadImages: downloadImages,
    downloadAllImages: downloadAllImages,
    getCacheStatus: getCacheStatus,
    getAllCacheStatus: getAllCacheStatus,
    clearAllCache: clearAllCache,
    getStorageInfo: getStorageInfo,
    applyCachedSrc: applyCachedSrc
  };
})();

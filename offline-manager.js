// OfflineManager — manages chapter downloading, cancellation, deletion and progress.
// Depends on: db.js, chapters-config.js

const OfflineManager = (() => {
  const IMAGES_PATH = 'renamed_images/';
  const MAX_PARALLEL = 3;       // max concurrent fetches per chapter
  const STORAGE_WARN_PCT = 80;  // warn when storage is this % full
  const STORAGE_MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB soft cap

  // Track active downloads: chapterId → { cancel: bool }
  const _active = {};

  /**
   * Download all images for a chapter, storing each blob in IndexedDB.
   * Calls onProgress(done, total, chapterId) as images complete.
   * @param {string} chapterId
   * @param {function} onProgress  called with (downloaded, total, chapterId)
   * @param {function} onDone      called with (chapterId, success, error?)
   */
  async function downloadChapter(chapterId, onProgress, onDone) {
    const chapter = getChapterById(chapterId);
    if (!chapter) {
      onDone && onDone(chapterId, false, new Error('Chapter not found'));
      return;
    }

    const images = getChapterImageList(chapter);
    if (images.length === 0) {
      onDone && onDone(chapterId, false, new Error('No images available for this chapter'));
      return;
    }

    // Mark active
    _active[chapterId] = { cancel: false };

    // Find which images are already in DB (for resume support)
    let alreadyStored;
    try {
      alreadyStored = await getDownloadedImageSet(chapterId);
    } catch (e) {
      alreadyStored = new Set();
    }

    const todo = images.filter(f => !alreadyStored.has(f));
    const total = images.length;
    let done = alreadyStored.size;

    // Initial progress report
    onProgress && onProgress(done, total, chapterId);

    let fetchError = null;

    // Process in batches of MAX_PARALLEL
    for (let i = 0; i < todo.length; i += MAX_PARALLEL) {
      if (_active[chapterId] && _active[chapterId].cancel) {
        delete _active[chapterId];
        onDone && onDone(chapterId, false, new Error('Cancelled'));
        return;
      }

      const batch = todo.slice(i, i + MAX_PARALLEL);
      await Promise.all(batch.map(async (filename) => {
        if (_active[chapterId] && _active[chapterId].cancel) return;
        try {
          const url = IMAGES_PATH + filename;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${filename}`);
          const blob = await resp.blob();
          await saveImage(chapterId, filename, blob);
          done++;
          onProgress && onProgress(done, total, chapterId);
        } catch (e) {
          fetchError = e;
          done++; // count it as processed to keep progress moving
          onProgress && onProgress(done, total, chapterId);
        }
      }));
    }

    delete _active[chapterId];

    if (fetchError) {
      // Partial download; record what we have
      try {
        const usage = await getChapterStorageUsage(chapterId);
        if (usage.count > 0) {
          await markChapterDownloaded(chapterId, usage.count, usage.bytes);
        }
      } catch (_) {}
      onDone && onDone(chapterId, false, fetchError);
      return;
    }

    // Record chapter as fully downloaded
    try {
      const usage = await getChapterStorageUsage(chapterId);
      await markChapterDownloaded(chapterId, usage.count, usage.bytes);
    } catch (_) {}

    // Storage usage warning
    try {
      const totalBytes = await getStorageUsage();
      const pct = (totalBytes / STORAGE_MAX_BYTES) * 100;
      if (pct >= 100) {
        _notifyStorageAlert(100);
      } else if (pct >= STORAGE_WARN_PCT) {
        _notifyStorageAlert(Math.round(pct));
      }
    } catch (_) {}

    onDone && onDone(chapterId, true);
  }

  /**
   * Cancel an in-progress download.
   * @param {string} chapterId
   */
  function cancelDownload(chapterId) {
    if (_active[chapterId]) {
      _active[chapterId].cancel = true;
    }
  }

  /**
   * Delete all stored images for a chapter and remove chapter record.
   * @param {string} chapterId
   * @returns {Promise<number>} number of deleted images
   */
  async function deleteChapterData(chapterId) {
    cancelDownload(chapterId);
    const count = await deleteChapter(chapterId);
    await removeChapterRecord(chapterId).catch(() => {});
    return count;
  }

  /**
   * Returns true if chapterId is currently being downloaded.
   * @param {string} chapterId
   * @returns {boolean}
   */
  function isDownloading(chapterId) {
    return !!_active[chapterId];
  }

  /**
   * Returns a blob URL for an image if it is stored in IndexedDB, else null.
   * Callers must revoke the URL when done (URL.revokeObjectURL).
   * @param {string} filename
   * @returns {Promise<string|null>}
   */
  async function getOfflineImageUrl(filename) {
    try {
      const blob = await getImage(filename);
      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch (_) {
      return null;
    }
  }

  function _notifyStorageAlert(pct) {
    if (typeof _showOfflineStorageAlert === 'function') {
      _showOfflineStorageAlert(pct);
    }
  }

  return {
    downloadChapter,
    cancelDownload,
    deleteChapterData,
    isDownloading,
    getOfflineImageUrl
  };
})();

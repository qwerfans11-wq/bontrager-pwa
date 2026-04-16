// ══════════════════════════════════════════════
// OFFLINE-MANAGER.JS — Chapter Download Manager
// Handles selective chapter downloading, progress
// tracking, cancellation, and storage alerts
// ══════════════════════════════════════════════

class OfflineManager {
  constructor(db, imagesPath) {
    this._db = db;
    this._imagesPath = imagesPath || 'renamed_images/';
    this._active = {};     // chapterId → { controller, downloaded, total, startTime }
    this._listeners = [];  // progress listeners
    this._downloadedChapters = new Set();
    this._init();
  }

  async _init() {
    await this._db.initDB();
    const chapters = await this._db.getDownloadedChapters();
    chapters.forEach(ch => {
      if (ch.status === 'complete') this._downloadedChapters.add(ch.id);
    });
    this._updateUI();
  }

  // ── Public API ──────────────────────────────

  isDownloaded(chapterId) {
    return this._downloadedChapters.has(chapterId);
  }

  isDownloading(chapterId) {
    return !!this._active[chapterId];
  }

  getDownloadProgress(chapterId) {
    const s = this._active[chapterId];
    if (!s) return null;
    return {
      downloaded: s.downloaded,
      total: s.total,
      percent: s.total > 0 ? Math.round((s.downloaded / s.total) * 100) : 0,
      elapsed: Date.now() - s.startTime
    };
  }

  async downloadChapter(chapterId) {
    if (this._active[chapterId]) return; // already running
    const chapter = (typeof CHAPTERS !== 'undefined' ? CHAPTERS : [])
      .find(c => c.id === chapterId);
    if (!chapter) return;

    // Build image list from IMAGE_DATA global
    const images = this._getChapterImages(chapter.prefix);
    if (!images.length) return;

    const controller = new AbortController();
    const state = {
      controller,
      downloaded: 0,
      total: images.length,
      startTime: Date.now()
    };
    this._active[chapterId] = state;

    await this._db.saveChapterMeta(chapterId, { status: 'downloading', total: images.length });
    this._emit(chapterId, 'start', state);
    this._updateUI();

    let failed = 0;
    // Download up to 3 images in parallel
    const queue = [...images];
    const CONCURRENCY = 3;

    const worker = async () => {
      while (queue.length > 0) {
        if (controller.signal.aborted) break;
        const img = queue.shift();
        try {
          const resp = await fetch(this._imagesPath + img, { signal: controller.signal });
          if (resp.ok) {
            const blob = await resp.blob();
            await this._db.saveImage(chapterId, img, blob);
          } else {
            failed++;
          }
        } catch (err) {
          if (controller.signal.aborted) break;
          failed++;
        }
        state.downloaded++;
        this._emit(chapterId, 'progress', state);
        this._updateProgressUI(chapterId, state);
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    if (!controller.signal.aborted) {
      const status = failed === 0 ? 'complete' : 'partial';
      await this._db.saveChapterMeta(chapterId, {
        status,
        total: images.length,
        failed,
        completedAt: Date.now()
      });
      if (status === 'complete') this._downloadedChapters.add(chapterId);
    }

    delete this._active[chapterId];
    this._emit(chapterId, 'done', { status: controller.signal.aborted ? 'cancelled' : 'complete' });
    this._updateUI();
    this._checkStorageAlert();
  }

  async cancelDownload(chapterId) {
    const state = this._active[chapterId];
    if (state) {
      state.controller.abort();
      delete this._active[chapterId];
      await this._db.saveChapterMeta(chapterId, { status: 'cancelled' });
      this._emit(chapterId, 'cancelled', {});
      this._updateUI();
    }
  }

  async deleteChapterData(chapterId) {
    await this.cancelDownload(chapterId);
    await this._db.deleteChapter(chapterId);
    this._downloadedChapters.delete(chapterId);
    this._updateUI();
  }

  onProgress(fn) {
    this._listeners.push(fn);
  }

  // ── Internal helpers ─────────────────────────

  _getChapterImages(prefix) {
    const imgs = [];
    if (typeof IMAGE_DATA === 'undefined') return imgs;
    Object.values(IMAGE_DATA).forEach(entry => {
      [...(entry.positions || []), ...(entry.xrays || [])].forEach(name => {
        if (name.startsWith(prefix) && !imgs.includes(name)) {
          imgs.push(name);
        }
      });
    });
    return imgs;
  }

  _emit(chapterId, event, data) {
    this._listeners.forEach(fn => {
      try { fn(chapterId, event, data); } catch (e) { /* ignore */ }
    });
  }

  // ── UI update helpers ────────────────────────

  _updateUI() {
    if (typeof buildOfflinePanel === 'function') buildOfflinePanel();
    // Update header online indicator
    const ind = document.getElementById('offlineStatusDot');
    if (ind) {
      const online = navigator.onLine;
      ind.textContent = online ? '🟢' : '🔴';
      ind.title = online ? 'Online' : 'Offline';
    }
    // Update storage usage display
    this._db.getStorageUsage().then(bytes => {
      const el = document.getElementById('offlineStorageUsed');
      if (el) el.textContent = _fmtBytes(bytes);
    });
  }

  _updateProgressUI(chapterId, state) {
    const bar = document.getElementById('dlBar_' + chapterId);
    const txt = document.getElementById('dlTxt_' + chapterId);
    if (!bar || !txt) return;
    const pct = state.total > 0 ? Math.round((state.downloaded / state.total) * 100) : 0;
    bar.style.width = pct + '%';
    const elapsed = (Date.now() - state.startTime) / 1000;
    const rate = state.downloaded / (elapsed || 1);
    const remaining = rate > 0 ? Math.ceil((state.total - state.downloaded) / rate) : '…';
    txt.textContent = pct + '% — ' + state.downloaded + '/' + state.total +
      (typeof remaining === 'number' ? ' (' + remaining + 's left)' : '');
  }

  async _checkStorageAlert() {
    if (!navigator.storage || !navigator.storage.estimate) return;
    const est = await navigator.storage.estimate();
    const used = est.usage || 0;
    const quota = est.quota || 1;
    const pct = (used / quota) * 100;
    if (pct >= 100) {
      _showOfflineAlert('⚠️ Storage full! (100%) — Some images may not have been saved.');
    } else if (pct >= 80) {
      _showOfflineAlert('⚠️ Storage nearly full (' + Math.round(pct) + '%)');
    }
  }
}

// ── Format bytes helper ──────────────────────
function _fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

// ── Show alert toast ─────────────────────────
function _showOfflineAlert(msg) {
  let el = document.getElementById('_offlineAlertToast');
  if (!el) {
    el = document.createElement('div');
    el.id = '_offlineAlertToast';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);max-width:90vw;text-align:center';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { if (el) el.style.display = 'none'; }, 5000);
}

// ── Auto-cache images when browsed online ────
function _autoCacheImage(imageName) {
  if (!navigator.onLine || typeof bontragerDB === 'undefined' || typeof offlineManager === 'undefined') return;
  bontragerDB.getImage(imageName).then(existing => {
    if (!existing) {
      // Find which chapter this image belongs to
      let chId = 'unknown';
      if (typeof CHAPTERS !== 'undefined') {
        const ch = CHAPTERS.find(c => imageName.startsWith(c.prefix));
        if (ch) chId = ch.id;
      }
      const path = (typeof IMAGES_PATH !== 'undefined' ? IMAGES_PATH : 'renamed_images/') + imageName;
      fetch(path).then(r => r.ok ? r.blob() : null).then(blob => {
        if (blob) bontragerDB.saveImage(chId, imageName, blob);
      }).catch(() => {});
    }
  });
}

// Singleton — created after page load (needs IMAGE_DATA + CHAPTERS globals)
let offlineManager;

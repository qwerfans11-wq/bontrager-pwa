// offline-manager.js — Chapter-selective offline download manager
// Depends on: db.js (loaded before this), and BOOK / IMAGE_DATA / _getImagesForPos / IMAGES_PATH
// from the main index.html inline script.

let _omDownloading = false;
let _omAbortCtrl = null;
let _omCurrentChapter = null;

// ── Collect all unique image filenames for a given chapter ──
function _omGetChapterImages(chId) {
  const ch = (typeof BOOK !== 'undefined') && BOOK[chId];
  if (!ch) return [];
  const seen = new Set();

  function collect(positions) {
    if (!positions) return;
    positions.forEach(pos => {
      const d = (typeof _getImagesForPos === 'function') ? _getImagesForPos(pos.name) : null;
      if (d) {
        (d.positions || []).forEach(f => seen.add(f));
        (d.xrays || []).forEach(f => seen.add(f));
      }
    });
  }

  collect(ch.positions);
  if (ch.subchapters) Object.values(ch.subchapters).forEach(sc => collect(sc.positions));
  return [...seen];
}

// ── Download all images for a chapter into IndexedDB ──
async function omDownloadChapter(chId) {
  if (_omDownloading) {
    if (typeof _showToast === 'function') _showToast('A download is already in progress', '#c8960c');
    return;
  }
  const imgs = _omGetChapterImages(chId);
  if (!imgs.length) {
    if (typeof _showToast === 'function') _showToast('No images found for this chapter', '#c0392b');
    return;
  }

  _omDownloading = true;
  _omAbortCtrl = null;
  _omCurrentChapter = chId;
  _omShowProgress(true);

  let done = 0, failed = 0;
  const total = imgs.length;
  _omUpdateProgress(0, total, 'Preparing…');

  for (const filename of imgs) {
    if (_omAbortCtrl && _omAbortCtrl.signal.aborted) break;
    try {
      const already = await isImageCached(filename);
      if (already) {
        done++;
        _omUpdateProgress(done, total, `${done}/${total} images saved`);
        continue;
      }
      const ctrl = new AbortController();
      _omAbortCtrl = ctrl;
      const imgPath = (typeof IMAGES_PATH !== 'undefined' ? IMAGES_PATH : 'renamed_images/') + filename;
      const resp = await fetch(imgPath, { signal: ctrl.signal });
      if (resp.ok) {
        const blob = await resp.blob();
        await saveImage(filename, blob, chId);
        done++;
      } else {
        failed++;
      }
    } catch (e) {
      if (e.name === 'AbortError') break;
      failed++;
    }
    _omUpdateProgress(done + failed, total, `${done}/${total} images saved`);
  }

  const aborted = _omAbortCtrl && _omAbortCtrl.signal.aborted;
  await saveChapterStatus(chId, {
    downloaded: !aborted && done > 0,
    imageCount: done,
    lastSync: Date.now()
  });

  _omDownloading = false;
  _omCurrentChapter = null;
  _omShowProgress(false);
  await _omRefreshPanel();

  if (typeof _showToast === 'function') {
    const chName = (typeof BOOK !== 'undefined' && BOOK[chId]) ? BOOK[chId].name : chId;
    if (aborted) {
      _showToast('Download cancelled', '#c8960c');
    } else if (done > 0) {
      _showToast(`${chName}: ${done} image${done !== 1 ? 's' : ''} saved offline`, '#0d7a4e');
    } else {
      _showToast(`Download failed — check your connection`, '#c0392b');
    }
  }
}

// ── Cancel an in-progress download ──
function omCancelDownload() {
  if (_omAbortCtrl) _omAbortCtrl.abort();
  _omDownloading = false;
  _omShowProgress(false);
}

// ── Delete a chapter from offline storage ──
async function omDeleteChapter(chId) {
  if (!confirm(`Remove "${(typeof BOOK !== 'undefined' && BOOK[chId]) ? BOOK[chId].name : chId}" from offline storage?`)) return;
  await deleteChapterImages(chId);
  await saveChapterStatus(chId, { downloaded: false, imageCount: 0, lastSync: null });
  await _omRefreshPanel();
  const chName = (typeof BOOK !== 'undefined' && BOOK[chId]) ? BOOK[chId].name : chId;
  if (typeof _showToast === 'function') _showToast(`${chName} removed from offline storage`, '#c0392b');
}

// ── Progress bar ──
function _omShowProgress(show) {
  const el = document.getElementById('omProgressWrap');
  if (el) el.style.display = show ? 'block' : 'none';
}

function _omUpdateProgress(done, total, label) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const bar = document.getElementById('omProgressFill');
  const txt = document.getElementById('omProgressText');
  const lbl = document.getElementById('omProgressLabel');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = pct + '%';
  if (lbl) lbl.textContent = label || '';
}

// ── Refresh the chapter grid UI ──
async function _omRefreshPanel() {
  const panel = document.getElementById('omChapterGrid');
  if (!panel) return;

  const stats = await getStorageStats();
  const totalMB = (stats.totalBytes / (1024 * 1024)).toFixed(1);
  const usageEl = document.getElementById('omStorageUsage');
  if (usageEl) usageEl.textContent = `Used: ${totalMB} MB`;

  // Storage quota warning
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(est => {
      const used = est.usage || 0;
      const quota = est.quota || 1;
      const pct = (used / quota) * 100;
      const warn = document.getElementById('omStorageWarn');
      if (warn) {
        if (pct >= 100) {
          warn.textContent = '⛔ Storage is full!';
          warn.style.display = '';
        } else if (pct >= 80) {
          warn.textContent = `⚠️ ${pct.toFixed(0)}% of device storage used`;
          warn.style.display = '';
        } else {
          warn.style.display = 'none';
        }
      }
    });
  }

  panel.innerHTML = '';
  if (typeof BOOK === 'undefined') return;

  for (const [chId, ch] of Object.entries(BOOK)) {
    const imgs = _omGetChapterImages(chId);
    if (!imgs.length) continue;

    const chStats = stats.byChapter[chId] || { count: 0, bytes: 0 };
    const status = await getChapterStatus(chId);
    const isDownloaded = status && status.downloaded;
    const sizeMB = isDownloaded ? (chStats.bytes / (1024 * 1024)).toFixed(1) : null;
    const isActive = _omCurrentChapter === chId && _omDownloading;

    const card = document.createElement('div');
    card.className = 'om-chapter-card' + (isDownloaded ? ' om-downloaded' : '');
    card.id = 'om-card-' + chId;
    card.innerHTML = `
      <div class="om-ch-icon">${ch.icon || '📋'}</div>
      <div class="om-ch-info">
        <div class="om-ch-name">${ch.name}</div>
        <div class="om-ch-sub">${imgs.length} image${imgs.length !== 1 ? 's' : ''}${isDownloaded ? ` · ${sizeMB} MB cached` : ''}</div>
      </div>
      <div class="om-ch-actions">
        ${isDownloaded
          ? `<button class="om-btn om-btn-delete" onclick="omDeleteChapter('${chId}')">🗑 Delete</button>`
          : `<button class="om-btn om-btn-download" onclick="omDownloadChapter('${chId}')"${(_omDownloading && !isActive) ? ' disabled' : ''}>⬇ Download</button>`
        }
      </div>`;
    panel.appendChild(card);
  }
}

// ── Online / offline status badge ──
function _omUpdateStatusBadge() {
  const badge = document.getElementById('omStatusBadge');
  if (!badge) return;
  if (navigator.onLine) {
    badge.textContent = '🟢 Online';
    badge.className = 'om-status-badge om-online';
  } else {
    badge.textContent = '🔴 Offline';
    badge.className = 'om-status-badge om-offline';
  }
}

window.addEventListener('online', () => {
  _omUpdateStatusBadge();
  if (typeof _showToast === 'function') _showToast('Back online ✓', '#0d7a4e');
});
window.addEventListener('offline', () => {
  _omUpdateStatusBadge();
  if (typeof _showToast === 'function') _showToast('You are now offline', '#c8960c');
});

// ── Public init — call after page load ──
function omInit() {
  _omUpdateStatusBadge();
  _omRefreshPanel();
}

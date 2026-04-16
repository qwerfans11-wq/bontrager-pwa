// ══════════════════════════════════════════════
// VIEWER MODULE — Study Mode, Progress, Flashcards
// ══════════════════════════════════════════════

let isStudyMode = false;
let viewedPositions = JSON.parse(localStorage.getItem('bontrager_viewed_v2') || '[]');

// ═══ STUDY MODE ═══
function toggleStudyMode() {
  isStudyMode = !isStudyMode;
  const html = document.documentElement;
  
  if (isStudyMode) {
    html.classList.add('study-mode');
    hideDevTools();
    enlargeContent();
  } else {
    html.classList.remove('study-mode');
    showDevTools();
    normalizeContent();
  }
  
  localStorage.setItem('bontrager_study_mode_v1', isStudyMode);
}

function hideDevTools() {
  const devElements = document.querySelectorAll('[data-dev-only]');
  devElements.forEach(el => el.style.display = 'none');
}

function showDevTools() {
  const devElements = document.querySelectorAll('[data-dev-only]');
  devElements.forEach(el => el.style.display = '');
}

function enlargeContent() {
  document.body.style.fontSize = '120%';
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.style.padding = '30px');
}

function normalizeContent() {
  document.body.style.fontSize = '100%';
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.style.padding = '');
}

// ═══ PROGRESS TRACKING ═══
function markPositionViewed(posId) {
  const posName = posId || currentPos;
  if (!viewedPositions.includes(posName)) {
    viewedPositions.push(posName);
    localStorage.setItem('bontrager_viewed_v2', JSON.stringify(viewedPositions));
    updateProgressDisplay();
  }
}

function getChapterProgress(chapterId) {
  let count = 0;
  let total = 0;
  
  if (BOOK[chapterId]) {
    for (let subKey in BOOK[chapterId]) {
      if (BOOK[chapterId][subKey].positions) {
        BOOK[chapterId][subKey].positions.forEach(pos => {
          total++;
          if (viewedPositions.includes(pos.name)) count++;
        });
      }
    }
  }
  
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function updateProgressDisplay() {
  const chBtns = document.querySelectorAll('.ch-btn');
  chBtns.forEach(btn => {
    const chId = btn.getAttribute('data-ch');
    const progress = getChapterProgress(chId);
    const progressEl = btn.querySelector('.progress-pct');
    if (progressEl) {
      progressEl.textContent = progress + '%';
    }
  });
}

function getOverallProgress() {
  let total = 0;
  let count = 0;
  
  for (let ch in BOOK) {
    for (let subKey in BOOK[ch]) {
      if (BOOK[ch][subKey].positions) {
        BOOK[ch][subKey].positions.forEach(pos => {
          total++;
          if (viewedPositions.includes(pos.name)) count++;
        });
      }
    }
  }
  
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

// ═══ FLASHCARD SYSTEM ═══
function openFlashcard(posId) {
  // Find position in BOOK
  let posData = null;
  
  for (let ch in BOOK) {
    for (let subKey in BOOK[ch]) {
      if (BOOK[ch][subKey].positions) {
        const found = BOOK[ch][subKey].positions.find(p => p.name === (posId || currentPos));
        if (found) {
          posData = found;
          break;
        }
      }
    }
    if (posData) break;
  }
  
  if (!posData) {
    console.warn('Position not found:', posId);
    return;
  }
  
  initFlashcard(posData);
  openModal('flashcard-modal');
}

function initFlashcard(posData) {
  const fcFront = document.getElementById('fc-front');
  const fcBack = document.getElementById('fc-back');
  
  if (fcFront) {
    fcFront.innerHTML = `
      <div class="fc-type">${getPositionIcon(posData.type)} ${posData.type.toUpperCase()}</div>
      <div class="fc-name">${posData.name}</div>
      <div class="fc-hint">Tap to flip →</div>
    `;
  }
  
  if (fcBack && posData.info) {
    const info = posData.info;
    fcBack.innerHTML = `
      <div class="fc-field">
        <label>Central Ray:</label>
        <div class="fc-value">${info.cr || 'N/A'}</div>
      </div>
      <div class="fc-field">
        <label>Image Receptor:</label>
        <div class="fc-value">${info.ir || 'N/A'}</div>
      </div>
      <div class="fc-field">
        <label>SID:</label>
        <div class="fc-value">${info.sid || 'N/A'}</div>
      </div>
      <div class="fc-field">
        <label>kVp:</label>
        <div class="fc-value">${info.kv || 'N/A'}</div>
      </div>
    `;
  }
  
  // Reset flip state
  const fcCard = document.getElementById('flashcard-inner');
  if (fcCard) {
    fcCard.classList.remove('flipped');
  }
}

function toggleFlashcardFlip() {
  const fcCard = document.getElementById('flashcard-inner');
  if (fcCard) {
    fcCard.classList.toggle('flipped');
  }
}

function nextFlashcard() {
  // Navigate to next position and load its flashcard
  if (currentPos) {
    // Simple implementation: just close for now
    closeModal('flashcard-modal');
  }
}

// ═══ STATISTICS ═══
function getStatistics() {
  let positions = 0;
  let chapters = Object.keys(BOOK).length;
  
  for (let ch in BOOK) {
    for (let subKey in BOOK[ch]) {
      if (BOOK[ch][subKey].positions) {
        positions += BOOK[ch][subKey].positions.length;
      }
    }
  }
  
  return {
    chapters: chapters,
    positions: positions,
    viewed: viewedPositions.length,
    progress: getOverallProgress()
  };
}

function displayStatistics() {
  const stats = getStatistics();
  const statsDiv = document.getElementById('stats-display');
  
  if (statsDiv) {
    statsDiv.innerHTML = `
      <div class="stat-row">
        <span>Chapters:</span>
        <strong>${stats.chapters}</strong>
      </div>
      <div class="stat-row">
        <span>Positions:</span>
        <strong>${stats.positions}</strong>
      </div>
      <div class="stat-row">
        <span>Viewed:</span>
        <strong>${stats.viewed}</strong>
      </div>
      <div class="stat-row">
        <span>Progress:</span>
        <strong>${stats.progress}%</strong>
      </div>
    `;
  }
}

// ═══ INITIALIZATION ═══
function initViewerModule() {
  const savedStudyMode = localStorage.getItem('bontrager_study_mode_v1') === 'true';
  if (savedStudyMode) {
    toggleStudyMode();
  }
}

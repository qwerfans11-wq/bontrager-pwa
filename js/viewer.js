// ══════════════════════════════════════════════
// VIEWER MODULE — Flashcards & Image Display
// ══════════════════════════════════════════════

let flashcardPositions = [];
let flashcardIndex     = 0;
let flashcardFlipped   = false;

// Open flashcard mode for a list of positions
function openFlashcards(positions) {
  if (!positions || positions.length === 0) return;
  flashcardPositions = positions;
  flashcardIndex     = 0;
  flashcardFlipped   = false;
  renderFlashcard();
  openModal('flashcard-modal');
}

// Render the current flashcard (front = position photo, back = x-ray + info)
function renderFlashcard() {
  const pos = flashcardPositions[flashcardIndex];
  if (!pos) return;

  const images = getPositionImages(pos.name);

  // ── Front: positioning photo ──────────────────────────────────────────────
  const front = document.getElementById('fc-front');
  if (front) {
    if (images && images.position) {
      front.innerHTML = '<img src="' + images.position + '" alt="' + escapeHtml(pos.name) + '" '
        + 'style="max-width:100%;max-height:200px;object-fit:contain;border-radius:4px" '
        + 'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
        + '<div style="display:none;flex-direction:column;align-items:center;gap:8px">'
        + '<span style="font-size:32px">📷</span>'
        + '<span style="font-size:14px;font-weight:600">' + escapeHtml(pos.name) + '</span>'
        + '</div>';
    } else {
      front.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px">'
        + '<span style="font-size:32px">📷</span>'
        + '<span style="font-size:14px;font-weight:600">' + escapeHtml(pos.name) + '</span>'
        + '</div>';
    }
  }

  // ── Back: x-ray + technique info ─────────────────────────────────────────
  const back = document.getElementById('fc-back');
  if (back) {
    let xrayHtml = '';
    if (images && images.xray) {
      xrayHtml = '<img src="' + images.xray + '" alt="' + escapeHtml(pos.name) + ' x-ray" '
        + 'style="max-width:100%;max-height:130px;object-fit:contain;border-radius:4px;margin-bottom:8px" '
        + 'onerror="this.style.display=\'none\'">';
    }
    back.innerHTML = xrayHtml
      + '<div style="font-size:13px;font-weight:700;margin-bottom:6px">' + escapeHtml(pos.name) + '</div>'
      + '<div style="font-size:12px;color:var(--text2);margin-bottom:4px">CR: ' + escapeHtml(pos.info.cr) + '</div>'
      + '<div style="font-size:12px;color:var(--text2)">SID: ' + escapeHtml(pos.info.sid) + ' · kVp: ' + escapeHtml(pos.info.kv) + '</div>';
  }

  // Reset flip state
  flashcardFlipped = false;
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = '';
}

// Flip the flashcard between front (position) and back (x-ray)
function toggleFlashcardFlip() {
  flashcardFlipped = !flashcardFlipped;
  const inner = document.getElementById('flashcard-inner');
  if (inner) {
    inner.style.transform = flashcardFlipped ? 'rotateY(180deg)' : '';
  }
}

// Advance to the next flashcard
function nextFlashcard() {
  if (flashcardPositions.length === 0) return;
  flashcardIndex = (flashcardIndex + 1) % flashcardPositions.length;
  renderFlashcard();
}

// HTML-escape helper to prevent XSS in dynamically built strings
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}
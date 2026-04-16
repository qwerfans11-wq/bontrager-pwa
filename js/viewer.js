// ══════════════════════════════════════════════
// VIEWER MODULE — Flashcard & Modal Management
// ══════════════════════════════════════════════

let currentFlashcardPosition = null;
let fcFlipped = false;

// ═══ MODAL MANAGEMENT ═══
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// ═══ FLASHCARD ═══
function openFlashcard(position) {
  if (!position) return;
  currentFlashcardPosition = position;
  fcFlipped = false;

  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = '';

  const front = document.getElementById('fc-front');
  const back = document.getElementById('fc-back');

  if (front) {
    const imgPath = typeof getImagePath === 'function' ? getImagePath(position.name) : null;
    front.innerHTML = imgPath
      ? '<img src="' + imgPath + '" alt="' + position.name + '" style="max-width:100%;max-height:160px;object-fit:contain;border-radius:6px;margin-bottom:10px"><div style="font-size:14px;font-weight:600">' + position.name + '</div>'
      : '<div style="font-size:15px;font-weight:600;margin-bottom:8px">' + position.name + '</div><div style="font-size:12px;opacity:0.85">Tap to see technique</div>';
  }

  if (back && position.info) {
    back.innerHTML =
      '<div style="font-size:13px;font-weight:600;margin-bottom:10px">' + position.name + '</div>' +
      '<div style="font-size:12px;line-height:1.6">' +
      '<div><strong>CR:</strong> ' + (position.info.cr || '—') + '</div>' +
      '<div><strong>IR:</strong> ' + (position.info.ir || '—') + '</div>' +
      '<div><strong>SID:</strong> ' + (position.info.sid || '—') + '</div>' +
      '<div><strong>kVp:</strong> ' + (position.info.kv || '—') + '</div>' +
      '</div>';
  }

  openModal('flashcard-modal');
}

function toggleFlashcardFlip() {
  fcFlipped = !fcFlipped;
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = fcFlipped ? 'rotateY(180deg)' : '';
}

function nextFlashcard() {
  if (!currentFlashcardPosition) return;
  fcFlipped = false;
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = '';

  // Find next position in BOOK
  const positions = [];
  if (typeof BOOK !== 'undefined') {
    for (let chKey in BOOK) {
      const chapter = BOOK[chKey];
      if (chapter.positions) positions.push(...chapter.positions);
      if (chapter.subchapters) {
        for (let schKey in chapter.subchapters) {
          if (chapter.subchapters[schKey].positions) {
            positions.push(...chapter.subchapters[schKey].positions);
          }
        }
      }
    }
  }

  const idx = positions.findIndex(function(p) { return p.name === currentFlashcardPosition.name; });
  const next = positions[(idx + 1) % positions.length];
  if (next) openFlashcard(next);
}
// ══════════════════════════════════════════════
// VIEWER MODULE — Flashcard & Image Display
// ══════════════════════════════════════════════

let _fcPositions  = [];  // flat list of all positions for flashcard mode
let _fcIndex      = 0;
let _fcFlipped    = false;

// Initialise the flashcard deck from all BOOK positions and open the modal.
function initFlashcard() {
  _fcPositions = [];
  for (let chKey in BOOK) {
    const ch = BOOK[chKey];
    (ch.positions || []).forEach(pos => _fcPositions.push({ pos, chKey }));
    if (ch.subchapters) {
      for (let schKey in ch.subchapters) {
        (ch.subchapters[schKey].positions || []).forEach(pos => _fcPositions.push({ pos, chKey }));
      }
    }
  }

  // Shuffle for variety
  for (let i = _fcPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_fcPositions[i], _fcPositions[j]] = [_fcPositions[j], _fcPositions[i]];
  }

  _fcIndex   = 0;
  _fcFlipped = false;
  _renderFlashcard();
  openModal('flashcard-modal');
}

// Render the current flashcard (front = X-ray, back = position name + details).
function _renderFlashcard() {
  if (_fcPositions.length === 0) return;

  const { pos } = _fcPositions[_fcIndex];
  const images  = getPositionImages(pos.key);

  const front = document.getElementById('fc-front');
  const back  = document.getElementById('fc-back');
  if (!front || !back) return;

  // ── Front: X-ray image (or placeholder)
  if (images && images.xray) {
    front.innerHTML = `
      <div style="font-size:11px;opacity:0.8;margin-bottom:8px">What position is this?</div>
      <img src="${images.xray}" alt="X-ray"
           style="max-width:100%;max-height:190px;object-fit:contain;border-radius:6px;background:#000"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div style="display:none;flex-direction:column;align-items:center;justify-content:center;height:160px;opacity:0.7">
        <div style="font-size:40px">🩻</div>
        <div style="font-size:13px;margin-top:8px">X-ray not available</div>
      </div>
      <div style="font-size:11px;margin-top:10px;opacity:0.7">${_fcIndex + 1} / ${_fcPositions.length}</div>`;
  } else {
    front.innerHTML = `
      <div style="font-size:40px;margin-bottom:12px">🩻</div>
      <div style="font-size:16px;font-weight:600">${pos.name}</div>
      <div style="font-size:11px;margin-top:12px;opacity:0.7">${_fcIndex + 1} / ${_fcPositions.length}</div>`;
  }

  // ── Back: position photo + name + key info
  let posImgHtml = '';
  if (images && images.position) {
    posImgHtml = `<img src="${images.position}" alt="Position photo"
      style="max-width:100%;max-height:120px;object-fit:contain;border-radius:6px;margin-bottom:8px"
      onerror="this.style.display='none'">`;
  }
  back.innerHTML = `
    ${posImgHtml}
    <div style="font-weight:700;font-size:15px;text-align:center;margin-bottom:6px">${pos.name}</div>
    <div style="font-size:11px;color:var(--text2);text-align:center;margin-bottom:6px">${pos.info.desc}</div>
    <div style="font-size:11px;display:flex;flex-direction:column;gap:3px;width:100%">
      <div><strong>CR:</strong> ${pos.info.cr}</div>
      <div><strong>kVp:</strong> ${pos.info.kv} &nbsp;|&nbsp; <strong>SID:</strong> ${pos.info.sid}</div>
    </div>`;

  // Reset flip state on new card
  _fcFlipped = false;
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = 'rotateY(0deg)';
}

// Toggle the flashcard flip animation.
function toggleFlashcardFlip() {
  _fcFlipped = !_fcFlipped;
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = _fcFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}

// Advance to the next flashcard.
function nextFlashcard() {
  if (_fcPositions.length === 0) return;
  _fcIndex = (_fcIndex + 1) % _fcPositions.length;
  _renderFlashcard();
}
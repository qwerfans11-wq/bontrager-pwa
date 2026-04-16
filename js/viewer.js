// ══════════════════════════════════════════════
// VIEWER MODULE — X-ray Display & Flashcards
// ══════════════════════════════════════════════

let flashcardDeck = [];
let flashcardIndex = 0;
let flashcardFlipped = false;

// ═══ X-RAY DISPLAY ═══
function displayXray(position) {
  const xrayImg = document.getElementById('xrayImg');
  const xrayPh = document.getElementById('xrayPh');

  if (!xrayImg || !xrayPh) return;

  const images = getPositionImages(position);

  if (images.xrayImg) {
    xrayImg.style.display = 'none';
    xrayPh.style.display = 'none';

    const tempImg = new Image();
    tempImg.onload = function () {
      xrayImg.src = images.xrayImg;
      xrayImg.alt = position.name + ' X-ray';
      xrayImg.style.display = 'block';
      xrayPh.style.display = 'none';
    };
    tempImg.onerror = function () {
      xrayImg.style.display = 'none';
      xrayPh.style.display = 'block';
    };
    tempImg.src = images.xrayImg;
  } else {
    xrayImg.style.display = 'none';
    xrayPh.style.display = 'block';
  }
}

// ═══ FLASHCARD FUNCTIONS ═══
function openFlashcards(chapterKey) {
  const chapter = BOOK[chapterKey];
  if (!chapter) return;

  const positions = chapter.subchapters
    ? Object.values(chapter.subchapters).flatMap(sc => sc.positions || [])
    : (chapter.positions || []);

  if (positions.length === 0) {
    alert('No positions available for flashcards in this chapter.');
    return;
  }

  flashcardDeck = positions.slice();
  flashcardIndex = 0;
  flashcardFlipped = false;

  loadFlashcard();
  document.getElementById('flashcard-modal').classList.add('open');
}

function loadFlashcard() {
  if (flashcardDeck.length === 0) return;

  const pos = flashcardDeck[flashcardIndex];
  const fcInner = document.getElementById('flashcard-inner');
  const fcFront = document.getElementById('fc-front');
  const fcBack = document.getElementById('fc-back');

  if (!fcFront || !fcBack) return;

  // Reset flip state
  flashcardFlipped = false;
  if (fcInner) fcInner.style.transform = '';

  // Front: X-ray image
  const images = getPositionImages(pos);
  if (images.xrayImg) {
    fcFront.innerHTML = '';
    const img = document.createElement('img');
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:8px';
    img.alt = pos.name + ' X-ray';
    img.onerror = function () {
      fcFront.innerHTML = '<div style="font-size:40px">🩻</div><div style="font-size:14px;margin-top:8px">X-ray image</div><div style="font-size:11px;opacity:0.7;margin-top:4px">Tap to reveal name</div>';
    };
    img.src = images.xrayImg;
    fcFront.appendChild(img);
    const hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:11px;opacity:0.8;color:white;text-shadow:0 1px 2px rgba(0,0,0,0.5)';
    hint.textContent = 'Tap to reveal name';
    fcFront.style.position = 'relative';
    fcFront.appendChild(hint);
  } else {
    fcFront.innerHTML = '<div style="font-size:40px">🩻</div><div style="font-size:14px;margin-top:8px">X-ray image</div><div style="font-size:11px;opacity:0.7;margin-top:4px">Tap to reveal name</div>';
  }

  // Back: position name and key info
  const badge = pos.type === 'routine' ? '🔵 Routine' : '⭐ Special';
  fcBack.innerHTML = `
    <div style="font-size:13px;opacity:0.6;margin-bottom:6px">${badge}</div>
    <div style="font-size:18px;font-weight:700;margin-bottom:10px;line-height:1.3">${pos.name}</div>
    <div style="font-size:12px;opacity:0.8;line-height:1.5">
      <div><strong>CR:</strong> ${pos.info.cr}</div>
      <div style="margin-top:4px"><strong>IR:</strong> ${pos.info.ir}</div>
    </div>
  `;
}

function toggleFlashcardFlip() {
  const fcInner = document.getElementById('flashcard-inner');
  if (!fcInner) return;
  flashcardFlipped = !flashcardFlipped;
  fcInner.style.transform = flashcardFlipped ? 'rotateY(180deg)' : '';
}

function nextFlashcard() {
  if (flashcardDeck.length === 0) return;
  flashcardIndex = (flashcardIndex + 1) % flashcardDeck.length;
  loadFlashcard();
}

// ═══ MODAL HELPERS ═══
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}
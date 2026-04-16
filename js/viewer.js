// ══════════════════════════════════════════════
// VIEWER MODULE — Modals, Flashcards & Position Images
// ══════════════════════════════════════════════

// ═══ MODAL HELPERS ═══
function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ═══ FLASHCARD ═══
var _flashcards = [];
var _flashcardIndex = 0;
var _flashcardFlipped = false;

function openFlashcard(position, chapterName) {
  _flashcards = [position];
  _flashcardIndex = 0;
  _flashcardFlipped = false;
  _renderFlashcard();
  openModal('flashcard-modal');
}

function _renderFlashcard() {
  var pos = _flashcards[_flashcardIndex];
  if (!pos) return;

  _flashcardFlipped = false;
  var inner = document.getElementById('flashcard-inner');
  if (inner) inner.style.transform = 'rotateY(0deg)';

  // Front: position name + X-ray image if available
  var front = document.getElementById('fc-front');
  if (front) {
    var xrayHtml = '';
    if (pos.xray) {
      xrayHtml = '<img src="' + pos.xray + '" alt="X-ray" style="max-width:100%;max-height:140px;object-fit:contain;border-radius:4px;margin-bottom:10px" onerror="this.style.display=\'none\'">';
    }
    front.innerHTML = xrayHtml +
      '<div style="font-size:16px;font-weight:700">' + pos.name + '</div>' +
      '<div style="font-size:12px;margin-top:6px;opacity:0.8">Tap to see technique</div>';
  }

  // Back: technical details
  var back = document.getElementById('fc-back');
  if (back) {
    var info = pos.info || {};
    back.innerHTML =
      '<div style="font-size:13px;font-weight:700;margin-bottom:8px">' + pos.name + '</div>' +
      '<div style="font-size:12px;line-height:1.6">' +
        '<div><b>CR:</b> ' + (info.cr || '—') + '</div>' +
        '<div><b>IR:</b> ' + (info.ir || '—') + '</div>' +
        '<div><b>SID:</b> ' + (info.sid || '—') + '</div>' +
        '<div><b>kVp:</b> ' + (info.kv || '—') + '</div>' +
        '<div><b>Resp:</b> ' + (info.resp || '—') + '</div>' +
      '</div>';
  }
}

function toggleFlashcardFlip() {
  _flashcardFlipped = !_flashcardFlipped;
  var inner = document.getElementById('flashcard-inner');
  if (inner) {
    inner.style.transform = _flashcardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }
}

function nextFlashcard() {
  if (_flashcards.length === 0) return;
  _flashcardIndex = (_flashcardIndex + 1) % _flashcards.length;
  _renderFlashcard();
}

// ═══ POSITION IMAGE DISPLAY ═══
function displayPositionImage(position) {
  var imgEl = document.getElementById('posImg');
  var phEl = document.getElementById('posImgPh');
  var wrapEl = document.getElementById('posImgWrap');

  if (!imgEl) return;

  var imgPath = (position && position.img) ? position.img : getImagePath(position && position.name);

  if (imgPath) {
    imgEl.src = imgPath;
    imgEl.style.display = 'block';
    imgEl.onerror = function () {
      imgEl.style.display = 'none';
      if (phEl) phEl.style.display = 'flex';
    };
    if (phEl) phEl.style.display = 'none';
    if (wrapEl) wrapEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
    if (phEl) phEl.style.display = 'flex';
    if (wrapEl) wrapEl.style.display = 'block';
  }
}

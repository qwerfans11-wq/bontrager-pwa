// ══════════════════════════════════════════════
// UI MODULE — Theme, Font, & UI Controls
// ══════════════════════════════════════════════

let isLargeTextMode = localStorage.getItem('bontrager_large_text_v1') === 'true';

// Initialize UI features
function initUI() {
  // Apply large text if enabled
  if (isLargeTextMode) {
    document.documentElement.style.setProperty('--base-fs', '18px');
    const toggle = document.getElementById('largeToggle');
    if (toggle) toggle.classList.add('on');
  }
}

// Toggle large text mode
function toggleLarge() {
  isLargeTextMode = !isLargeTextMode;
  localStorage.setItem('bontrager_large_text_v1', isLargeTextMode);
  
  if (isLargeTextMode) {
    document.documentElement.style.setProperty('--base-fs', '18px');
    document.getElementById('largeToggle').classList.add('on');
  } else {
    document.documentElement.style.setProperty('--base-fs', '15px');
    document.getElementById('largeToggle').classList.remove('on');
  }
}

// ─── MODAL HELPERS ───
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initUI);

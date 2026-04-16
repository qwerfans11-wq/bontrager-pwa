// ══════════════════════════════════════════════
// ZOOM MODULE — Image Zoom/Pan with Touch Support
// ══════════════════════════════════════════════

const _zoom = {
  panX: 0,
  panY: 0,
  scale: 1,
  minScale: 1,
  maxScale: 4,
  initialDistance: 0,
  initialScale: 1,
  isDragging: false,
  lastX: 0,
  lastY: 0
};

// ═══ OPEN ZOOM ═══
function openImgZoom(imageSrc) {
  const modal = document.getElementById('img-zoom-modal');
  if (!modal) {
    console.warn('Zoom modal not found');
    return;
  }
  
  const zoomImg = document.getElementById('zoomImg');
  if (zoomImg) {
    zoomImg.src = imageSrc;
    zoomImg.onload = () => {
      resetZoom();
      _zoomBindEvents();
    };
  }
  
  openModal('img-zoom-modal');
}

function closeImgZoom() {
  _zoomUnbindEvents();
  closeModal('img-zoom-modal');
}

// ═══ ZOOM RESET ═══
function resetZoom() {
  _zoom.panX = 0;
  _zoom.panY = 0;
  _zoom.scale = 1;
  _applyZoom(1, 0, 0);
}

// ═══ ZOOM CONTROLS ═══
function _zoomIn() {
  if (_zoom.scale < _zoom.maxScale) {
    _zoom.scale = Math.min(_zoom.scale + 0.2, _zoom.maxScale);
    _applyZoom(_zoom.scale, _zoom.panX, _zoom.panY);
  }
}

function _zoomOut() {
  if (_zoom.scale > _zoom.minScale) {
    _zoom.scale = Math.max(_zoom.scale - 0.2, _zoom.minScale);
    _applyZoom(_zoom.scale, _zoom.panX, _zoom.panY);
  }
}

// ═══ APPLY ZOOM ═══
function _applyZoom(scale, panX, panY) {
  const zoomImg = document.getElementById('zoomImg');
  if (!zoomImg) return;
  
  const clampedPan = _clampPan(panX, panY);
  zoomImg.style.transform = `scale(${scale}) translate(${clampedPan.x}px, ${clampedPan.y}px)`;
  
  _zoom.panX = clampedPan.x;
  _zoom.panY = clampedPan.y;
  _zoom.scale = scale;
}

// ═══ PAN CLAMPING ═══
function _clampPan(x, y) {
  const maxPan = 100 * (_zoom.scale - 1);
  return {
    x: Math.max(-maxPan, Math.min(maxPan, x)),
    y: Math.max(-maxPan, Math.min(maxPan, y))
  };
}

// ═══ EVENT BINDING ═══
function _zoomBindEvents() {
  const zoomImg = document.getElementById('zoomImg');
  if (!zoomImg) return;
  
  // Touch events
  zoomImg.addEventListener('touchstart', _onTouchStart, false);
  zoomImg.addEventListener('touchmove', _onTouchMove, false);
  zoomImg.addEventListener('touchend', _onTouchEnd, false);
  
  // Mouse events
  zoomImg.addEventListener('mousedown', _onMouseDown, false);
  zoomImg.addEventListener('mousemove', _onMouseMove, false);
  zoomImg.addEventListener('mouseup', _onMouseUp, false);
  zoomImg.addEventListener('wheel', _onWheel, false);
  
  // Double tap
  zoomImg.addEventListener('dblclick', () => resetZoom(), false);
}

function _zoomUnbindEvents() {
  const zoomImg = document.getElementById('zoomImg');
  if (!zoomImg) return;
  
  zoomImg.removeEventListener('touchstart', _onTouchStart);
  zoomImg.removeEventListener('touchmove', _onTouchMove);
  zoomImg.removeEventListener('touchend', _onTouchEnd);
  zoomImg.removeEventListener('mousedown', _onMouseDown);
  zoomImg.removeEventListener('mousemove', _onMouseMove);
  zoomImg.removeEventListener('mouseup', _onMouseUp);
  zoomImg.removeEventListener('wheel', _onWheel);
  zoomImg.removeEventListener('dblclick', resetZoom);
}

// ═══ TOUCH EVENTS ═══
function _onTouchStart(e) {
  if (e.touches.length === 2) {
    // Pinch gesture
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    
    _zoom.initialDistance = Math.sqrt(dx * dx + dy * dy);
    _zoom.initialScale = _zoom.scale;
  } else if (e.touches.length === 1) {
    // Single touch pan
    _zoom.isDragging = true;
    _zoom.lastX = e.touches[0].clientX;
    _zoom.lastY = e.touches[0].clientY;
  }
}

function _onTouchMove(e) {
  if (e.touches.length === 2) {
    // Pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scale = _zoom.initialScale * (distance / _zoom.initialDistance);
    _zoom.scale = Math.max(_zoom.minScale, Math.min(_zoom.maxScale, scale));
    _applyZoom(_zoom.scale, _zoom.panX, _zoom.panY);
  } else if (_zoom.isDragging && e.touches.length === 1) {
    // Drag pan
    const moveX = e.touches[0].clientX - _zoom.lastX;
    const moveY = e.touches[0].clientY - _zoom.lastY;
    
    _zoom.lastX = e.touches[0].clientX;
    _zoom.lastY = e.touches[0].clientY;
    
    _applyZoom(_zoom.scale, _zoom.panX + moveX, _zoom.panY + moveY);
  }
}

function _onTouchEnd(e) {
  _zoom.isDragging = false;
  if (e.touches.length === 0) {
    _zoom.initialDistance = 0;
  }
}

// ═══ MOUSE EVENTS ═══
function _onMouseDown(e) {
  _zoom.isDragging = true;
  _zoom.lastX = e.clientX;
  _zoom.lastY = e.clientY;
}

function _onMouseMove(e) {
  if (!_zoom.isDragging) return;
  
  const moveX = e.clientX - _zoom.lastX;
  const moveY = e.clientY - _zoom.lastY;
  
  _zoom.lastX = e.clientX;
  _zoom.lastY = e.clientY;
  
  _applyZoom(_zoom.scale, _zoom.panX + moveX, _zoom.panY + moveY);
}

function _onMouseUp(e) {
  _zoom.isDragging = false;
}

function _onWheel(e) {
  e.preventDefault();
  
  if (e.deltaY < 0) {
    _zoomIn();
  } else {
    _zoomOut();
  }
}

// ═══ UI BUTTONS ═══
function zoomInBtn() {
  _zoomIn();
}

function zoomOutBtn() {
  _zoomOut();
}

function zoomResetBtn() {
  resetZoom();
}

// ═══ STATE ═══
function getZoomState() {
  return {
    scale: _zoom.scale,
    panX: _zoom.panX,
    panY: _zoom.panY
  };
}

function setZoomState(state) {
  _zoom.scale = state.scale;
  _zoom.panX = state.panX;
  _zoom.panY = state.panY;
  _applyZoom(_zoom.scale, _zoom.panX, _zoom.panY);
}

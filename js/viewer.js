// Returns the image path for a position name, or null if not found
function getImagePath(posName) {
  if (!posName || typeof POSITION_IMAGES === 'undefined') return null;
  return POSITION_IMAGES[posName] || null;
}

// Displays the positioning photo for a given position name
function displayPositionImage(posName) {
  const imgEl = document.getElementById('posImg');
  const phEl = document.getElementById('posImgPh');
  if (!imgEl || !phEl) return;

  const path = getImagePath(posName);
  if (path) {
    imgEl.src = path;
    imgEl.alt = posName;
    imgEl.style.display = 'block';
    phEl.style.display = 'none';
  } else {
    imgEl.src = '';
    imgEl.style.display = 'none';
    phEl.style.display = 'block';
  }
}
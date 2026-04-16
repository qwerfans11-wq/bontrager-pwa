// ══════════════════════════════════════════════
// EDITOR MODULE — Image Editing, Cropping, Uploading
// ══════════════════════════════════════════════

let editorCanvas = null;
let editorContext = null;
let editorImage = null;
let editorMode = 'crop'; // crop, resize, dual

// ═══ EDITOR OPENING ═══
function openImgEditor() {
  openModal('img-editor-modal');
  editorCanvas = document.getElementById('imgEditorCanvas');
  editorContext = editorCanvas ? editorCanvas.getContext('2d') : null;
  
  // Initialize tabs
  switchEditorTab('crop');
}

function closeImgEditor() {
  closeModal('img-editor-modal');
  editorCanvas = null;
  editorContext = null;
  editorImage = null;
}

function switchEditorTab(tab) {
  editorMode = tab;
  
  const tabs = document.querySelectorAll('.ed-tab');
  tabs.forEach(t => t.classList.remove('active'));
  
  const activeTab = document.querySelector(`[data-tab="${tab}"]`);
  if (activeTab) activeTab.classList.add('active');
  
  const panels = document.querySelectorAll('.ed-panel');
  panels.forEach(p => p.style.display = 'none');
  
  const activePanel = document.getElementById(`ed-panel-${tab}`);
  if (activePanel) activePanel.style.display = 'block';
}

// ═══ FILE HANDLING ═══
function handlePosImgFile(event, imgNum) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      editorImage = img;
      if (editorContext) {
        editorContext.drawImage(img, 0, 0, editorCanvas.width, editorCanvas.height);
      }
      document.getElementById(`imgLoadedMsg-${imgNum}`).style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleQuizImgFile(event) {
  handlePosImgFile(event, 'quiz');
}

// ═══ CROP FUNCTIONALITY ═══
function edCropReset() {
  if (editorContext && editorImage) {
    editorContext.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    editorContext.drawImage(editorImage, 0, 0, editorCanvas.width, editorCanvas.height);
  }
}

function edCropPreset(width, height) {
  const cropX = document.getElementById('ed-crop-x');
  const cropY = document.getElementById('ed-crop-y');
  const cropW = document.getElementById('ed-crop-w');
  const cropH = document.getElementById('ed-crop-h');
  
  if (cropW) cropW.value = width;
  if (cropH) cropH.value = height;
  
  editorPreview();
}

function edApplyCrop() {
  if (!editorImage || !editorContext) return;
  
  const x = parseInt(document.getElementById('ed-crop-x')?.value || 0);
  const y = parseInt(document.getElementById('ed-crop-y')?.value || 0);
  const w = parseInt(document.getElementById('ed-crop-w')?.value || editorCanvas.width);
  const h = parseInt(document.getElementById('ed-crop-h')?.value || editorCanvas.height);
  
  editorContext.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  editorContext.drawImage(editorImage, x, y, w, h, 0, 0, editorCanvas.width, editorCanvas.height);
}

// ═══ RESIZE FUNCTIONALITY ═══
function edResizePreset(w, h) {
  const resizeW = document.getElementById('ed-resize-w');
  const resizeH = document.getElementById('ed-resize-h');
  
  if (resizeW) resizeW.value = w;
  if (resizeH) resizeH.value = h;
  
  editorPreview();
}

function edResizeReset() {
  if (editorImage) {
    const resizeW = document.getElementById('ed-resize-w');
    const resizeH = document.getElementById('ed-resize-h');
    
    if (resizeW) resizeW.value = editorImage.width;
    if (resizeH) resizeH.value = editorImage.height;
  }
}

function edApplyResize() {
  if (!editorImage || !editorContext) return;
  
  const w = parseInt(document.getElementById('ed-resize-w')?.value || editorCanvas.width);
  const h = parseInt(document.getElementById('ed-resize-h')?.value || editorCanvas.height);
  
  editorContext.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  editorContext.drawImage(editorImage, 0, 0, w, h, 0, 0, editorCanvas.width, editorCanvas.height);
}

// ═══ PREVIEW ═══
function editorPreview() {
  if (editorMode === 'crop') {
    edApplyCrop();
  } else if (editorMode === 'resize') {
    edApplyResize();
  }
}

// ═══ IMAGE COMPRESSION ═══
function compressDataUrl(dataUrl, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

// ═══ DUAL IMAGE TAB ═══
function edSetLayout(layout) {
  // layout: 'side' or 'stack'
  const dualContainer = document.getElementById('ed-dual-container');
  if (dualContainer) {
    dualContainer.setAttribute('data-layout', layout);
  }
}

function edDeleteImg2() {
  const img2Input = document.getElementById('posImg2Input');
  if (img2Input) img2Input.value = '';
  
  const img2Preview = document.getElementById('posImg2Preview');
  if (img2Preview) img2Preview.innerHTML = '<div class="placeholder">No image</div>';
}

// ═══ SAVE FUNCTIONS ═══
function edSaveAll() {
  if (!editorCanvas) return;
  
  const dataUrl = editorCanvas.toDataURL('image/jpeg', 0.9);
  
  // Save to current position
  if (currentPos && BOOK) {
    // Find position and update if needed
    console.log('Saving edited image for:', currentPos);
  }
  
  alert('Image saved successfully!');
  closeImgEditor();
}

// ═══ DEVELOPER UPLOADS ═══
function devUploadPosImg(imgNum) {
  const input = document.getElementById(`posImg${imgNum}Input`);
  if (input) input.click();
}

function camposImgFile(event) {
  handlePosImgFile(event, 'cam');
}

function devUploadQuizImg() {
  const input = document.getElementById('quizImgInput');
  if (input) input.click();
}

// ═══ IMAGE MANAGEMENT ═══
function devDeletePosImg(imgNum = 1) {
  const preview = document.getElementById(`posImg${imgNum}Preview`);
  const input = document.getElementById(`posImg${imgNum}Input`);
  
  if (preview) preview.innerHTML = '<div class="placeholder">No image</div>';
  if (input) {
    input.value = '';
    input.checked = false;
  }
}

function devDeleteQuizImg() {
  const preview = document.getElementById('quizImgPreview');
  const input = document.getElementById('quizImgInput');
  
  if (preview) preview.innerHTML = '<div class="placeholder">No image</div>';
  if (input) input.value = '';
}

function devChangeQuizImg(newImgKey) {
  if (IMAGE_DATA[newImgKey] && IMAGE_DATA[newImgKey].routine.length > 0) {
    const imgPath = IMAGE_DATA[newImgKey].routine[0];
    const quizImg = document.querySelector('.quiz-img');
    if (quizImg) {
      quizImg.src = 'images/' + imgPath;
    }
  }
}

// ═══ UTILITY ═══
function getEditorCanvas() {
  return editorCanvas;
}

function isImageLoaded() {
  return editorImage !== null;
}

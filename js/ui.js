// js/ui.js — UI components: font settings, dialogs, image editor, and image zoom


// ══════════════════════════════════════════════
// CLOSE CONFIRMATION WITH DUA
// ══════════════════════════════════════════════
var _allowCloseOnce = false;
var _bypassExitInterceptOnce = false;
function _shouldWarnOnClose(){
  const quizBusy = (typeof _quizActive !== 'undefined') && !!_quizActive;
  const devBusy = (typeof userRole !== 'undefined') && userRole === 'developer';
  return quizBusy || devBusy;
}

window.addEventListener('beforeunload', function(e){
  if(_allowCloseOnce){
    _allowCloseOnce = false;
    return;
  }
  if((typeof devSaveData === 'function') && (typeof userRole !== 'undefined') && userRole === 'developer'){
    devSaveData();
  }
  if(!_shouldWarnOnClose()) return;
  e.preventDefault();
  e.returnValue = '';
  return '';
});

function _closeExitDialog(){
  const dialog = document.getElementById('_exitDialog');
  if(dialog) dialog.remove();
}

function _confirmAppExit(){
  _allowCloseOnce = true;
  _bypassExitInterceptOnce = true;
  _closeExitDialog();

  // Best-effort multi-platform exit flow (desktop browsers, PWA shells, WebViews).
  const _tryCloseNow = () => {
    try{ window.open('', '_self'); }catch(err){}
    try{ window.close(); }catch(err){}

    // Common WebView/Cordova bridges if present.
    try{
      if(window.Android && typeof window.Android.exitApp === 'function'){
        window.Android.exitApp();
      }
    }catch(err){}
    try{
      if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.exitApp){
        window.webkit.messageHandlers.exitApp.postMessage('exit');
      }
    }catch(err){}
    try{
      if(navigator.app && typeof navigator.app.exitApp === 'function'){
        navigator.app.exitApp();
      }
    }catch(err){}
  };

  const _hardBlankFallback = () => {
    // If the browser blocks true app close, leave a non-interactive blank page.
    try{ document.documentElement.innerHTML = '<head><title>Closed</title></head><body style="margin:0;background:#000"></body>'; }catch(err){}
    try{ document.body.style.pointerEvents = 'none'; }catch(err){}
    try{ window.stop(); }catch(err){}
    try{ location.replace('about:blank'); }catch(err){}
  };

  _tryCloseNow();

  // Retry shortly because some hosts only honor close after a tick.
  setTimeout(_tryCloseNow, 40);

  // Try to leave history stack in case close is blocked.
  setTimeout(()=>{
    try{ history.back(); }catch(err){}
    try{ history.go(-1); }catch(err){}
  },80);

  // Final forced fallback.
  setTimeout(_hardBlankFallback, 220);
}

// Custom exit dialog (shown by back button / manual close trigger)
function _showExitDialog() {
  const existing = document.getElementById("_exitDialog");
  if(existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "_exitDialog";
  overlay.style.cssText = [
    "position:fixed","top:0","left:0","width:100%","height:100%",
    "background:rgba(0,0,0,0.72)","z-index:99999",
    "display:flex","align-items:center","justify-content:center",
    "padding:20px","box-sizing:border-box","backdrop-filter:blur(6px)",
    "animation:_exitFadeIn .2s ease"
  ].join(";");
  overlay.innerHTML = `
    <style>
    @keyframes _exitFadeIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    @keyframes _exitPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
    ._exit-card{
      background:var(--bg);border-radius:22px;padding:0;
      max-width:360px;width:100%;box-shadow:0 24px 80px rgba(0,0,0,.5);
      border:1px solid var(--border);overflow:hidden;
      animation:_exitFadeIn .22s ease;
    }
    ._exit-header{
      background:linear-gradient(135deg,#1e3a6e 0%,#0a1628 100%);
      padding:24px 24px 20px;text-align:center;
      border-bottom:1px solid rgba(255,255,255,.08);
    }
    ._exit-emoji{font-size:42px;display:block;margin-bottom:10px;animation:_exitPulse 2s infinite}
    ._exit-title{font-size:18px;font-weight:800;color:#e8f0fe;letter-spacing:-.02em;margin-bottom:4px}
    ._exit-subtitle{font-size:12.5px;color:rgba(232,240,254,.6);line-height:1.5}
    ._exit-body{padding:20px 22px}
    ._exit-dua-label{
      font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;
      color:var(--accent);margin-bottom:10px;display:flex;align-items:center;gap:6px;
    }
    ._exit-dua-label::before{content:'';flex:1;height:1px;background:var(--border)}
    ._exit-dua-label::after{content:'';flex:1;height:1px;background:var(--border)}
    ._exit-dua-box{
      background:linear-gradient(135deg,var(--accent-bg),var(--bg2));
      border:1px solid var(--border);border-radius:16px;
      padding:16px 18px;margin-bottom:16px;text-align:center;
      position:relative;overflow:hidden;
    }
    ._exit-dua-box::before{
      content:'❝';position:absolute;top:6px;left:12px;
      font-size:28px;color:var(--accent);opacity:.15;font-family:serif;
    }
    ._exit-dua-text{
      font-size:14.5px;font-weight:600;color:var(--text);
      line-height:2.1;margin:0;direction:rtl;
    }
    ._exit-dua-text span{color:var(--accent);font-weight:800}
    ._exit-ameen{
      font-size:12px;color:var(--text3);margin-top:8px;
      display:flex;align-items:center;justify-content:center;gap:5px;
    }
    ._exit-actions{display:flex;gap:10px;padding:0 22px 22px}
    ._exit-btn{
      flex:1;padding:14px;border-radius:50px;font-size:14px;font-weight:700;
      cursor:pointer;font-family:var(--font);transition:all .15s;border:none;
      display:flex;align-items:center;justify-content:center;gap:6px;
    }
    ._exit-btn-stay{
      background:var(--bg2);color:var(--text);
      border:1.5px solid var(--border2)!important;border:none;
    }
    ._exit-btn-stay:hover{background:var(--bg3)}
    ._exit-btn-close{
      background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;
    }
    ._exit-btn-close:hover{opacity:.9;transform:scale(1.02)}
    </style>
    <div class="_exit-card">
      <div class="_exit-header">
        <span class="_exit-emoji">🚪</span>
        <div class="_exit-title">Do you want to close the app?</div>
        <div class="_exit-subtitle">One moment before you leave…</div>
      </div>
      <div class="_exit-body">
        <div class="_exit-dua-label">A heartfelt prayer</div>
        <div class="_exit-dua-box">
          <p class="_exit-dua-text">
            اللهم <span>وفّق</span> صاحب هذا التطبيق في دراسته وعمله،<br>
            وأدم عليه <span>الصحة والعافية</span> في جسده وعقله،<br>
            واجعل هذا العمل في <span>ميزان حسناته</span> يوم القيامة،<br>
            وارزقه <span>النجاح</span> في الدنيا والفوز في الآخرة.
          </p>
          <div class="_exit-ameen">🤲 آمين يا ربَّ العالمين 🤲</div>
        </div>
      </div>
      <div class="_exit-actions">
        <button class="_exit-btn _exit-btn-stay" id="_exitStayBtn">
          📖 Stay here
        </button>
        <button class="_exit-btn _exit-btn-close" id="_exitCloseBtn">
          Close ✕
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const stayBtn = document.getElementById('_exitStayBtn');
  const closeBtn = document.getElementById('_exitCloseBtn');
  if(stayBtn) stayBtn.addEventListener('click', _closeExitDialog);
  if(closeBtn) closeBtn.addEventListener('click', _confirmAppExit);
  overlay.addEventListener('click',e=>{ if(e.target===overlay) _closeExitDialog(); });
}

// Intercept Android/iOS back button to show exit dialog
(function(){
  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", function() {
    if(_bypassExitInterceptOnce){
      _bypassExitInterceptOnce = false;
      return;
    }
    window.history.pushState(null, "", window.location.href);
    _showExitDialog();
  });
})();

// ══════════════════════════════════════════════
// AUTH — credentials stored as SHA-256 hashes only
// SHA-256("Qutaiba")    = e11bec3e4a9e13ab8f92cee667e006c8f1bc82dcc3e4389f6cf001bd91c4f3e3
// SHA-256("2006-02-20") = b76819a2cac461de5cb8ae880ad00d010767c3c7bc4f0ef8e743d00571b79c62
// ══════════════════════════════════════════════
const _UH='e11bec3e4a9e13ab8f92cee667e006c8f1bc82dcc3e4389f6cf001bd91c4f3e3';
const _PH='b76819a2cac461de5cb8ae880ad00d010767c3c7bc4f0ef8e743d00571b79c62';
async function _hash(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}
async function _chkCreds(u,p){const[uh,ph]=await Promise.all([_hash(u),_hash(p)]);return uh===_UH&&ph===_PH;}

function setAppFont(fontValue){
  document.documentElement.style.setProperty('--font', fontValue);
}

function setAppFontWeight(weightValue){
  document.documentElement.style.setProperty('--font-weight', weightValue);
}

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 24;
const FONT_SIZE_DEFAULT = 15;
const LARGE_FONT_DELTA = 2;
const FLASHCARD_FONT_SIZE_MIN = 12;
const FLASHCARD_FONT_SIZE_MAX = 26;
const FLASHCARD_FONT_SIZE_DEFAULT = 16;
const MOBILE_FONT_EFFECTIVE_MAX = 18;
const MOBILE_FLASHCARD_FONT_MAX = 20;

function _isNarrowViewport(){
  try{
    return window.matchMedia('(max-width: 480px)').matches;
  }catch(e){
    return window.innerWidth <= 480;
  }
}

function _normalizeFontSize(value, fallback = FONT_SIZE_DEFAULT){
  const parsed = parseInt(value, 10);
  if(Number.isNaN(parsed)) return fallback;
  return Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, parsed));
}

function _normalizeFlashcardFontSize(value, fallback = FLASHCARD_FONT_SIZE_DEFAULT){
  const parsed = parseInt(value, 10);
  if(Number.isNaN(parsed)) return fallback;
  return Math.max(FLASHCARD_FONT_SIZE_MIN, Math.min(FLASHCARD_FONT_SIZE_MAX, parsed));
}

function _isLargeModeEnabled(){
  try{
    if(localStorage.getItem('bontrager_large_v1') === '1') return true;
  }catch(e){}
  const toggle = document.getElementById('largeToggle');
  return !!(toggle && toggle.classList.contains('on'));
}

function _getStoredBaseFontSize(){
  try{
    const raw = localStorage.getItem('appFontSize');
    if(raw === null) return FONT_SIZE_DEFAULT;
    return _normalizeFontSize(raw);
  }catch(e){
    return FONT_SIZE_DEFAULT;
  }
}

function _getStoredFlashcardFontSize(){
  try{
    const raw = localStorage.getItem('appFlashcardFontSize');
    if(raw === null) return FLASHCARD_FONT_SIZE_DEFAULT;
    return _normalizeFlashcardFontSize(raw);
  }catch(e){
    return FLASHCARD_FONT_SIZE_DEFAULT;
  }
}

function _syncFontSizeInput(baseSize){
  const input = document.getElementById('fontSizeInput');
  if(input && document.activeElement !== input){
    input.value = String(baseSize);
  }
}

function _syncFlashcardFontSizeInput(size){
  const input = document.getElementById('flashcardFontSizeInput');
  if(input && document.activeElement !== input){
    input.value = String(size);
  }
}

function setAppFontSize(sizeValue){
  let baseSize = _normalizeFontSize(sizeValue);
  let effectiveSize = _isLargeModeEnabled()
    ? Math.min(baseSize + LARGE_FONT_DELTA, FONT_SIZE_MAX + LARGE_FONT_DELTA)
    : baseSize;

  if(_isNarrowViewport()){
    effectiveSize = Math.min(effectiveSize, MOBILE_FONT_EFFECTIVE_MAX);
    baseSize = Math.min(baseSize, MOBILE_FONT_EFFECTIVE_MAX);
  }

  const scale = effectiveSize / FONT_SIZE_DEFAULT;

  document.documentElement.style.setProperty('--base-fs', effectiveSize + 'px');
  document.documentElement.style.setProperty('--font-scale', scale.toFixed(4));
  document.body.style.fontSize = effectiveSize + 'px';
  _syncFontSizeInput(baseSize);
  return { baseSize, effectiveSize };
}

function setFlashcardFontSize(sizeValue){
  let size = _normalizeFlashcardFontSize(sizeValue);
  if(_isNarrowViewport()){
    size = Math.min(size, MOBILE_FLASHCARD_FONT_MAX);
  }
  const scale = size / FLASHCARD_FONT_SIZE_DEFAULT;
  document.documentElement.style.setProperty('--fc-font-scale', scale.toFixed(4));
  _syncFlashcardFontSizeInput(size);
  return size;
}

function setAppTextColor(colorValue){
  document.documentElement.style.setProperty('--text', colorValue);
}

function onFontChange(){
  const fontSelect = document.getElementById('fontSelect');
  if(!fontSelect) return;
  const fontValue = fontSelect.value;
  setAppFont(fontValue);
  localStorage.setItem('appFontFamily', fontValue);
}

function onFontWeightChange(){
  const weightSelect = document.getElementById('fontWeightSelect');
  if(!weightSelect) return;
  const weightValue = weightSelect.value;
  setAppFontWeight(weightValue);
  localStorage.setItem('appFontWeight', weightValue);
}

function onFontSizeChange(){
  const input = document.getElementById('fontSizeInput');
  if(!input) return;
  const sizeValue = _normalizeFontSize(input.value);
  const applied = setAppFontSize(sizeValue);
  input.value = String(applied.baseSize);
  localStorage.setItem('appFontSize', String(applied.baseSize));
}

function onFlashcardFontSizeChange(){
  const input = document.getElementById('flashcardFontSizeInput');
  if(!input) return;
  const sizeValue = _normalizeFlashcardFontSize(input.value);
  const appliedSize = setFlashcardFontSize(sizeValue);
  input.value = String(appliedSize);
  localStorage.setItem('appFlashcardFontSize', String(appliedSize));
}

let _responsiveFontResizeTimer=0;
function _bindResponsiveFontSizing(){
  if(typeof window==='undefined') return;
  window.addEventListener('resize', ()=>{
    clearTimeout(_responsiveFontResizeTimer);
    _responsiveFontResizeTimer=setTimeout(()=>{
      setAppFontSize(_getStoredBaseFontSize());
      setFlashcardFontSize(_getStoredFlashcardFontSize());
    },120);
  }, {passive:true});
}

function onTextColorChange(){
  const textColorPicker = document.getElementById('textColorPicker');
  if(!textColorPicker) return;
  const colorValue = textColorPicker.value;
  setAppTextColor(colorValue);
  localStorage.setItem('appTextColor', colorValue);
}

const FLASHCARD_DEFAULT_COLORS = Object.freeze({
  front1: '#2f6f9f',
  front2: '#27496d',
  back1: '#1f8a70',
  back2: '#146c5b'
});

function _isHexColor(value){
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim());
}

function _applyFlashcardTheme(colors){
  const root = document.documentElement;
  root.style.setProperty('--fc-front-1', colors.front1);
  root.style.setProperty('--fc-front-2', colors.front2);
  root.style.setProperty('--fc-back-1', colors.back1);
  root.style.setProperty('--fc-back-2', colors.back2);
}

function _syncFlashcardColorInputs(colors){
  const fcFront1 = document.getElementById('fcFront1');
  const fcFront2 = document.getElementById('fcFront2');
  const fcBack1 = document.getElementById('fcBack1');
  const fcBack2 = document.getElementById('fcBack2');
  if(fcFront1) fcFront1.value = colors.front1;
  if(fcFront2) fcFront2.value = colors.front2;
  if(fcBack1) fcBack1.value = colors.back1;
  if(fcBack2) fcBack2.value = colors.back2;
}

function _loadFlashcardTheme(){
  const storedFront1 = localStorage.getItem('appFlashcardFront1');
  const storedFront2 = localStorage.getItem('appFlashcardFront2');
  const storedBack1 = localStorage.getItem('appFlashcardBack1');
  const storedBack2 = localStorage.getItem('appFlashcardBack2');

  const colors = {
    front1: _isHexColor(storedFront1) ? storedFront1 : FLASHCARD_DEFAULT_COLORS.front1,
    front2: _isHexColor(storedFront2) ? storedFront2 : FLASHCARD_DEFAULT_COLORS.front2,
    back1: _isHexColor(storedBack1) ? storedBack1 : FLASHCARD_DEFAULT_COLORS.back1,
    back2: _isHexColor(storedBack2) ? storedBack2 : FLASHCARD_DEFAULT_COLORS.back2
  };

  _applyFlashcardTheme(colors);
  _syncFlashcardColorInputs(colors);
}

function onFlashcardColorChange(){
  const fcFront1 = document.getElementById('fcFront1');
  const fcFront2 = document.getElementById('fcFront2');
  const fcBack1 = document.getElementById('fcBack1');
  const fcBack2 = document.getElementById('fcBack2');
  
  if(!fcFront1 || !fcFront2 || !fcBack1 || !fcBack2) return;

  const colors = {
    front1: _isHexColor(fcFront1.value) ? fcFront1.value : FLASHCARD_DEFAULT_COLORS.front1,
    front2: _isHexColor(fcFront2.value) ? fcFront2.value : FLASHCARD_DEFAULT_COLORS.front2,
    back1: _isHexColor(fcBack1.value) ? fcBack1.value : FLASHCARD_DEFAULT_COLORS.back1,
    back2: _isHexColor(fcBack2.value) ? fcBack2.value : FLASHCARD_DEFAULT_COLORS.back2
  };

  _applyFlashcardTheme(colors);
  _syncFlashcardColorInputs(colors);
  
  localStorage.setItem('appFlashcardFront1', colors.front1);
  localStorage.setItem('appFlashcardFront2', colors.front2);
  localStorage.setItem('appFlashcardBack1', colors.back1);
  localStorage.setItem('appFlashcardBack2', colors.back2);
}

function initAppFont(){
  const savedFont = localStorage.getItem('appFontFamily');
  const defaultFont = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const fontToApply = savedFont || defaultFont;
  const fontSelect = document.getElementById('fontSelect');
  if(fontSelect) fontSelect.value = fontToApply;
  setAppFont(fontToApply);
  if(!savedFont) localStorage.setItem('appFontFamily', defaultFont);

  const savedWeight = localStorage.getItem('appFontWeight');
  if(savedWeight){
    const weightSelect = document.getElementById('fontWeightSelect');
    if(weightSelect){
      weightSelect.value = savedWeight;
    }
    setAppFontWeight(savedWeight);
  }

  const savedTextColor = localStorage.getItem('appTextColor');
  if(savedTextColor){
    const textColorPicker = document.getElementById('textColorPicker');
    if(textColorPicker){
      textColorPicker.value = savedTextColor;
    }
    setAppTextColor(savedTextColor);
  }

  const baseFontSize = _getStoredBaseFontSize();
  const fontSizeInput = document.getElementById('fontSizeInput');
  if(fontSizeInput){
    fontSizeInput.value = String(baseFontSize);
  }
  setAppFontSize(baseFontSize);

  const flashcardFontSize = _getStoredFlashcardFontSize();
  const flashcardFontInput = document.getElementById('flashcardFontSizeInput');
  if(flashcardFontInput){
    flashcardFontInput.value = String(flashcardFontSize);
  }
  setFlashcardFontSize(flashcardFontSize);

  _loadFlashcardTheme();
}

function resetFontAppearanceDefaults(){
  const defaultFont = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const defaultWeight = '400';
  const defaultColor = '#0f1923';
  const defaultFontSize = FONT_SIZE_DEFAULT;

  setAppFont(defaultFont);
  setAppFontWeight(defaultWeight);
  setAppTextColor(defaultColor);

  localStorage.setItem('appFontFamily', defaultFont);
  localStorage.setItem('appFontWeight', defaultWeight);
  localStorage.setItem('appTextColor', defaultColor);
  localStorage.setItem('appFontSize', String(defaultFontSize));
  localStorage.setItem('appFlashcardFontSize', String(FLASHCARD_FONT_SIZE_DEFAULT));
  localStorage.setItem('appFlashcardFront1', FLASHCARD_DEFAULT_COLORS.front1);
  localStorage.setItem('appFlashcardFront2', FLASHCARD_DEFAULT_COLORS.front2);
  localStorage.setItem('appFlashcardBack1', FLASHCARD_DEFAULT_COLORS.back1);
  localStorage.setItem('appFlashcardBack2', FLASHCARD_DEFAULT_COLORS.back2);
  localStorage.removeItem('bontrager_dark_v1');
  localStorage.removeItem('bontrager_large_v1');
  localStorage.removeItem('bontrager_highcontrast_v1');

  const fontSelect = document.getElementById('fontSelect');
  const weightSelect = document.getElementById('fontWeightSelect');
  const textColorPicker = document.getElementById('textColorPicker');
  const fontSizeInput = document.getElementById('fontSizeInput');
  const flashcardFontInput = document.getElementById('flashcardFontSizeInput');
  const highContrastToggle = document.getElementById('highContrastToggle');
  const darkToggle = document.getElementById('darkToggle');
  const largeToggle = document.getElementById('largeToggle');
  if(fontSelect) fontSelect.value = defaultFont;
  if(weightSelect) weightSelect.value = defaultWeight;
  if(textColorPicker) textColorPicker.value = defaultColor;
  if(fontSizeInput) fontSizeInput.value = String(defaultFontSize);
  if(flashcardFontInput) flashcardFontInput.value = String(FLASHCARD_FONT_SIZE_DEFAULT);
  document.body.classList.remove('dark');
  if(darkToggle) {
    darkToggle.classList.remove('on');
    darkToggle.setAttribute('aria-pressed','false');
  }
  if(largeToggle) {
    largeToggle.classList.remove('on');
    largeToggle.setAttribute('aria-pressed','false');
  }
  setAppFontSize(defaultFontSize);
  setFlashcardFontSize(FLASHCARD_FONT_SIZE_DEFAULT);
  _applyFlashcardTheme(FLASHCARD_DEFAULT_COLORS);
  _syncFlashcardColorInputs(FLASHCARD_DEFAULT_COLORS);
  document.body.classList.remove('high-contrast');
  if(highContrastToggle) {
    highContrastToggle.classList.remove('on');
    highContrastToggle.setAttribute('aria-pressed','false');
  }
}
// ══════════════════════════════════════════════
// CONFIRM DIALOG
// ══════════════════════════════════════════════
function showConfirm(title, msg, cb){
  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').textContent=msg;
  confirmCallback=cb;
  document.getElementById('confirmOverlay').classList.add('open');
}
function confirmYes(){
  document.getElementById('confirmOverlay').classList.remove('open');
  if(confirmCallback) confirmCallback();
  confirmCallback=null;
}
function confirmNo(){
  document.getElementById('confirmOverlay').classList.remove('open');
  confirmCallback=null;
}

function confirmExitQuiz(){
  showConfirm('Exit quiz','Are you sure you want to exit? Your current quiz progress will be lost.',()=>{
    _quizActive=false;
    navTo('quiz-chapters');
  });
}

let pmRole='student';
function openProfileModal(){
  closeSidebar();
  document.getElementById('pmNameInput').value=userName==='Student'?'':userName;
  selectPMRole(userRole);
  document.getElementById('profileModalOverlay').classList.add('open');
}
function closeProfileModal(e){
  if(!e||e.target===document.getElementById('profileModalOverlay'))
    document.getElementById('profileModalOverlay').classList.remove('open');
}
function selectPMRole(role){
  pmRole=role;
  document.getElementById('pmStudent').classList.toggle('selected',role==='student');
  document.getElementById('pmDev').classList.toggle('selected',role==='developer');
}
function saveProfile(){
  userName=document.getElementById('pmNameInput').value.trim()||'Student';
  document.getElementById('sbName').textContent=userName;
  document.getElementById('sbAvatar').textContent=userName.charAt(0).toUpperCase()||'S';
  // Update hero subtitle with personalized greeting
  const hs=document.getElementById('heroSubtitle');
  if(hs){ hs.textContent=userName&&userName!=='Student'?'Welcome back, '+userName+' · 10th Edition':'Radiographic positioning guide · 10th Edition'; }
  _saveUserProfile();
  if(pmRole==='developer' && userRole!=='developer'){
    closeProfileModal();
    requestDevRole();
  } else {
    setRole(pmRole);
    closeProfileModal();
  }
}
// ── IMAGE EDITOR ──
let _edOrigImg1=null, _edOrigImg2=null;
let _edCanvas=null, _edCtx=null;
let _cropStart=null, _cropRect=null, _isCropping=false;

function openImgEditor(){
  if(!curPos||!curPos.posImg) return;
  _edOrigImg1=curPos.posImg;
  _edOrigImg2=curPos.posImg2||null;
  const overlay=document.getElementById('imgEditorOverlay');
  overlay.classList.add('open');
  _edCanvas=document.getElementById('imgEditorCanvas');
  _edCtx=_edCanvas.getContext('2d');
  setEdTab('crop');
  _edLoadImgToCanvas(curPos.posImg);
  // Init dual tab preview
  if(curPos.posImg2){
    const thumb=document.getElementById('edImg2Thumb');
    const prev=document.getElementById('edImg2Preview');
    thumb.src=curPos.posImg2; prev.style.display='block';
  }
}

function closeImgEditor(){ document.getElementById('imgEditorOverlay').classList.remove('open'); }

function setEdTab(tab){
  ['crop','resize','dual'].forEach(t=>{
    document.getElementById('edTab'+t.charAt(0).toUpperCase()+t.slice(1)).classList.toggle('active',t===tab);
    document.getElementById('edPanel'+t.charAt(0).toUpperCase()+t.slice(1)).style.display=t===tab?'block':'none';
  });
  if(tab==='crop'){ _setupCropListeners(); document.getElementById('cropOverlay').style.display='none'; }
  else { _removeCropListeners(); document.getElementById('cropOverlay').style.display='none'; }
  if(tab==='resize') _initResizeSliders();
}

function _edLoadImgToCanvas(src){
  const img=new Image();
  img.onload=()=>{
    const maxW=440, maxH=280;
    let w=img.naturalWidth, h=img.naturalHeight;
    const scale=Math.min(maxW/w,maxH/h,1);
    _edCanvas.width=Math.round(w*scale);
    _edCanvas.height=Math.round(h*scale);
    _edCanvas.dataset.origW=w; _edCanvas.dataset.origH=h;
    _edCtx.drawImage(img,0,0,_edCanvas.width,_edCanvas.height);
    _cropRect=null;
    document.getElementById('cropOverlay').style.display='none';
  };
  img.src=src;
}

// Crop
function _setupCropListeners(){
  _edCanvas.addEventListener('mousedown',_cropMouseDown);
  _edCanvas.addEventListener('mousemove',_cropMouseMove);
  _edCanvas.addEventListener('mouseup',_cropMouseUp);
  _edCanvas.addEventListener('touchstart',_cropTouchStart,{passive:false});
  _edCanvas.addEventListener('touchmove',_cropTouchMove,{passive:false});
  _edCanvas.addEventListener('touchend',_cropTouchEnd);
}
function _removeCropListeners(){
  _edCanvas.removeEventListener('mousedown',_cropMouseDown);
  _edCanvas.removeEventListener('mousemove',_cropMouseMove);
  _edCanvas.removeEventListener('mouseup',_cropMouseUp);
  _edCanvas.removeEventListener('touchstart',_cropTouchStart);
  _edCanvas.removeEventListener('touchmove',_cropTouchMove);
  _edCanvas.removeEventListener('touchend',_cropTouchEnd);
}
function _getCanvasPos(e,canvas){
  const r=canvas.getBoundingClientRect();
  const src=e.touches?e.touches[0]:e;
  return {x:src.clientX-r.left,y:src.clientY-r.top};
}
function _cropMouseDown(e){ _isCropping=true; _cropStart=_getCanvasPos(e,_edCanvas); _updateCropOverlay(_cropStart,_cropStart); }
function _cropMouseMove(e){ if(!_isCropping)return; const p=_getCanvasPos(e,_edCanvas); _updateCropOverlay(_cropStart,p); }
function _cropMouseUp(e){ if(!_isCropping)return; _isCropping=false; const p=_getCanvasPos(e,_edCanvas); _updateCropOverlay(_cropStart,p); }
function _cropTouchStart(e){ e.preventDefault(); _isCropping=true; _cropStart=_getCanvasPos(e,_edCanvas); _updateCropOverlay(_cropStart,_cropStart); }
function _cropTouchMove(e){ e.preventDefault(); if(!_isCropping)return; const p=_getCanvasPos(e,_edCanvas); _updateCropOverlay(_cropStart,p); }
function _cropTouchEnd(e){ _isCropping=false; }

function _updateCropOverlay(a,b){
  const ov=document.getElementById('cropOverlay');
  const wrap=document.getElementById('imgCanvasWrap');
  const cr=_edCanvas.getBoundingClientRect();
  const wr=wrap.getBoundingClientRect();
  const x=Math.min(a.x,b.x), y=Math.min(a.y,b.y);
  const w=Math.abs(a.x-b.x), h=Math.abs(a.y-b.y);
  _cropRect={x,y,w,h};
  ov.style.display='block';
  ov.style.left=(cr.left-wr.left+x)+'px';
  ov.style.top=(cr.top-wr.top+y)+'px';
  ov.style.width=w+'px'; ov.style.height=h+'px';
}

function edCropReset(){ _cropRect=null; document.getElementById('cropOverlay').style.display='none'; }

function edCropPreset(wr,hr){
  const cw=_edCanvas.width, ch=_edCanvas.height;
  const aspect=wr/hr;
  let w=cw*0.8, h=w/aspect;
  if(h>ch*0.8){h=ch*0.8;w=h*aspect;}
  const x=(cw-w)/2, y=(ch-h)/2;
  _cropStart={x,y};
  _cropRect={x,y,w,h};
  _updateCropOverlay({x,y},{x:x+w,y:y+h});
}

function edApplyCrop(){
  if(!_cropRect||_cropRect.w<5||_cropRect.h<5){_showToast('Select crop area first');return;}
  const scaleX=parseInt(_edCanvas.dataset.origW)/_edCanvas.width;
  const scaleY=parseInt(_edCanvas.dataset.origH)/_edCanvas.height;
  const tmpC=document.createElement('canvas');
  tmpC.width=Math.round(_cropRect.w*scaleX);
  tmpC.height=Math.round(_cropRect.h*scaleY);
  const tmpCtx=tmpC.getContext('2d');
  const img=new Image();
  img.onload=()=>{
    tmpCtx.drawImage(img,_cropRect.x*scaleX,_cropRect.y*scaleY,_cropRect.w*scaleX,_cropRect.h*scaleY,0,0,tmpC.width,tmpC.height);
    const dataUrl=tmpC.toDataURL('image/jpeg',0.92);
    curPos.posImg=dataUrl;
    _edLoadImgToCanvas(dataUrl);
    _refreshPosImgDisplay();
    if(typeof devSaveData==="function") devSaveData();
    _showToast('✅ Crop applied');
  };
  img.src=curPos.posImg;
}

// Resize
function _initResizeSliders(){
  const img=new Image();
  img.onload=()=>{
    const w=img.naturalWidth, h=img.naturalHeight;
    document.getElementById('edResizeW').value=w;
    document.getElementById('edResizeW').max=Math.max(1200,w*2);
    document.getElementById('edResizeH').value=h;
    document.getElementById('edResizeH').max=Math.max(1200,h*2);
    document.getElementById('edResizeWLabel').textContent=w+'px';
    document.getElementById('edResizeHLabel').textContent=h+'px';
    _edCanvas.dataset.imgAspect=w/h;
  };
  img.src=curPos.posImg;
}
function edResizePreview(){
  const lockAspect=document.getElementById('edAspectLock').checked;
  const wSlider=document.getElementById('edResizeW');
  const hSlider=document.getElementById('edResizeH');
  const aspect=parseFloat(_edCanvas.dataset.imgAspect)||1;
  if(lockAspect){
    // Which one changed last — approximate: update H based on W
    hSlider.value=Math.round(parseInt(wSlider.value)/aspect);
  }
  document.getElementById('edResizeWLabel').textContent=wSlider.value+'px';
  document.getElementById('edResizeHLabel').textContent=hSlider.value+'px';
}
function edResizeReset(){ _initResizeSliders(); }
function edApplyResize(){
  const tw=parseInt(document.getElementById('edResizeW').value);
  const th=parseInt(document.getElementById('edResizeH').value);
  const tmpC=document.createElement('canvas');
  tmpC.width=tw; tmpC.height=th;
  const tmpCtx=tmpC.getContext('2d');
  const img=new Image();
  img.onload=()=>{
    tmpCtx.drawImage(img,0,0,tw,th);
    const dataUrl=tmpC.toDataURL('image/jpeg',0.92);
    curPos.posImg=dataUrl;
    _edLoadImgToCanvas(dataUrl);
    _refreshPosImgDisplay();
    if(typeof devSaveData==="function") devSaveData();
    _showToast('✅ Resize applied — '+tw+'×'+th+'px');
  };
  img.src=curPos.posImg;
}

// Dual image
function edDeleteImg2(){
  delete curPos.posImg2; delete curPos.imgLayout;
  document.getElementById('edImg2Preview').style.display='none';
  document.getElementById('edImg2Thumb').src='';
  _refreshPosImgDisplay();
  if(typeof devSaveData==="function") devSaveData();
  _showToast('✅ Image 2 removed');
}
function edSetLayout(layout){
  curPos.imgLayout=layout;
  document.getElementById('edLayoutSide').style.borderColor=layout==='side'?'var(--accent)':'var(--border)';
  document.getElementById('edLayoutSide').style.color=layout==='side'?'var(--accent)':'var(--text2)';
  document.getElementById('edLayoutStack').style.borderColor=layout==='stack'?'var(--accent)':'var(--border)';
  document.getElementById('edLayoutStack').style.color=layout==='stack'?'var(--accent)':'var(--text2)';
  _refreshPosImgDisplay();
  if(typeof devSaveData==="function") devSaveData();
}

function edUndoAll(){
  showConfirm('Undo All Edits','Restore original images for this position?',()=>{
    if(_edOrigImg1){ curPos.posImg=_edOrigImg1; }
    if(_edOrigImg2){ curPos.posImg2=_edOrigImg2; } else { delete curPos.posImg2; }
    _edLoadImgToCanvas(curPos.posImg);
    _refreshPosImgDisplay();
    if(typeof devSaveData==="function") devSaveData();
    _showToast('↩ Images restored');
  });
}
function edSaveAll(){
  closeImgEditor();
  _refreshPosImgDisplay();
  if(typeof devSaveData==="function") devSaveData();
  _showToast('💾 Images saved to position');
}

// ── EXPORT HTML WITH EMBEDDED IMAGES ──
const _zoom={scale:1,tx:0,ty:0,startX:0,startY:0,startTx:0,startTy:0,dragging:false,pinching:false,lastPinchDist:0};
const MIN_SCALE=0.5, MAX_SCALE=8;

function openImgZoom(src){
  if(!src) return;
  const overlay=document.getElementById('imgZoomOverlay');
  const img=document.getElementById('imgZoomImg');
  img.src=src;
  _zoom.scale=1; _zoom.tx=0; _zoom.ty=0;
  _applyZoom();
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
  // Setup events
  _zoomBindEvents();
}

function closeImgZoom(){
  document.getElementById('imgZoomOverlay').classList.remove('open');
  document.body.style.overflow='';
  _zoomUnbindEvents();
}

function _zoomOverlayClick(e){
  if(e.target===document.getElementById('imgZoomOverlay') && _zoom.scale<=1.1) closeImgZoom();
}

function _applyZoom(){
  const img=document.getElementById('imgZoomImg');
  if(!img) return;
  img.style.transform=`translate(${_zoom.tx}px,${_zoom.ty}px) scale(${_zoom.scale})`;
}

function _zoomIn(){ _zoom.scale=Math.min(_zoom.scale*1.4,MAX_SCALE); _clampPan(); _applyZoom(); }
function _zoomOut(){ _zoom.scale=Math.max(_zoom.scale/1.4,MIN_SCALE); _clampPan(); _applyZoom(); }
function _zoomReset(){ _zoom.scale=1; _zoom.tx=0; _zoom.ty=0; _applyZoom(); }

function _clampPan(){
  const container=document.getElementById('imgZoomContainer');
  const img=document.getElementById('imgZoomImg');
  if(!container||!img) return;
  const cw=container.clientWidth, ch=container.clientHeight;
  const iw=img.naturalWidth||cw, ih=img.naturalHeight||ch;
  const scaledW=Math.min(iw,cw)*_zoom.scale;
  const scaledH=Math.min(ih,ch)*_zoom.scale;
  const maxPanX=Math.max(0,(scaledW-cw)/2);
  const maxPanY=Math.max(0,(scaledH-ch)/2);
  _zoom.tx=Math.max(-maxPanX,Math.min(maxPanX,_zoom.tx));
  _zoom.ty=Math.max(-maxPanY,Math.min(maxPanY,_zoom.ty));
}

function _getDist(t1,t2){
  const dx=t1.clientX-t2.clientX, dy=t1.clientY-t2.clientY;
  return Math.sqrt(dx*dx+dy*dy);
}
function _getMidpoint(t1,t2){
  return {x:(t1.clientX+t2.clientX)/2, y:(t1.clientY+t2.clientY)/2};
}

function _onTouchStart(e){
  if(e.touches.length===1){
    _zoom.dragging=true; _zoom.pinching=false;
    _zoom.startX=e.touches[0].clientX-_zoom.tx;
    _zoom.startY=e.touches[0].clientY-_zoom.ty;
    document.getElementById('imgZoomImg').classList.add('dragging');
  } else if(e.touches.length===2){
    _zoom.pinching=true; _zoom.dragging=false;
    _zoom.lastPinchDist=_getDist(e.touches[0],e.touches[1]);
  }
}

function _onTouchMove(e){
  e.preventDefault();
  if(_zoom.pinching && e.touches.length===2){
    const dist=_getDist(e.touches[0],e.touches[1]);
    const ratio=dist/_zoom.lastPinchDist;
    _zoom.scale=Math.min(Math.max(_zoom.scale*ratio,MIN_SCALE),MAX_SCALE);
    _zoom.lastPinchDist=dist;
    _clampPan(); _applyZoom();
  } else if(_zoom.dragging && e.touches.length===1 && _zoom.scale>1){
    _zoom.tx=e.touches[0].clientX-_zoom.startX;
    _zoom.ty=e.touches[0].clientY-_zoom.startY;
    _clampPan(); _applyZoom();
  }
}

function _onTouchEnd(e){
  _zoom.dragging=false; _zoom.pinching=false;
  document.getElementById('imgZoomImg').classList.remove('dragging');
}

function _onDblTap(e){
  e.preventDefault();
  if(_zoom.scale>1.5){ _zoomReset(); }
  else { _zoom.scale=2.5; _clampPan(); _applyZoom(); }
}

// Mouse wheel zoom
function _onWheel(e){
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.15 : 0.87;
  _zoom.scale=Math.min(Math.max(_zoom.scale*factor,MIN_SCALE),MAX_SCALE);
  _clampPan(); _applyZoom();
}

// Mouse drag
let _mouseDown=false;
function _onMouseDown(e){ _mouseDown=true; _zoom.startX=e.clientX-_zoom.tx; _zoom.startY=e.clientY-_zoom.ty; document.getElementById('imgZoomImg').classList.add('dragging'); }
function _onMouseMove(e){ if(_mouseDown && _zoom.scale>1){ _zoom.tx=e.clientX-_zoom.startX; _zoom.ty=e.clientY-_zoom.startY; _clampPan(); _applyZoom(); } }
function _onMouseUp(){ _mouseDown=false; document.getElementById('imgZoomImg').classList.remove('dragging'); }
function _onKeyDown(e){ if(e.key==='Escape') closeImgZoom(); else if(e.key==='+') _zoomIn(); else if(e.key==='-') _zoomOut(); else if(e.key==='0') _zoomReset(); }

let _lastTap=0;
function _onSingleTap(e){
  const now=Date.now();
  if(now-_lastTap<300){ _onDblTap(e); } 
  _lastTap=now;
}

function _zoomBindEvents(){
  const container=document.getElementById('imgZoomContainer');
  const img=document.getElementById('imgZoomImg');
  container.addEventListener('touchstart',_onTouchStart,{passive:false});
  container.addEventListener('touchmove',_onTouchMove,{passive:false});
  container.addEventListener('touchend',_onTouchEnd);
  container.addEventListener('click',_onSingleTap);
  container.addEventListener('wheel',_onWheel,{passive:false});
  img.addEventListener('mousedown',_onMouseDown);
  window.addEventListener('mousemove',_onMouseMove);
  window.addEventListener('mouseup',_onMouseUp);
  document.addEventListener('keydown',_onKeyDown);
}

function _zoomUnbindEvents(){
  const container=document.getElementById('imgZoomContainer');
  const img=document.getElementById('imgZoomImg');
  container.removeEventListener('touchstart',_onTouchStart);
  container.removeEventListener('touchmove',_onTouchMove);
  container.removeEventListener('touchend',_onTouchEnd);
  container.removeEventListener('click',_onSingleTap);
  container.removeEventListener('wheel',_onWheel);
  img.removeEventListener('mousedown',_onMouseDown);
  window.removeEventListener('mousemove',_onMouseMove);
  window.removeEventListener('mouseup',_onMouseUp);
  document.removeEventListener('keydown',_onKeyDown);
}

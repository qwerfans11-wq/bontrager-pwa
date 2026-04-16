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
        <div class="_exit-title">هل تريد إغلاق التطبيق؟</div>
        <div class="_exit-subtitle">لحظة واحدة قبل أن تغادر…</div>
      </div>
      <div class="_exit-body">
        <div class="_exit-dua-label">دعوة صادقة</div>
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
        <button class="_exit-btn _exit-btn-stay" onclick="document.getElementById('_exitDialog').remove()">
          📖 ابقَ هنا
        </button>
        <button class="_exit-btn _exit-btn-close" onclick="window.close();history.go(-999);">
          إغلاق ✕
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Intercept Android/iOS back button to show exit dialog
(function(){
  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", function() {
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

function setAppFontSize(sizeValue){
  document.documentElement.style.setProperty('--base-fs', sizeValue + 'px');
  document.body.style.fontSize = sizeValue + 'px';
  document.body.style.zoom = sizeValue / 15;
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
  const sizeValue = parseInt(input.value);
  if(isNaN(sizeValue) || sizeValue < 12 || sizeValue > 24) {
    input.value = 15; // reset to default
    return;
  }
  setAppFontSize(sizeValue);
  localStorage.setItem('appFontSize', sizeValue);
}

function onTextColorChange(){
  const textColorPicker = document.getElementById('textColorPicker');
  if(!textColorPicker) return;
  const colorValue = textColorPicker.value;
  setAppTextColor(colorValue);
  localStorage.setItem('appTextColor', colorValue);
}

function onFlashcardColorChange(){
  const fcFront1 = document.getElementById('fcFront1');
  const fcFront2 = document.getElementById('fcFront2');
  const fcBack1 = document.getElementById('fcBack1');
  const fcBack2 = document.getElementById('fcBack2');
  
  if(!fcFront1 || !fcFront2 || !fcBack1 || !fcBack2) return;
  
  document.documentElement.style.setProperty('--fc-front-1', fcFront1.value);
  document.documentElement.style.setProperty('--fc-front-2', fcFront2.value);
  document.documentElement.style.setProperty('--fc-back-1', fcBack1.value);
  document.documentElement.style.setProperty('--fc-back-2', fcBack2.value);
  
  localStorage.setItem('appFlashcardFront1', fcFront1.value);
  localStorage.setItem('appFlashcardFront2', fcFront2.value);
  localStorage.setItem('appFlashcardBack1', fcBack1.value);
  localStorage.setItem('appFlashcardBack2', fcBack2.value);
}

function initAppFont(){
  const savedFont = localStorage.getItem('appFontFamily');
  if(savedFont){
    const fontSelect = document.getElementById('fontSelect');
    if(fontSelect){
      fontSelect.value = savedFont;
    }
    setAppFont(savedFont);
  }

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

  const savedFontSize = localStorage.getItem('appFontSize');
  if(savedFontSize){
    const fontSizeInput = document.getElementById('fontSizeInput');
    if(fontSizeInput){
      fontSizeInput.value = savedFontSize;
    }
    const sz = parseInt(savedFontSize);
    setAppFontSize(sz);
    document.body.style.fontSize = sz + 'px';
  }

  // Load flashcard colors
  const savedFcFront1 = localStorage.getItem('appFlashcardFront1');
  const savedFcFront2 = localStorage.getItem('appFlashcardFront2');
  const savedFcBack1 = localStorage.getItem('appFlashcardBack1');
  const savedFcBack2 = localStorage.getItem('appFlashcardBack2');
  
  if(savedFcFront1 || savedFcFront2 || savedFcBack1 || savedFcBack2){
    if(savedFcFront1) document.documentElement.style.setProperty('--fc-front-1', savedFcFront1);
    if(savedFcFront2) document.documentElement.style.setProperty('--fc-front-2', savedFcFront2);
    if(savedFcBack1) document.documentElement.style.setProperty('--fc-back-1', savedFcBack1);
    if(savedFcBack2) document.documentElement.style.setProperty('--fc-back-2', savedFcBack2);
    
    const fcFront1 = document.getElementById('fcFront1');
    const fcFront2 = document.getElementById('fcFront2');
    const fcBack1 = document.getElementById('fcBack1');
    const fcBack2 = document.getElementById('fcBack2');
    
    if(fcFront1 && savedFcFront1) fcFront1.value = savedFcFront1;
    if(fcFront2 && savedFcFront2) fcFront2.value = savedFcFront2;
    if(fcBack1 && savedFcBack1) fcBack1.value = savedFcBack1;
    if(fcBack2 && savedFcBack2) fcBack2.value = savedFcBack2;
  }
}

function resetFontAppearanceDefaults(){
  const defaultFont = 'IBM Plex Sans, Noto Sans Arabic, -apple-system, BlinkMacSystemFont, sans-serif';
  const defaultWeight = '400';
  const defaultColor = '#0f1923';
  const defaultFontSize = '15';

  setAppFont(defaultFont);
  setAppFontWeight(defaultWeight);
  setAppTextColor(defaultColor);
  setAppFontSize(defaultFontSize);

  localStorage.setItem('appFontFamily', defaultFont);
  localStorage.setItem('appFontWeight', defaultWeight);
  localStorage.setItem('appTextColor', defaultColor);
  localStorage.setItem('appFontSize', defaultFontSize);
  localStorage.removeItem('bontrager_dark_v1');
  localStorage.removeItem('bontrager_large_v1');
  localStorage.removeItem('bontrager_highcontrast_v1');

  const fontSelect = document.getElementById('fontSelect');
  const weightSelect = document.getElementById('fontWeightSelect');
  const textColorPicker = document.getElementById('textColorPicker');
  const fontSizeInput = document.getElementById('fontSizeInput');
  const highContrastToggle = document.getElementById('highContrastToggle');
  const darkToggle = document.getElementById('darkToggle');
  const largeToggle = document.getElementById('largeToggle');
  if(fontSelect) fontSelect.value = defaultFont;
  if(weightSelect) weightSelect.value = defaultWeight;
  if(textColorPicker) textColorPicker.value = defaultColor;
  if(fontSizeInput) fontSizeInput.value = defaultFontSize;
  document.body.classList.remove('dark');
  if(darkToggle) darkToggle.classList.remove('on');
  document.documentElement.style.setProperty('--base-fs', '15px');
  document.body.style.fontSize = '15px';
  document.body.style.zoom = 1;
  if(largeToggle) largeToggle.classList.remove('on');
  document.body.classList.remove('high-contrast');
  if(highContrastToggle) {
    highContrastToggle.classList.remove('on');
    highContrastToggle.setAttribute('aria-pressed','false');
  }
}

// Legacy empty aliases (never expose real values)
const DEV_USERNAME='';const DEV_PASSWORD='';

// ══════════════════════════════════════════════
// DATA — BOOK
// ══════════════════════════════════════════════
function _pwaGenerateIcon(size){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size*0.18}" fill="#1e4db7"/>
    <rect x="${size*0.18}" y="${size*0.12}" width="${size*0.64}" height="${size*0.76}" rx="${size*0.06}" fill="white" opacity="0.95"/>
    <rect x="${size*0.28}" y="${size*0.22}" width="${size*0.44}" height="${size*0.56}" rx="${size*0.04}" fill="#eef2ff"/>
    <line x1="${size*0.38}" y1="${size*0.35}" x2="${size*0.62}" y2="${size*0.35}" stroke="#1e4db7" stroke-width="${size*0.045}" stroke-linecap="round"/>
    <line x1="${size*0.38}" y1="${size*0.47}" x2="${size*0.62}" y2="${size*0.47}" stroke="#1e4db7" stroke-width="${size*0.045}" stroke-linecap="round"/>
    <line x1="${size*0.38}" y1="${size*0.59}" x2="${size*0.54}" y2="${size*0.59}" stroke="#1e4db7" stroke-width="${size*0.045}" stroke-linecap="round"/>
    <circle cx="${size*0.72}" cy="${size*0.72}" r="${size*0.2}" fill="#15803d"/>
    <line x1="${size*0.72}" y1="${size*0.61}" x2="${size*0.72}" y2="${size*0.83}" stroke="white" stroke-width="${size*0.06}" stroke-linecap="round"/>
    <line x1="${size*0.61}" y1="${size*0.72}" x2="${size*0.83}" y2="${size*0.72}" stroke="white" stroke-width="${size*0.06}" stroke-linecap="round"/>
  </svg>`;
  return 'data:image/svg+xml;base64,'+btoa(svg);
}

// Generate manifest dynamically and inject
function _pwaInitManifest(){
  const icon192=_pwaGenerateIcon(192);
  const icon512=_pwaGenerateIcon(512);
  const manifest={
    name:'Bontrager Positioning',
    short_name:'Bontrager',
    description:'Radiographic positioning guide — 10th Edition',
    start_url:'.',
    display:'standalone',
    background_color:'#f0ede8',
    theme_color:'#1e4db7',
    orientation:'portrait-primary',
    icons:[
      {src:icon192,sizes:'192x192',type:'image/svg+xml',purpose:'any maskable'},
      {src:icon512,sizes:'512x512',type:'image/svg+xml',purpose:'any maskable'}
    ]
  };
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
  const url=URL.createObjectURL(blob);
  const link=document.getElementById('pwaManifest');
  if(link) link.href=url;

  // Apple touch icon
  const appleLink=document.getElementById('appleTouchIcon');
  if(appleLink) appleLink.href=icon192;
}

// Service Worker registration (inline SW for full offline support)
function _pwaRegisterSW(){
  if(!('serviceWorker' in navigator)) return;
  // Inline service worker as blob
  const swCode=`
const CACHE='bontrager-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(cache=>{
    return cache.addAll([location.pathname||'/']);
  }));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(e.request.url.startsWith(location.origin)){
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
    }
    return res;
  }).catch(()=>caches.match(location.pathname||'/'))));
});
`;
  try{
    const swBlob=new Blob([swCode],{type:'application/javascript'});
    const swUrl=URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swUrl,{scope:'./'}).then(reg=>{
      console.log('SW registered');
    }).catch(e=>console.log('SW reg failed (normal for file://):', e.message));
  }catch(e){console.log('SW not supported in this context');}
}

// Install prompt handling
let _pwaPrompt=null;
const _PWA_DISMISSED='bontrager_pwa_dismissed_v1';

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  _pwaPrompt=e;
  try{
    if(!localStorage.getItem(_PWA_DISMISSED)){
      setTimeout(()=>{
        const banner=document.getElementById('pwaBanner');
        if(banner) banner.classList.add('show');
      },3000);
    }
  }catch(err){}
});

function pwaInstall(){
  if(!_pwaPrompt) return;
  _pwaPrompt.prompt();
  _pwaPrompt.userChoice.then(result=>{
    document.getElementById('pwaBanner')?.classList.remove('show');
    _pwaPrompt=null;
    if(result.outcome==='accepted') _showToast('Installing…','#15803d');
  });
}

function pwaDismiss(){
  document.getElementById('pwaBanner')?.classList.remove('show');
  try{localStorage.setItem(_PWA_DISMISSED,'1');}catch(e){}
}

// Add to homescreen instructions in Settings
function _pwaShowInstructions(){
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid=/android/i.test(navigator.userAgent);
  if(isIOS){
    alert('Install on iPhone/iPad:\n1. Tap the Share button (□↑) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"\n\nThe app will work fully offline!');
  } else if(isAndroid){
    if(_pwaPrompt){ pwaInstall(); }
    else{ alert('Install on Android:\n1. Tap the menu (⋮) in Chrome\n2. Tap "Add to Home screen" or "Install app"\n3. Tap "Install"\n\nThe app will work fully offline!'); }
  } else {
    if(_pwaPrompt){ pwaInstall(); }
    else{ alert('Install on Desktop (Chrome/Edge):\n1. Look for the install icon (⊕) in the address bar\n2. Click "Install Bontrager Positioning"\n\nOr: Menu → "Install Bontrager Positioning"'); }
  }
}

// Initialize PWA
(function(){
  try{
    _pwaInitManifest();
    _pwaRegisterSW();
  }catch(e){console.log('PWA init error:',e);}
})();

initAppFont();
buildChapters();
updateStats();

// ── Service Worker Registration ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

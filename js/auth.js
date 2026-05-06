// js/auth.js — Authentication, role management, and developer appearance controls

// ══════════════════════════════════════════════
// DEV LOGIN
// ══════════════════════════════════════════════
function requestDevRole(){
  // If already dev, just switch
  if(userRole==='developer'){setRole('student');return;}
  document.getElementById('devLoginUser').value='';
  document.getElementById('devLoginPass').value='';
  document.getElementById('devLoginError').classList.remove('show');
  document.getElementById('devLoginOverlay').classList.add('open');
  setTimeout(()=>document.getElementById('devLoginUser').focus(),200);
}

function cancelDevLogin(){
  document.getElementById('devLoginOverlay').classList.remove('open');
}

async function submitDevLogin(){
  const u=document.getElementById('devLoginUser').value.trim();
  const p=document.getElementById('devLoginPass').value;
  const btn=document.querySelector('#devLoginOverlay .modal-btn.primary');
  if(btn){btn.textContent='…';btn.disabled=true;}
  const ok=await _chkCreds(u,p);
  if(btn){btn.textContent='Login';btn.disabled=false;}
  if(ok){
    document.getElementById('devLoginOverlay').classList.remove('open');
    setRole('developer');
  } else {
    document.getElementById('devLoginError').classList.add('show');
    document.getElementById('devLoginPass').value='';
    document.getElementById('devLoginPass').focus();
  }
}

document.getElementById('devLoginPass').addEventListener('keydown', e=>{
  if(e.key==='Enter') submitDevLogin();
});

// ══════════════════════════════════════════════
// ROLE & SIDEBAR
// ══════════════════════════════════════════════
function setRole(role){
  userRole=role;
  document.getElementById('roleStudent').classList.toggle('active',role==='student');
  document.getElementById('roleDev').classList.toggle('active',role==='developer');
  const avatar=document.getElementById('sbAvatar');
  avatar.className='avatar '+(role==='developer'?'dev':'student');
  avatar.textContent=role==='developer'?'D':userName.charAt(0).toUpperCase()||'S';
  document.getElementById('sbRole').textContent=role==='developer'?'Developer mode':'Student mode';
  document.getElementById('heroBadge').innerHTML=role==='developer'?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> Developer Mode':'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg> Student Mode';
  // Show/hide appearance button in header
  const dab=document.getElementById('devAppearanceBtn');
  if(dab) dab.style.display=role==='developer'?'flex':'none';
  // Disable inline editing when switching to student
  if(role!=='developer' && _inlineEditActive){
    _inlineEditActive=false;
    disableInlineEditing();
    const iet=document.getElementById('inlineEditToggle');
    if(iet) iet.classList.remove('on');
  }
  updateDevUI();
  closeSidebar();
  if(role==='developer') _showToast('Developer mode — edits are saved automatically');
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function updateDevUI(){
  const isDev=userRole==='developer';
  const eb=document.getElementById('devEditBar');
  if(eb) eb.style.display=isDev?'flex':'none';
  const qb=document.getElementById('devQuizEditBar');
  if(qb) qb.style.display=isDev?'flex':'none';
  const sdp=document.getElementById('devSubChPanel');
  if(sdp) sdp.style.display=isDev?'block':'none';
  const dap=document.getElementById('devAddPosPanel');
  if(dap) dap.style.display=isDev?'block':'none';
  // Position image bar
  const pib=document.getElementById('devPosImgBar');
  if(pib) pib.style.display=isDev?'flex':'none';
  // Quiz image bar
  const qib=document.getElementById('devQuizImgBar');
  if(qib) qib.style.display=isDev?'flex':'none';
  // Add chapter panel
  buildAddChapterPanel();
  // Restore session sidebar button (dev-only)
  const rsb=document.getElementById('sbRestoreSession');
  if(rsb) rsb.style.display=isDev?'flex':'none';
  if(isDev){
    const badge=document.getElementById('sbRestoreBadge');
    if(badge) badge.style.display=_loadSaved()?'inline':'none';
  }
}

let _savedAppearance={};
const _APPEARANCE_KEY='bontrager_appearance_v1';

function _loadSavedAppearance(){
  try{
    const raw=localStorage.getItem(_APPEARANCE_KEY);
    if(!raw) return;
    const a=JSON.parse(raw);
    _savedAppearance=a;
    const root=document.documentElement;
    if(a.bg) root.style.setProperty('--bg2',a.bg);
    if(a.bgCard) root.style.setProperty('--bg',a.bgCard);
    if(a.accent) root.style.setProperty('--accent',a.accent);
    if(a.text) root.style.setProperty('--text',a.text);
    if(a.text2) root.style.setProperty('--text2',a.text2);
    let savedBaseSize = null;
    if(a.fs){
      savedBaseSize = _normalizeFontSize(a.fs);
      localStorage.setItem('appFontSize', String(savedBaseSize));
    }
    if(a.dark){
      document.body.classList.add('dark');
      const t=document.getElementById('darkToggle');
      if(t){
        t.classList.add('on');
        t.setAttribute('aria-pressed','true');
      }
    }
    if(a.large){
      const t=document.getElementById('largeToggle');
      if(t){
        t.classList.add('on');
        t.setAttribute('aria-pressed','true');
      }
    }
    setAppFontSize(savedBaseSize === null ? _getStoredBaseFontSize() : savedBaseSize);
  }catch(e){}
}

function openDevAppearance(){
  if(userRole!=='developer') return;
  // Sync color inputs with current CSS vars
  const style=getComputedStyle(document.documentElement);
  const toHex=v=>{
    v=v.trim();
    if(v.startsWith('#')) return v;
    // parse rgb
    const m=v.match(/\d+/g);
    if(m&&m.length>=3) return '#'+m.slice(0,3).map(n=>parseInt(n).toString(16).padStart(2,'0')).join('');
    return '#ffffff';
  };
  document.getElementById('dap-bg').value=toHex(style.getPropertyValue('--bg2')||'#f4f4f5');
  document.getElementById('dap-bg-card').value=toHex(style.getPropertyValue('--bg')||'#ffffff');
  document.getElementById('dap-accent').value=toHex(style.getPropertyValue('--accent')||'#2563eb');
  document.getElementById('dap-text').value=toHex(style.getPropertyValue('--text')||'#09090b');
  document.getElementById('dap-text2').value=toHex(style.getPropertyValue('--text2')||'#52525b');
  document.getElementById('dap-fontsize').value=_getStoredBaseFontSize();
  document.getElementById('devAppearanceOverlay').classList.add('open');
}

function closeDevAppearance(e){
  if(!e||e.target===document.getElementById('devAppearanceOverlay'))
    document.getElementById('devAppearanceOverlay').classList.remove('open');
}

function previewAppearance(){
  applyAppearanceValues();
}

function applyAppearanceValues(){
  const bg=document.getElementById('dap-bg').value;
  const bgCard=document.getElementById('dap-bg-card').value;
  const accent=document.getElementById('dap-accent').value;
  const text=document.getElementById('dap-text').value;
  const text2=document.getElementById('dap-text2').value;
  const fsInput=document.getElementById('dap-fontsize');
  const fs=_normalizeFontSize(fsInput.value);
  fsInput.value=String(fs);
  const root=document.documentElement;
  root.style.setProperty('--bg2',bg);
  root.style.setProperty('--bg',bgCard);
  root.style.setProperty('--accent',accent);
  root.style.setProperty('--text',text);
  root.style.setProperty('--text2',text2);
  localStorage.setItem('appFontSize', String(fs));
  setAppFontSize(fs);
}

function saveAppearance(){
  applyAppearanceValues();
  const savedFontSize = _getStoredBaseFontSize();
  _savedAppearance={
    bg:document.getElementById('dap-bg').value,
    bgCard:document.getElementById('dap-bg-card').value,
    accent:document.getElementById('dap-accent').value,
    text:document.getElementById('dap-text').value,
    text2:document.getElementById('dap-text2').value,
    fs:String(savedFontSize),
    dark:document.body.classList.contains('dark'),
    large:document.getElementById('largeToggle')?.classList.contains('on')||false
  };
  try{ localStorage.setItem(_APPEARANCE_KEY, JSON.stringify(_savedAppearance)); }catch(e){}
  _showToast('🎨 Appearance saved');
  closeDevAppearance();
}

function resetAppearance(){
  const root=document.documentElement;
  root.style.removeProperty('--bg2');
  root.style.removeProperty('--bg');
  root.style.removeProperty('--accent');
  root.style.removeProperty('--text');
  root.style.removeProperty('--text2');
  root.style.removeProperty('--base-fs');
  document.body.style.fontSize='';
  _savedAppearance={};
  try{ localStorage.removeItem(_APPEARANCE_KEY); }catch(e){}
  const resetSize = FONT_SIZE_DEFAULT;
  localStorage.setItem('appFontSize', String(resetSize));
  setAppFontSize(resetSize);
  // sync inputs
  const style=getComputedStyle(root);
  const toHex=v=>{v=v.trim();if(v.startsWith('#'))return v;const m=v.match(/\d+/g);if(m&&m.length>=3)return '#'+m.slice(0,3).map(n=>parseInt(n).toString(16).padStart(2,'0')).join('');return '#ffffff';};
  document.getElementById('dap-bg').value=toHex(style.getPropertyValue('--bg2'));
  document.getElementById('dap-bg-card').value=toHex(style.getPropertyValue('--bg'));
  document.getElementById('dap-accent').value=toHex(style.getPropertyValue('--accent'));
  document.getElementById('dap-text').value=toHex(style.getPropertyValue('--text'));
  document.getElementById('dap-text2').value=toHex(style.getPropertyValue('--text2'));
  document.getElementById('dap-fontsize').value=String(resetSize);
  _showToast('Appearance reset');
  closeDevAppearance();
}

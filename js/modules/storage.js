// ── STATE ──
let userRole='student', userName='Student';
let curChapter=null, curPos=null, editChId=null, editPosIdx=null;
let curSubchapter=null;
let quizData=[], quizIdx=0, quizScore=0, wrongCount=0;
let wrongAnswers=[];
let lastChId=null, editQIdx=null, editTarget=null;
let bestScores={};
let aiHistory=[];
let confirmCallback=null;
let pendingDevAction=null;
let _quizActive=false;

const LETTERS=['A','B','C','D','E','F'];

// ── PERSISTENT USER PROFILE ──
const _USER_KEY='bontrager_user_profile_v1';
function _loadUserProfile(){
  try{
    const raw=localStorage.getItem(_USER_KEY);
    if(!raw) return;
    const p=JSON.parse(raw);
    if(p.name){ userName=p.name; }
    // Restore sidebar UI immediately (role applied after DOM ready)
    const sbName=document.getElementById('sbName');
    if(sbName) sbName.textContent=userName;
    const sbAvatar=document.getElementById('sbAvatar');
    if(sbAvatar){ sbAvatar.textContent=userName.charAt(0).toUpperCase()||'S'; }
    // Note: developer role requires re-authentication each session for security
    // Student role is auto-restored
    if(p.role && p.role==='student'){
      userRole='student';
    }
  }catch(e){}
}
function _saveUserProfile(){
  try{
    localStorage.setItem(_USER_KEY,JSON.stringify({name:userName,role:userRole==='student'?'student':'student',ts:new Date().toISOString()}));
  }catch(e){}
}

// ══════════════════════════════════════════════
// DEV LOGIN
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
  if(role==='developer') _showToast('وضع المطور — التعديلات تُحفظ تلقائياً');
}


function devSaveData(){
  if(userRole!=='developer') return false;
  try{
    localStorage.setItem(_SAVE_KEY,JSON.stringify({
      BOOK:JSON.parse(JSON.stringify(BOOK)),
      QUIZ:JSON.parse(JSON.stringify(QUIZ)),
      ts:new Date().toISOString()
    }));
    return true;
  }catch(e){return false;}
}

function _loadSaved(){
  try{var r=localStorage.getItem(_SAVE_KEY);return r?JSON.parse(r):null;}catch(e){return null;}
}

function _showToast(msg,color){
  color=color||'var(--green)';
  var t=document.getElementById('_devToast');
  if(!t){t=document.createElement('div');t.id='_devToast';
    t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);padding:10px 20px;border-radius:50px;font-size:13px;font-weight:700;color:#fff;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);transition:opacity .3s,transform .3s;opacity:0;pointer-events:none;white-space:nowrap';
    document.body.appendChild(t);}
  t.style.background=color;t.textContent=msg;
  t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(t._t);
  t._t=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';},2500);
}

// Auto-save every 60s in dev mode
setInterval(()=>{if(userRole==='developer'&&devSaveData())_showToast('💾 حفظ تلقائي');},60000);

// Warn before closing if dev mode is active
window.addEventListener('beforeunload',e=>{
  if(userRole==='developer'){devSaveData();e.preventDefault();e.returnValue='';}
});

// ══════════════════════════════════════════════
// DEV — BUTTON MANAGER (add / edit / delete nav buttons)
// ══════════════════════════════════════════════
// Extra nav buttons stored in localStorage
const _BTN_KEY='bontrager_extra_buttons_v1';
function _loadExtraButtons(){try{const r=localStorage.getItem(_BTN_KEY);return r?JSON.parse(r):[]}catch(e){return[];}}
function _saveExtraButtons(arr){try{localStorage.setItem(_BTN_KEY,JSON.stringify(arr));}catch(e){}}

const _STUDY_KEY='bontrager_study_mode_v1';
let _studyMode=false;

function toggleStudyMode(){
  _studyMode=!_studyMode;
  document.body.classList.toggle('study-mode',_studyMode);
  const btn=document.getElementById('studyModeBtn');
  if(btn){
    btn.style.color=_studyMode?'#22c55e':'var(--text2)';
    btn.title=_studyMode?'Exit Study Mode':'Study Mode';
  }
  try{ localStorage.setItem(_STUDY_KEY,_studyMode?'1':'0'); }catch(e){}
  _showToast(_studyMode?'Study Mode ON — distractions hidden':'Study Mode OFF', _studyMode?'#15803d':'var(--text)');
}

(function _initStudyMode(){
  try{
    if(localStorage.getItem(_STUDY_KEY)==='1'){
      _studyMode=true;
      document.body.classList.add('study-mode');
      const btn=document.getElementById('studyModeBtn');
      if(btn) btn.style.color='#22c55e';
    }
  }catch(e){}
})();

// ── 2. PROGRESS TRACKING ───────────────────────
const _VIEWED_KEY='bontrager_viewed_v2';
let _viewed={};

function _loadViewed(){
  try{ const r=localStorage.getItem(_VIEWED_KEY); if(r) _viewed=JSON.parse(r); }catch(e){}
}
function _saveViewed(){
  try{ localStorage.setItem(_VIEWED_KEY,JSON.stringify(_viewed)); }catch(e){}
}
function _posViewedId(chId,scId,posIdx){
  return (scId?chId+'_'+scId:chId)+'_'+posIdx;
}
function _markViewed(chId,scId,posIdx){
  const id=_posViewedId(chId,scId,posIdx);
  if(!_viewed[id]){
    _viewed[id]=Date.now();
    _saveViewed();
  }
}
function _isViewed(chId,scId,posIdx){
  return !!_viewed[_posViewedId(chId,scId,posIdx)];
}
function _chapterProgress(chId){
  const ch=BOOK[chId]; if(!ch) return {done:0,total:0};
  let done=0,total=0;
  const addPoss=(positions,scId)=>{
    (positions||[]).forEach((p,i)=>{
      total++;
      if(_isViewed(chId,scId,i)) done++;
    });
  };
  if(ch.positions) addPoss(ch.positions,null);
  if(ch.subchapters) Object.entries(ch.subchapters).forEach(([sid,sc])=>addPoss(sc.positions,sid));
  return {done,total};
}

// Patch openPos to auto-mark viewed

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function navTo(id){
  // Close any open modals
  const flashcardModal = document.getElementById('flashcardModal');
  if(flashcardModal) flashcardModal.classList.remove('show');
  
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const ni=document.getElementById('nav-'+id);
  if(ni)ni.classList.add('active');
  const titles={home:'Bontrager Positioning','learn-chapters':'Section 1 — Learn','quiz-chapters':'Section 2 — Quiz',ai:'Ask AI',settings:'Settings','about':'About','learn-subchapters':'','learn-positions':'','pos-view':'Position','quiz':'Quiz','score':'Results','dev-manager':'Developer Manager',quickreview:'⚡ Quick Review'};
  document.getElementById('headerTitle').textContent=titles[id]||'Bontrager Positioning';
  // AI input bar
  document.getElementById('aiBar').className='ai-input-bar'+(id==='ai'?' show':'');
  // Auto-test AI connection on first visit to AI page
  if(id==='ai'){
    setTimeout(_refreshTokenUI, 50);
    const dot=document.getElementById('aiStatusDot');
    if(dot && !dot.dataset.tested){
      dot.dataset.tested='1';
      testAIConnection();
    }
  }
  // Build dev manager
  if(id==='dev-manager') buildDevManager();
  window.scrollTo(0,0);
  // refresh stats on home
  if(id==='home') updateStats();
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
}

// ══════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════
function countPositions(){
  let total=0;
  Object.values(BOOK).forEach(ch=>{
    if(ch.positions) total+=ch.positions.length;
    if(ch.subchapters) Object.values(ch.subchapters).forEach(sc=>total+=sc.positions.length);
  });
  return total;
}

function updateStats(){
  const chaps=Object.keys(BOOK).length;
  const pos=countPositions();
  document.getElementById('homeChapters').textContent=chaps;
  document.getElementById('homePositions').textContent=pos;
  _updateHomeBest();
  const sb=document.getElementById('statsFooter');
  if(sb) sb.textContent=`${pos} positions · ${chaps} chapters`;
}

// ══════════════════════════════════════════════
// BUILD CHAPTER LISTS
// ══════════════════════════════════════════════
function buildChapters(){
  const ll=document.getElementById('learnChList');
  const ql=document.getElementById('quizChList');
  ll.innerHTML=''; ql.innerHTML='';

  Object.entries(BOOK).forEach(([id,ch])=>{
    // Count positions for this chapter
    let pn=0, qn=0;
    if(ch.positions){ pn+=ch.positions.length; }
    if(ch.subchapters){ Object.values(ch.subchapters).forEach(sc=>pn+=sc.positions.length); }

    // Quiz count (all flat quiz keys for this chapter)
    const qKeys=Object.keys(QUIZ).filter(k=>k===id||k.startsWith(id+'_'));
    qKeys.forEach(k=>{ if(QUIZ[k]) qn+=QUIZ[k].length; });

    // Learn button
    const lb=document.createElement('div');
    lb.style.position='relative';
    lb.innerHTML=buildChBtn(ch.icon, ch.name, `${pn} position${pn!==1?'s':''}`, 'learn');
    lb.querySelector('.ch-btn').onclick=()=>{
      if(ch.subchapters) openSubChapters(id);
      else openLearnChap(id, null);
    };
    // Dev: delete chapter button
    if(userRole==='developer'){
      const delBtn=document.createElement('button');
      delBtn.textContent='🗑';
      delBtn.title='Delete chapter';
      delBtn.style.cssText='position:absolute;top:50%;right:44px;transform:translateY(-50%);background:none;border:1px solid var(--red);color:var(--red);border-radius:6px;padding:4px 8px;font-size:13px;cursor:pointer;z-index:2';
      delBtn.onclick=(e)=>{e.stopPropagation();deleteChapter(id);};
      lb.appendChild(delBtn);
    }
    ll.appendChild(lb);

    // Quiz button
    const qb=document.createElement('div');
    qb.innerHTML=buildChBtn(ch.icon, ch.name, `${qn} question${qn!==1?'s':''}`, 'quiz');
    qb.querySelector('.ch-btn').onclick=()=>{
      if(ch.subchapters) openQuizSubChapters(id);
      else startQuiz(id);
    };
    ql.appendChild(qb);
  });

  buildAddChapterPanel();
  updateStats();
}

function buildChBtn(icon, name, sub, type){
  return `<button class="ch-btn"><span class="ch-icon">${icon}</span><div class="ch-info"><div class="ch-name">${name}</div><div class="ch-sub">${sub}</div></div><span class="ch-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span></button>`;
}

// New functions for enhancements
function filterChapters(){
  const query = document.getElementById('learnSearch').value.toLowerCase();
  const items = document.querySelectorAll('#learnChList > div');
  items.forEach(item => {
    const name = item.textContent.toLowerCase();
    item.style.display = name.includes(query) ? '' : 'none';
  });
}

function getPositionsForChap(chId, scId){
  if(scId){
    return BOOK[chId].subchapters[scId].positions || [];
  } else {
    return BOOK[chId].positions || [];
  }
}

function buildLearnPositions(chId, scId){
  const list = document.getElementById('learnPosList');
  list.innerHTML = '';
  const positions = getPositionsForChap(chId, scId);
  
  const mkSec = (title, filtered, type) => {
    if (!filtered.length) return;
    const sec = document.createElement('div');
    sec.className = 'pos-section';
    sec.innerHTML = `<div class="pos-section-title"><span class="dot dot-${type === 'routine' ? 'r' : 's'}"></span>${title}</div>`;
    filtered.forEach(pos => {
      const realIdx = positions.indexOf(pos);
      const btn = document.createElement('button');
      btn.className = 'pos-btn';
      const icon = getPositionIcon(pos.name);
      if(userRole === 'developer'){
        btn.innerHTML = `<span class="dot dot-${type === 'routine' ? 'r' : 's'}"></span><span style="font-size:16px;margin-right:8px">${icon}</span><span style="flex:1">${esc(pos.name)}</span>`;
      } else {
        btn.innerHTML = `<span class="dot dot-${type === 'routine' ? 'r' : 's'}"></span><span style="font-size:16px;margin-right:8px">${icon}</span>${esc(pos.name)}`;
      }
      btn.onclick = () => openPos(pos, chId, scId, realIdx);
      sec.appendChild(btn);
    });
    list.appendChild(sec);
  };
  
  mkSec('Routine', positions.filter(p => p.type === 'routine'), 'routine');
  mkSec('Special', positions.filter(p => p.type === 'special'), 'special');
}

function toggleFlashcardMode(){
  const list = document.getElementById('learnPosList');
  const toggle = document.getElementById('flashcardToggle');
  if(list.classList.contains('flashcard-mode')){
    list.classList.remove('flashcard-mode');
    toggle.textContent = '🃏 Flashcard Mode';
    // Rebuild normal list
    buildLearnPositions(curChapter, curSubchapter);
  } else {
    list.classList.add('flashcard-mode');
    toggle.textContent = '📋 Normal Mode';
    // Build flashcard view
    buildFlashcards(curChapter, curSubchapter);
  }
}

function buildFlashcards(chap, sub){
  const list = document.getElementById('learnPosList');
  list.innerHTML = '';
  const positions = getPositionsForChap(chap, sub);
  positions.forEach((pos, idx) => {
    const card = document.createElement('div');
    card.className = 'flashcard';
    const desc = (pos.info?.desc || '').trim() || 'No description';
    const icon = getPositionIcon(pos.name);
    card.innerHTML = `
      <div class="flashcard-inner" data-title="${esc(pos.name)}" data-desc="${esc(desc)}" data-icon="${icon}">
        <div class="flashcard-front">
          <div style="font-size:48px;margin-bottom:16px">${icon}</div>
          <div style="text-align:center;word-wrap:break-word;max-width:90%">${esc(pos.name)}</div>
        </div>
        <div class="flashcard-back">
          <div style="text-align:center;word-wrap:break-word;max-width:95%">${esc(desc)}</div>
        </div>
      </div>
    `;
    const inner = card.querySelector('.flashcard-inner');
    inner.addEventListener('click', function(){
      openFlashcardModal(this.dataset.title, this.dataset.desc, this.dataset.icon);
    });
    list.appendChild(card);
  });
}

function openFlashcardModal(title, desc, icon){
  const modal = document.getElementById('flashcardModal');
  const inner = document.getElementById('flashcardModalInner');
  const front = document.getElementById('flashcardModalFront');
  const back = document.getElementById('flashcardModalBack');
  
  if(!modal || !inner || !front || !back) return;
  
  front.innerHTML = `<div style="font-size:56px;margin-bottom:20px">${icon}</div><div style="text-align:center;word-wrap:break-word">${title}</div>`;
  back.innerHTML = `<div style="text-align:center;word-wrap:break-word;max-width:95%">${desc}</div>`;
  
  inner.classList.remove('flipped');
  modal.classList.add('show');
  modal.style.display = 'flex';
}

function closeFlashcardModal(){
  const modal = document.getElementById('flashcardModal');
  const inner = document.getElementById('flashcardModalInner');
  inner.classList.remove('flipped');
  modal.classList.remove('show');
  modal.style.display = 'none';
}

function toggleFlashcardModalFlip(){
  const inner = document.getElementById('flashcardModalInner');
  inner.classList.toggle('flipped');
}

// Close modal when clicking on background
document.getElementById('flashcardModal')?.addEventListener('click', function(e){
  if(e.target === this) closeFlashcardModal();
});

// Close modal with Escape key
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeFlashcardModal();
});

function flipCard(el){
  el.closest('.flashcard').classList.toggle('flipped');
}


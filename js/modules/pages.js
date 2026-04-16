function navigatePosition(dir){
  if(!currentPositions || !currentPosId) return;
  const currentIdx = currentPositions.findIndex(p => p.id === currentPosId);
  const newIdx = currentIdx + dir;
  if(newIdx >= 0 && newIdx < currentPositions.length){
    const newPos = currentPositions[newIdx];
    // Find the posIdx for the new position
    const flat = _getAllPosFlat();
    const found = flat.find(p => `${p.chId}_${p.scId || 'null'}_${p.posIdx}` === newPos.id);
    if(found) openPos(newPos, found.chId, found.scId, found.posIdx);
    
    // Update button states after navigation
    setTimeout(() => {
      const prevBtn = document.getElementById('prevPosBtn');
      const nextBtn = document.getElementById('nextPosBtn');
      if(prevBtn) prevBtn.disabled = newIdx <= 0;
      if(nextBtn) nextBtn.disabled = newIdx >= currentPositions.length - 1;
    }, 100);
  }
}

function toggleNotes(){
  const sec = document.getElementById('notesSection');
  sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
  if(sec.style.display === 'block'){
    const notes = localStorage.getItem(`notes_${currentPosId}`) || '';
    document.getElementById('posNotes').value = notes;
  }
}

function saveNotes(){
  const notes = document.getElementById('posNotes').value;
  localStorage.setItem(`notes_${currentPosId}`, notes);
}

function updateBreadcrumbs(page, path){
  const bc = document.getElementById(page + 'Breadcrumbs');
  if(!bc) return;
  const parts = path.split(' > ');
  const html = parts.map((part, idx) => {
    const clickAction = _getBreadcrumbAction(page, parts, idx);
    return `<span class="bc-item" ${clickAction ? `onclick="${clickAction}" style="cursor:pointer;color:var(--accent)"` : ''} title="${part.length > 20 ? part : ''}">${part}</span>`;
  }).join('<span class="bc-sep"> > </span>');
  bc.innerHTML = html;
}

function _getBreadcrumbAction(page, parts, idx){
  if(parts[0] === 'Home') {
    if(idx === 0) return `navTo('home')`;
  }
  // For chapter-level breadcrumbs
  if(parts.length > 1 && parts[1]) {
    const chId = Object.keys(BOOK).find(k => BOOK[k].name === parts[1]);
    if(idx === 1 && chId) return `openLearnChap('${chId}', null)`;
    if(idx === 2 && chId && parts[2]) {
      const scId = Object.keys(BOOK[chId].subchapters || {}).find(k => BOOK[chId].subchapters[k].name === parts[2]);
      if(scId) return `openLearnChap('${chId}', '${scId}')`;
    }
  }
  return null;
}

function toggleDesc(){
  const desc = document.getElementById('posViewDesc');
  const toggle = document.getElementById('descToggle');
  if(desc.classList.contains('expanded')){
    desc.classList.remove('expanded');
    desc.style.maxHeight = '100px';
    desc.style.overflow = 'hidden';
    toggle.querySelector('button').textContent = 'اقرأ المزيد';
  } else {
    desc.classList.add('expanded');
    desc.style.maxHeight = 'none';
    desc.style.overflow = 'visible';
    toggle.querySelector('button').textContent = 'اقرأ أقل';
  }
}

// ══════════════════════════════════════════════
// SUB-CHAPTERS
// ══════════════════════════════════════════════
function openSubChapters(chId){
  updateBreadcrumbs('subCh', `Home > ${BOOK[chId].name}`);
  const ch=BOOK[chId];
  curChapter=chId;
  document.getElementById('subChTitle').textContent=ch.name;
  document.getElementById('subChBackBtn').onclick=()=>navTo('learn-chapters');
  const list=document.getElementById('subChList');
  list.innerHTML='';

  Object.entries(ch.subchapters).forEach(([scId,sc])=>{
    const pn=sc.positions.length;
    const row=document.createElement('div');
    row.className='sub-ch-indent';
    row.innerHTML=`<button class="sub-ch-btn">
      <span class="sub-ch-icon">${sc.icon||'📋'}</span>
      <div class="sub-ch-info">
        <div class="sub-ch-name">${sc.name}</div>
        <div class="sub-ch-sub">${pn} position${pn!==1?'s':''}</div>
      </div>
      <span class="sub-ch-arrow">›</span>
    </button>`;
    row.querySelector('.sub-ch-btn').onclick=()=>openLearnChap(chId, scId);
    list.appendChild(row);
  });

  // DEV panel: manage subchapters
  const devPanel=document.getElementById('devSubChPanel');
  devPanel.innerHTML='';
  if(userRole==='developer'){
    devPanel.style.display='block';
    devPanel.innerHTML=`
      <div class="dev-panel">
        <div class="dev-panel-header"><div class="dev-panel-title">Manage Sub-chapters</div></div>
        <div class="dev-panel-body">
          ${Object.entries(ch.subchapters).map(([scId,sc])=>`
            <div class="dev-item-row">
              <div class="dev-item-name">${sc.icon||''} ${sc.name}</div>
              <button class="dev-small-btn red" onclick="deleteSubChapter('${chId}','${scId}')">Delete</button>
            </div>`).join('')}
          <div class="dev-add-row">
            <input id="newSubChId_${chId}" placeholder="ID (e.g. wrist)">
            <input id="newSubChName_${chId}" placeholder="Name (e.g. Wrist)">
            <button onclick="addSubChapter('${chId}')">+ Add</button>
          </div>
        </div>
      </div>`;
  }

  navTo('learn-subchapters');
}

function addSubChapter(chId){
  const idInp=document.getElementById(`newSubChId_${chId}`);
  const nameInp=document.getElementById(`newSubChName_${chId}`);
  const newId=idInp.value.trim().replace(/\s+/g,'_').toLowerCase();
  const newName=nameInp.value.trim();
  if(!newId||!newName){alert('Enter both ID and Name.');return;}
  if(BOOK[chId].subchapters[newId]){alert('Sub-chapter ID already exists.');return;}
  BOOK[chId].subchapters[newId]={name:newName,icon:'📋',positions:[]};
  QUIZ[`${chId}_${newId}`]=[];
  idInp.value=''; nameInp.value='';
  openSubChapters(chId);
}

function deleteSubChapter(chId, scId){
  const sc=BOOK[chId].subchapters[scId];
  showConfirm('Delete Sub-chapter',`Delete "${sc.name}" and all its positions?`,()=>{
    delete BOOK[chId].subchapters[scId];
    delete QUIZ[`${chId}_${scId}`];
    openSubChapters(chId);
    buildChapters();
  });
}

function openQuizSubChapters(chId){
  const ch=BOOK[chId];
  // show a simple subchapter picker inline
  const ql=document.getElementById('quizChList');
  // Just show full list including sub-items by rebuilding
  buildChapters();
  // Actually navigate to sub-chapter selection via a temporary overlay using learn subchapters page
  curChapter=chId;
  document.getElementById('subChTitle').textContent=ch.name+' — Quiz';
  document.getElementById('subChBackBtn').onclick=()=>navTo('quiz-chapters');
  const list=document.getElementById('subChList');
  list.innerHTML='';

  // Also add a "All questions" option if there are top-level quiz keys for this chapter
  const topQKey=chId;
  if(QUIZ[topQKey]&&QUIZ[topQKey].length){
    const qn=QUIZ[topQKey].length;
    const allRow=document.createElement('div');
    allRow.className='sub-ch-indent';
    allRow.innerHTML=`<button class="sub-ch-btn">
      <span class="sub-ch-icon" style="font-size:15px">≡</span>
      <div class="sub-ch-info">
        <div class="sub-ch-name">All Questions</div>
        <div class="sub-ch-sub">${qn} question${qn!==1?'s':''}</div>
      </div>
      <span class="sub-ch-arrow">›</span>
    </button>`;
    allRow.querySelector('.sub-ch-btn').onclick=()=>startQuiz(topQKey);
    list.appendChild(allRow);
  }

  Object.entries(ch.subchapters).forEach(([scId,sc])=>{
    // Try both naming conventions: chId_scId AND chId_chId_scId (for nested patterns)
    const qKey=`${chId}_${scId}`;
    const qn=(QUIZ[qKey]||[]).length;
    const row=document.createElement('div');
    row.className='sub-ch-indent';
    row.innerHTML=`<button class="sub-ch-btn">
      <span class="sub-ch-icon">${sc.icon||'📋'}</span>
      <div class="sub-ch-info">
        <div class="sub-ch-name">${sc.name}</div>
        <div class="sub-ch-sub">${qn} question${qn!==1?'s':''}</div>
      </div>
      <span class="sub-ch-arrow">›</span>
    </button>`;
    row.querySelector('.sub-ch-btn').onclick=()=>startQuiz(qKey);
    list.appendChild(row);
  });
  document.getElementById('devSubChPanel').style.display='none';
  navTo('learn-subchapters');
}

// ══════════════════════════════════════════════
// LEARN
// ══════════════════════════════════════════════
function openLearnChap(chId, scId){
  scId = scId || null;
  updateBreadcrumbs('learnPos', `Home > ${BOOK[chId].name}${scId ? ' > ' + BOOK[chId].subchapters[scId].name : ''}`);
  curChapter=chId; curSubchapter=scId;
  editChId=chId;
  let ch, positions, backTarget;
  if(scId){
    ch=BOOK[chId].subchapters[scId];
    positions=ch.positions;
    backTarget=()=>openSubChapters(chId);
    document.getElementById('learnPosBackBtn').onclick=backTarget;
  } else {
    ch=BOOK[chId];
    positions=ch.positions||[];
    document.getElementById('learnPosBackBtn').onclick=()=>navTo('learn-chapters');
  }
  document.getElementById('learnPosTitle').textContent=ch.name;

  const list=document.getElementById('learnPosList');
  list.innerHTML='';
  const mkSec=(title,filtered,type)=>{
    if(!filtered.length)return;
    const sec=document.createElement('div');
    sec.className='pos-section';
    sec.innerHTML=`<div class="pos-section-title"><span class="dot dot-${type==='routine'?'r':'s'}"></span>${title}</div>`;
    filtered.forEach(pos=>{
      const realIdx=positions.indexOf(pos);
      const btn=document.createElement('button');
      btn.className='pos-btn';

      const icon = getPositionIcon(pos.name);
      if(userRole==='developer'){
        btn.innerHTML=`<span class="dot dot-${type==='routine'?'r':'s'}"></span><span style="font-size:16px;margin-right:8px">${icon}</span><span style="flex:1">${esc(pos.name)}</span>`;
      } else {
        btn.innerHTML=`<span class="dot dot-${type==='routine'?'r':'s'}"></span><span style="font-size:16px;margin-right:8px">${icon}</span>${esc(pos.name)}`;
      }
      btn.onclick=()=>openPos(pos, chId, scId, realIdx);
      sec.appendChild(btn);
    });
    list.appendChild(sec);
  };
  mkSec('Routine', positions.filter(p=>p.type==='routine'), 'routine');
  mkSec('Special', positions.filter(p=>p.type==='special'), 'special');

  // DEV: Add Position panel
  const devPanel=document.getElementById('devAddPosPanel');
  devPanel.innerHTML='';
  if(userRole==='developer'){
    devPanel.style.display='block';
    devPanel.innerHTML=`
      <div class="dev-panel" style="margin-top:16px">
        <div class="dev-panel-header"><div class="dev-panel-title">Add New Position</div></div>
        <div class="dev-panel-body">
          <div class="dev-add-row">
            <input id="newPosName" placeholder="Position name">
            <select id="newPosType" style="padding:8px;border:1px solid var(--border2);border-radius:var(--radius-sm);background:var(--bg2);color:var(--text);font-family:var(--font)">
              <option value="routine">Routine</option>
              <option value="special">Special</option>
            </select>
          </div>
          <div style="margin-top:8px">
            <button style="width:100%;padding:10px;border-radius:var(--radius-sm);border:none;background:var(--green);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)" onclick="addPosition('${chId}','${scId||''}')">+ Add Position</button>
          </div>
        </div>
      </div>`;
  }

  navTo('learn-positions');
  updateDevUI();
}

function addPosition(chId, scId){
  const name=document.getElementById('newPosName').value.trim();
  const type=document.getElementById('newPosType').value;
  if(!name){alert('Enter a position name.');return;}
  const newPos={name, type, info:{desc:'', cr:'', ir:'', sid:'', kv:'', resp:''}};
  if(scId && BOOK[chId].subchapters && BOOK[chId].subchapters[scId]){
    BOOK[chId].subchapters[scId].positions.push(newPos);
  } else if(BOOK[chId].positions){
    BOOK[chId].positions.push(newPos);
  }
  document.getElementById('newPosName').value='';
  openLearnChap(chId, scId||null);
  buildChapters();
  if(userRole==='developer'){devSaveData();_showToast('💾 تم حفظ الوضعية الجديدة');}
}

// ══════════════════════════════════════════════
// QUICK REVIEW PAGE BUILDER
// ══════════════════════════════════════════════
function buildQuickReview(){
  const container=document.getElementById('qrContent');
  if(!container) return;

  // Collect all positions
  const all=[];
  Object.entries(BOOK).forEach(([chId,ch])=>{
    const chName=ch.name||'';
    if(ch.positions) ch.positions.forEach(p=>all.push({pos:p,chapter:chName,chId,scId:null}));
    if(ch.subchapters) Object.entries(ch.subchapters).forEach(([scId,sc])=>{
      (sc.positions||[]).forEach(p=>all.push({pos:p,chapter:chName+' › '+sc.name,chId,scId}));
    });
  });

  // Top routine positions (first 10 routines)
  const routines=all.filter(x=>x.pos.type==='routine').slice(0,10);
  // Top special / exam favorites
  const specials=all.filter(x=>x.pos.type==='special').slice(0,8);
  // All unique CR angles (non-perpendicular)
  const crAngles=all.filter(x=>x.pos.info?.cr && !/perpendicular/i.test(x.pos.info.cr)).slice(0,12);

  function posCard(item){
    const p=item.pos;
    const info=p.info||{};
    const crShort=(info.cr||'Perpendicular').replace(/CR\s+directed\s+/i,'').replace(/CR\s+/i,'').slice(0,70);
    return `<div class="qr-card">
      <div class="qr-card-name">${esc(p.name)}</div>
      <div class="qr-card-cr">🟢 ${esc(crShort)}</div>
      <div class="qr-card-note">📁 ${esc(item.chapter)}</div>
    </div>`;
  }

  // Top 10 "fatal" errors list — fixed known ones
  const topErrors=[
    {pos:'AP Ankle',err:'External rotation → joint space not open',fix:'Internally rotate 15–20°'},
    {pos:'Mortise Ankle',err:'Rotation error → superimposed malleoli',fix:'True 15–20° internal rotation'},
    {pos:'PA Chest',err:'Rotation → mediastinum shifted',fix:'Check symmetry of clavicles'},
    {pos:'Lateral Chest',err:'Arms not raised → soft tissue superimposed',fix:'Raise arms above head'},
    {pos:'AP Hip',err:'Leg not internally rotated → lesser trochanter visible',fix:'Internally rotate 15–20°'},
    {pos:'PA Wrist',err:'Wrist not flat → foreshortening',fix:'Arch hand slightly for contact'},
    {pos:'AP Elbow',err:'Elbow not fully extended → joint not open',fix:'Fully extend if possible'},
    {pos:'PA Oblique Hand',err:'Insufficient 45° angle → metacarpals overlap',fix:'Use 45° wedge sponge'},
    {pos:'Lateral Lumbar',err:'Pelvis not lateral → rotation artifact',fix:'True lateral: ASIS aligned'},
  ];

  let html='';
  html+=`<div class="qr-section">
    <div class="qr-section-title"><span class="dot dot-r"></span> Top 10 Routine Positions</div>
    ${routines.map(x=>posCard(x)).join('')}
  </div>`;

  html+=`<div class="qr-section">
    <div class="qr-section-title"><span style="width:8px;height:8px;border-radius:50%;background:#ec4899;display:inline-block"></span> Key Special Positions</div>
    ${specials.map(x=>posCard(x)).join('')}
  </div>`;

  html+=`<div class="qr-section">
    <div class="qr-section-title">🟢 Key CR Angles (non-perpendicular)</div>
    ${crAngles.map(x=>{
      const info=x.pos.info||{};
      return `<div class="qr-card">
        <div class="qr-card-name">${esc(x.pos.name)}</div>
        <div class="qr-card-cr">🟢 ${esc(info.cr||'')}</div>
        <div class="qr-card-note">📁 ${esc(x.chapter)}</div>
      </div>`;
    }).join('')}
  </div>`;

  html+=`<div class="qr-section">
    <div class="qr-section-title">🔴 Top 10 Fatal Errors</div>
    ${topErrors.map(e=>`
      <div class="qr-card">
        <div class="qr-card-name">❌ ${e.pos}</div>
        <div class="qr-card-cr" style="color:var(--c-warn)">👁 ${e.err}</div>
        <div class="qr-card-note" style="color:var(--c-cr)">🔧 ${e.fix}</div>
      </div>`).join('')}
  </div>`;

  container.innerHTML=html;
}

// ── Get flat list of all positions for navigation ──
function _getAllPosFlat(){
  const list=[];
  Object.entries(BOOK).forEach(([chId,ch])=>{
    if(ch.subchapters){
      Object.entries(ch.subchapters).forEach(([scId,sc])=>{
        (sc.positions||[]).forEach((p,i)=>list.push({pos:p,chId,scId,posIdx:i}));
      });
    } else {
      (ch.positions||[]).forEach((p,i)=>list.push({pos:p,chId,scId:null,posIdx:i}));
    }
  });
  return list;
}

function openPos(pos, chId, scId, posIdx){
  scId = scId || null;
  curPos=pos; editChId=chId; editPosIdx=posIdx; curSubchapter=scId;
  currentPosId = `${chId}_${scId || 'null'}_${posIdx}`;
  currentPositions = _getAllPosFlat().filter(p => p.chId === chId && (p.scId === scId || (p.scId === null && scId === null))).map(p => ({id: `${p.chId}_${p.scId || 'null'}_${p.posIdx}`, ...p.pos}));
  if(currentPositions.length === 0) {
    currentPositions = [pos]; // fallback
  }
  _refreshPosImgDisplay();
  document.getElementById('posViewTitle').textContent=pos.name;
  const info=pos.info||{};
  const description = info.desc || '';
  document.getElementById('posViewDesc').textContent = description;

  // ── Generate tags ──
  const chObj=chId? (scId? (BOOK[chId]?.subchapters?.[scId]): BOOK[chId]): null;
  const chName=chObj?.name||'';
  const posName=pos.name||'';
  const isExamFav=/(chest|ankle|hip|spine|skull|wrist|knee|elbow|shoulder|foot|hand|pelvis)/i.test(chName+posName);
  const isDailyRoutine=pos.type==='routine';
  const isWeightBearing=/weight.?bearing|erect|standing/i.test(posName+' '+(info.desc||''));
  const isTrauma=/trauma|fracture|injury/i.test(info.desc||'');
  const tags=[];
  if(chName) tags.push({cls:'tag-region',txt:'#'+chName.replace(/\s+/g,'').toLowerCase()});
  if(isExamFav) tags.push({cls:'tag-exam',txt:'★ Exam Fav'});
  if(isDailyRoutine) tags.push({cls:'tag-daily',txt:'Daily Routine'});
  if(isWeightBearing) tags.push({cls:'tag-special',txt:'Weight-Bearing'});
  if(isTrauma) tags.push({cls:'tag-special',txt:'Trauma'});
  const tagsHtml=tags.map(t=>`<span class="tag ${t.cls}">${t.txt}</span>`).join('');

  // ── Parse desc into structured data ──
  const desc=info.desc||'';
  const cr=info.cr||'';
  const sid=info.sid||'';
  const kv=info.kv||'';
  const ir=info.ir||'';
  const resp=info.resp||'';
  const altPos=info.altPos||'';      // "If patient can't…" alternative
  const compareNote=info.compareNote||''; // Comparison micro-block
  const fatalError=info.fatalError||'';   // Most common fatal error
  const scan3=info.scan3||'';        // 3-Second Scan line
  const customErrors=info.customErrors||[]; // Dev-defined errors with severity
  const decisionTree=info.decisionTree||''; // Decision tree text

  // ── Infer position setup from desc ──
  function extractPatientPos(d){
    const m=d.match(/patient\s+([^.]{5,80})\./i);
    return m?m[1].trim():'See description below.';
  }

  // ── "Image is correct if" — infer or use stored ──
  function inferCorrectIf(d,crVal,pName){
    if(info.correctIf && info.correctIf.length) return info.correctIf;
    const checks=[];
    if(/open\s+joint|joint\s+space\s+open/i.test(d)) checks.push('Joint space is open and visible');
    if(/no\s+superimposition|without\s+superimposition/i.test(d)) checks.push('No superimposition of structures');
    if(/mortise/i.test(pName+' '+d)) checks.push('Mortise joint open (all 3 joint spaces equal)');
    if(/true\s+lateral/i.test(d)) checks.push('True lateral: superimposition confirmed');
    if(/true\s+ap|true\s+pa/i.test(pName+' '+d)) checks.push('True AP/PA: no rotation');
    if(/radius.*ulna|ulna.*radius/i.test(d)) checks.push('Radius and ulna not superimposed (or superimposed for lateral)');
    if(/scaphoid/i.test(d)) checks.push('Scaphoid without foreshortening');
    if(/carpal/i.test(d)) checks.push('Carpal bones visible without excessive overlap');
    if(!checks.length){
      checks.push('Part centered to CR and IR');
      checks.push('Anatomy of interest fully included');
    }
    return checks;
  }

  // ── Common errors — use stored or infer ──
  function inferErrors(d,pName){
    if(customErrors.length) return customErrors;
    const errs=[];
    if(/rotat/i.test(d)) errs.push({severity:'high',err:'Patient/Part rotation',visual:'Asymmetric joint spaces or bone shapes',fix:'Re-check patient alignment; use palpation landmarks'});
    if(/superimpos/i.test(d)) errs.push({severity:'high',err:'Structures superimposed',visual:'Key anatomy obscured or overlapping',fix:'Adjust rotation or CR angle per protocol'});
    if(/weight.?bearing/i.test(pName+' '+d)) errs.push({severity:'medium',err:'Patient not full weight-bearing',visual:'Joint spaces appear wider than true',fix:'Ensure patient fully standing on part'});
    if(/perpendicular/i.test(d)) errs.push({severity:'medium',err:'Wrong CR angle',visual:'Joint space closed or anatomy foreshortened',fix:'Verify CR is perpendicular (or use specified angle)'});
    errs.push({severity:'tip',err:'Insufficient collimation',visual:'Excessive scatter, low contrast',fix:'Collimate to part of interest only'});
    if(errs.length>4) errs.splice(4);
    return errs;
  }

  const correctChecks=inferCorrectIf(desc,cr,posName);
  const commonErrors=inferErrors(desc,posName);

  // ── 3-Second Scan bar ──
  const scan3Content=scan3||(_build3SecScan(cr,ir,kv,resp));
  const scan3Html=`
    <div class="scan3-bar">
      <span class="scan3-title"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 3s Scan</span>
      <span class="scan3-text">${esc(scan3Content)}</span>
    </div>`;

  function _build3SecScan(c,i,k,r){
    const parts=[];
    if(c) parts.push('CR: '+c.replace(/,.*$/,'').slice(0,40));
    if(k) parts.push('kVp: '+k);
    if(r) parts.push('Resp: '+r.split(' ').slice(0,3).join(' '));
    return parts.join(' · ')||'See technical parameters below';
  }

  // ── Fatal Error callout ──
  const fatalHtml=fatalError?`
    <div style="background:var(--c-warn-bg);border:2px solid var(--c-warn-border);border-radius:var(--radius-sm);padding:9px 13px;margin-bottom:11px">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--c-warn);margin-bottom:4px">❌ Most Common Fatal Error</div>
      <div style="font-size:13px;color:var(--text);font-weight:600">${esc(fatalError)}</div>
    </div>`:''

  // ── Fast Summary ──
  const crShort=cr.replace(/^CR\s+/i,'').replace(/directed\s+to\s+/i,'→ ').replace(/angled\s+/i,'∠ ');
  const fastSummaryHtml=`
    <div class="fast-summary">
      <div class="fast-summary-title" style="display:flex;align-items:center;gap:6px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Fast Clinical Summary</div>
      <div class="fast-row"><span class="fast-key" style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c-position)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Position</span><span class="fast-val">${extractPatientPos(desc)}</span></div>
      <div class="fast-row"><span class="fast-key" style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c-cr)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> CR</span><span class="fast-val">${crShort||'Perpendicular to IR'}</span></div>
      <div class="fast-row"><span class="fast-key" style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> IR</span><span class="fast-val">${ir||'—'}</span></div>
      <div class="fast-row"><span class="fast-key" style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c-eval)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> kVp</span><span class="fast-val">${kv||'—'}</span></div>
      <div class="fast-row"><span class="fast-key" style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c-clinical)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Resp</span><span class="fast-val">${resp||'N/A'}</span></div>
    </div>`;

  // ── Correct If box ──
  const correctIfHtml=`
    <div class="correct-if-box">
      <div class="correct-if-title"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Image is correct if…</div>
      ${correctChecks.map(c=>`<div class="correct-if-item"><span class="correct-if-check">✓</span><span>${c}</span></div>`).join('')}
    </div>`;

  // ── Severity map ──
  const sevMap={high:'🔴',medium:'🟠',tip:'🟡'};
  const sevLabel={high:'HIGH RISK',medium:'MEDIUM',tip:'TIP'};

  // ── Common Errors box with severity ──
  const errorsHtml=`
    <div class="pos-sec-hdr warn-hdr"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Common Errors</div>
    ${fatalHtml}
    <div class="errors-box">
      ${commonErrors.map(e=>`
        <div class="error-item">
          <div class="error-title">${sevMap[e.severity]||'🔴'} ${e.err}<span class="err-severity err-${e.severity||'high'}">${sevLabel[e.severity||'high']}</span></div>
          <div class="error-desc">👁 Appears as: ${e.visual}</div>
          <div class="error-fix">🔧 Fix: ${e.fix}</div>
        </div>`).join('')}
    </div>`;

  // ── Tech ref box ──
  const techRefHtml=`
    <div class="tech-ref-box">
      <div class="tech-ref-title">Technical Parameters</div>
      ${cr?`<div class="tech-ref-row"><span class="tech-ref-label"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> CR</span><span class="tech-ref-val">${cr}</span></div>`:''}
      ${ir?`<div class="tech-ref-row"><span class="tech-ref-label"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> IR Size</span><span class="tech-ref-val">${ir}</span></div>`:''}
      ${sid?`<div class="tech-ref-row"><span class="tech-ref-label"><svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> SID</span><span class="tech-ref-val">${sid}</span></div>`:''}
      ${kv?`<div class="tech-ref-row"><span class="tech-ref-label"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> kVp</span><span class="tech-ref-val">${kv}</span></div>`:''}
      ${resp?`<div class="tech-ref-row"><span class="tech-ref-label"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Respiration</span><span class="tech-ref-val">${resp}</span></div>`:''}
    </div>
    ${_buildMaRefCard(kv,info)}`;

  // ── If Patient Can't box ──
  const altPosHtml=altPos?`
    <div class="alt-pos-box">
      <div class="alt-pos-title">♿ If patient can't do this position:</div>
      ${altPos.split('\n').filter(l=>l.trim()).map(l=>`<div class="alt-pos-item">${esc(l.replace(/^[-→]\s*/,''))}</div>`).join('')}
    </div>`:'';

  // ── Comparison micro-block ──
  const compareHtml=compareNote?`
    <div class="compare-block">
      <div class="compare-title">⚖️ Quick Comparison</div>
      ${compareNote.split('\n').filter(l=>l.trim()).map(l=>{
        const [label,val]=(l+':').split(':');
        return `<div class="compare-row"><span class="compare-label">${esc(label.trim())}</span><span class="compare-val">${esc((val||'').replace(/^:/,'').trim())}</span></div>`;
      }).join('')}
    </div>`:'';

  // ── Decision Tree ──
  const dtHtml=decisionTree?`
    <div style="background:var(--c-clinical-bg);border:1.5px solid var(--c-clinical-border);border-radius:var(--radius-sm);padding:10px 13px;margin-bottom:11px">
      <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--c-clinical);margin-bottom:6px">🌳 Decision Tree</div>
      <div style="font-size:12.5px;color:var(--text);line-height:1.7;font-family:monospace">${esc(decisionTree).replace(/\n/g,'<br>')}</div>
    </div>`:'';

  // ── Layer toggle bar ──
  const layerBarHtml=`
    <div class="layer-toggle-bar" id="layerBar" role="toolbar" aria-label="Layer controls">
      <span>Show:</span>
      <button class="ltog-btn active" data-layer="position" onclick="toggleLayer('position')" aria-pressed="true">Position</button>
      <button class="ltog-btn active" data-layer="cr" onclick="toggleLayer('cr')" aria-pressed="true">🟢 CR</button>
      <button class="ltog-btn active" data-layer="anatomy" onclick="toggleLayer('anatomy')" aria-pressed="true">🧠 Anatomy</button>
      <button class="ltog-btn active" data-layer="errors" onclick="toggleLayer('errors')" aria-pressed="true">⚠️ Errors</button>
    </div>`;

  // ── Quick Flip navigation ──
  const allPosFlat=_getAllPosFlat();
  const curIdx=allPosFlat.findIndex(x=>x.pos===pos);
  const prevItem=curIdx>0?allPosFlat[curIdx-1]:null;
  const nextItem=curIdx<allPosFlat.length-1?allPosFlat[curIdx+1]:null;
  const flipHtml=`
    <div class="pos-flip-bar">
      <button class="flip-btn prev" ${!prevItem?'disabled style="opacity:.35"':''}
        onclick="${prevItem?`openPos(_getAllPosFlat()[${curIdx-1}].pos,_getAllPosFlat()[${curIdx-1}].chId,_getAllPosFlat()[${curIdx-1}].scId,_getAllPosFlat()[${curIdx-1}].posIdx)`:'void(0)'}">
        ← <span>${prevItem?esc(prevItem.pos.name.slice(0,30)):'First position'}</span>
      </button>
      <button class="flip-btn next" ${!nextItem?'disabled style="opacity:.35"':''}
        onclick="${nextItem?`openPos(_getAllPosFlat()[${curIdx+1}].pos,_getAllPosFlat()[${curIdx+1}].chId,_getAllPosFlat()[${curIdx+1}].scId,_getAllPosFlat()[${curIdx+1}].posIdx)`:'void(0)'}">
        <span>${nextItem?esc(nextItem.pos.name.slice(0,30)):'Last position'}</span> →
      </button>
    </div>`;

  // ── Exam mode panel ──
  const examHtml=`
    ${scan3Html}
    ${layerBarHtml}
    <div id="layer-cr">
      <div class="pos-sec-hdr cr-hdr"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> CR &amp; Angle</div>
      <div class="pos-sec-block cr-blk">${cr||'Perpendicular to IR'}</div>
    </div>
    <div id="layer-position">${correctIfHtml}</div>
    <div id="layer-anatomy">
      <div class="pos-sec-hdr eval-hdr"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> What Must Appear on X-ray</div>
      <div class="pos-sec-block eval-blk">${desc?desc.replace(/patient[^.]+\./gi,'').replace(/^\s+/,'').slice(0,300)+'…':'See description below.'}</div>
      ${techRefHtml}
    </div>
    <div id="layer-errors">${errorsHtml}</div>
    ${altPosHtml}
    ${compareHtml}
    ${dtHtml}
    ${flipHtml}`;

  // ── Clinical mode panel ──
  const clinicalHtml=`
    ${scan3Html}
    ${layerBarHtml}
    ${fastSummaryHtml}
    <div id="layer-position">
      <div class="pos-sec-hdr position-hdr"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Patient &amp; Part Position</div>
      <div class="pos-sec-block position-blk">${desc||'No description available.'}</div>
    </div>
    <div id="layer-cr">${correctIfHtml}</div>
    <div id="layer-anatomy"><!-- anatomy visible in exam mode --></div>
    <div id="layer-errors">${errorsHtml}</div>
    ${altPosHtml}
    ${compareHtml}
    ${dtHtml}
    ${flipHtml}`;

  // ── Share Safe Export button (dev only) ──
  const shareSafeHtml=userRole==='developer'?`
    <button class="share-safe-btn" onclick="exportShareSafe()">
      📤 Export Share-Safe Version (no dev notes, no personal data)
    </button>`:'';

  // ── Build the full tech card replacement ──
  const newContent=`
    ${tagsHtml?`<div class="tags-row">${tagsHtml}</div>`:''}
    ${shareSafeHtml}
    ${_buildTestYourselfBtn(chId,scId)}
    <div class="mode-tabs">
      <button class="mode-tab active-exam" id="tabExam" onclick="switchPosMode('exam')">Exam Mode</button>
      <button class="mode-tab" id="tabClinical" onclick="switchPosMode('clinical')">Clinical Mode</button>
    </div>
    <div class="mode-panel active" id="panelExam">${examHtml}</div>
    <div class="mode-panel" id="panelClinical">${clinicalHtml}</div>`;

  // Inject into the view
  document.getElementById('posViewDesc').innerHTML='';
  document.getElementById('posViewTech').innerHTML=newContent;

  document.getElementById('posBackBtn').onclick=()=>openLearnChap(chId, scId||null);
  updateDevUI();
  // Update breadcrumbs and progress
  const chapterName = BOOK[chId]?.name || '';
  const subchapterName = scId ? BOOK[chId]?.subchapters?.[scId]?.name : '';
  updateBreadcrumbs('pos', `Home > ${chapterName}${subchapterName ? ' > ' + subchapterName : ''} > ${pos.name}`);
  updateProgress();
  // Update nav buttons
  const prevBtn = document.getElementById('prevPosBtn');
  const nextBtn = document.getElementById('nextPosBtn');
  const currentIdx = currentPositions.findIndex(p => p.id === currentPosId);
  if(prevBtn) prevBtn.disabled = currentIdx <= 0;
  if(nextBtn) nextBtn.disabled = currentIdx >= currentPositions.length - 1;
  navTo('pos-view');
}

// ── Layer toggle ──
let _layerState={position:true,cr:true,anatomy:true,errors:true};
function toggleLayer(name){
  _layerState[name]=!_layerState[name];
  document.querySelectorAll(`[data-layer="${name}"]`).forEach(btn=>{
    btn.classList.toggle('active',_layerState[name]);
    btn.setAttribute('aria-pressed', _layerState[name] ? 'true' : 'false');
  });
  // Toggle all elements with id="layer-{name}" in both panels
  document.querySelectorAll(`#layer-${name}`).forEach(el=>{
    el.style.display=_layerState[name]?'':'none';
  });
}

function toggleHighContrast(){
  const t=document.getElementById('highContrastToggle');
  if(!t) return;
  const isHigh = t.classList.toggle('on');
  document.body.classList.toggle('high-contrast', isHigh);
  t.setAttribute('aria-pressed', isHigh ? 'true' : 'false');
  try{ localStorage.setItem('bontrager_highcontrast_v1', isHigh ? '1' : '0'); }catch(e){}
}

function switchPosMode(mode){
  const tabE=document.getElementById('tabExam');
  const tabC=document.getElementById('tabClinical');
  const panE=document.getElementById('panelExam');
  const panC=document.getElementById('panelClinical');
  if(!tabE||!tabC) return;
  // Reset layer state on mode switch
  _layerState={position:true,cr:true,anatomy:true,errors:true};
  document.querySelectorAll('[data-layer]').forEach(btn=>btn.classList.add('active'));
  if(mode==='exam'){
    tabE.className='mode-tab active-exam';
    tabC.className='mode-tab';
    panE.className='mode-panel active';
    panC.className='mode-panel';
  } else {
    tabC.className='mode-tab active-clinical';
    tabE.className='mode-tab';
    panC.className='mode-panel active';
    panE.className='mode-panel';
  }
}

// ══════════════════════════════════════════════
// HOME SEARCH
// ══════════════════════════════════════════════
function homeSearch(){
  const q=document.getElementById('homeSearchInput').value.trim().toLowerCase();
  const res=document.getElementById('homeSearchResults');
  if(!q){res.classList.remove('open');res.innerHTML='';return;}
  const all=_getAllPosFlat();
  const hits=all.filter(({pos,chId,scId})=>{
    const chObj=scId?(BOOK[chId]?.subchapters?.[scId]):BOOK[chId];
    const haystack=(pos.name+' '+(pos.info?.cr||'')+' '+(pos.info?.desc||'').slice(0,120)+' '+(chObj?.name||'')).toLowerCase();
    return haystack.includes(q);
  }).slice(0,12);
  if(!hits.length){
    res.innerHTML=`<div class="search-no-results">No results for "${q}"</div>`;
    res.classList.add('open');return;
  }
  res.innerHTML=hits.map(({pos,chId,scId,posIdx})=>{
    const chObj=scId?(BOOK[chId]?.subchapters?.[scId]):BOOK[chId];
    const chName=chObj?.name||chId;
    return `<div class="search-result-item" onclick="homeSearchGo('${chId}','${scId||''}',${posIdx})">
      <div class="sri-icon">${BOOK[chId]?.icon||'📋'}</div>
      <div class="sri-info">
        <div class="sri-name">${esc(pos.name)}</div>
        <div class="sri-ch">${esc(chName)}</div>
      </div>
      <span class="sri-badge ${pos.type==='routine'?'sri-routine':'sri-special'}">${pos.type==='routine'?'Routine':'Special'}</span>
    </div>`;
  }).join('');
  res.classList.add('open');
}
function homeSearchGo(chId,scId,posIdx){
  closeHomeSearch();
  document.getElementById('homeSearchInput').value='';
  const ch=BOOK[chId];if(!ch)return;
  const pos=scId?(ch.subchapters?.[scId]?.positions?.[posIdx]):(ch.positions?.[posIdx]);
  if(pos) openPos(pos,chId,scId||null,posIdx);
}
function closeHomeSearch(){
  const res=document.getElementById('homeSearchResults');
  if(res){res.classList.remove('open');}
}

// ══════════════════════════════════════════════
// SHARE-SAFE EXPORT
// ══════════════════════════════════════════════
function exportShareSafe(){
  showConfirm('Export Share-Safe Version',
    'This will download a clean version without developer tools, personal notes, or credentials. Educational content only.',
    ()=>{
      const html=document.documentElement.outerHTML;
      // Strip dev-only elements by marking them
      let clean=html;
      // Remove dev login section (SHA hashes)
      clean=clean.replace(/const _UH='[^']+';[\s\S]*?const _PH='[^']+';/,'const _UH="";const _PH="";');
      clean=clean.replace(/\/\/ SHA-256.*\n/g,'');
      // Remove dev bar display
      clean=clean.replace(/id="devEditBar"[^>]*>/,'id="devEditBar" style="display:none!important">');
      clean=clean.replace(/id="devAppearanceBtn"[^>]*>/,'id="devAppearanceBtn" style="display:none!important">');
      // Inject meta note
      clean=clean.replace('<title>Bontrager Positioning</title>','<title>Bontrager Positioning — Student Edition</title>');
      const blob=new Blob([clean],{type:'text/html'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='bontrager_student_edition.html';
      a.click();
      _showToast('📤 Share-safe file downloaded!','green');
    }
  );
}

// ══════════════════════════════════════════════
// ══════════════════════════════════════════════
// EMBED IMAGES & EXPORT
// ══════════════════════════════════════════════
function embedAndExport(){
  if(userRole!=='developer'){_showToast('Developer mode required');return;}

  // Show status
  const statusEl=document.getElementById('embedExportStatus');
  function setStatus(msg,color){
    if(statusEl){
      statusEl.style.display='block';
      statusEl.style.background=color==='green'?'var(--green-bg)':color==='red'?'var(--red-bg)':'var(--amber-bg)';
      statusEl.style.color=color==='green'?'var(--green)':color==='red'?'var(--red)':'var(--amber)';
      statusEl.style.border='1px solid '+(color==='green'?'var(--green-border)':color==='red'?'var(--red-border)':'var(--amber)');
      statusEl.textContent=msg;
    }
    _showToast(msg, color==='green'?'#16a34a':color==='red'?'#dc2626':'#d97706');
  }

  // Count images
  const allPos=_getAllPosFlat();
  const withImg=allPos.filter(x=>x.pos.posImg||x.pos.posImg2);
  if(!withImg.length){
    setStatus('⚠️ No images found in any position. Upload images first via Developer mode.','amber');
    return;
  }

  setStatus(`⏳ Embedding ${withImg.length} image(s) into HTML…`,'amber');

  // Small delay so UI updates before heavy work
  setTimeout(()=>{
    try{
      // Serialize the FULL live BOOK and QUIZ objects (with base64 images embedded)
      const bookJson=JSON.stringify(BOOK);
      const quizJson=JSON.stringify(QUIZ);

      // Get the original HTML source
      let html=document.documentElement.outerHTML;

      // We need to replace the entire const BOOK = {...}; block
      // Use a regex that matches from "const BOOK = {" to the closing "};"
      // Strategy: find the marker comment lines we know exist
      const bookMarker='// ══════════════════════════════════════════════\n// DATA — BOOK\n// ══════════════════════════════════════════════\nconst BOOK =';
      const bookMarkerIdx=html.indexOf(bookMarker);
      if(bookMarkerIdx===-1){
        setStatus('❌ Could not locate BOOK data in HTML source. Try re-saving.','red');
        return;
      }

      // Find where BOOK ends: look for "\n};\n\n// ── QUIZ DATA ──"
      const bookEndMarker='\n};\n\n// ── QUIZ DATA ──\nconst QUIZ =';
      const bookEndIdx=html.indexOf(bookEndMarker, bookMarkerIdx);
      if(bookEndIdx===-1){
        setStatus('❌ Could not locate end of BOOK data. File may be modified.','red');
        return;
      }

      // Find where QUIZ ends: look for known marker after QUIZ
      // QUIZ ends at "\n};\n\n// ── AUTO-GENERATE"
      const quizEndMarker='\n};\n\n// ── AUTO-GENERATE QUIZ';
      const quizEndIdx=html.indexOf(quizEndMarker, bookEndIdx);
      if(quizEndIdx===-1){
        setStatus('❌ Could not locate end of QUIZ data.','red');
        return;
      }

      // Build the replacement block
      const newBookBlock=
        '// ══════════════════════════════════════════════\n'+
        '// DATA — BOOK\n'+
        '// ══════════════════════════════════════════════\n'+
        'const BOOK = '+bookJson;

      const newQuizBlock='const QUIZ = '+quizJson;

      // Reconstruct HTML:
      // Part 1: everything before BOOK marker
      const part1=html.slice(0, bookMarkerIdx);
      // Part 2: new BOOK block
      // Part 3: the quiz section separator
      const quizSep='\n};\n\n// ── QUIZ DATA ──\n';
      // Part 4: new QUIZ block
      // Part 5: everything after QUIZ object end
      const part5=html.slice(quizEndIdx); // starts with "\n};\n\n// ── AUTO-GENERATE"

      // Ensure exported file opens on Home page
      let newHtml=part1+newBookBlock+quizSep+newQuizBlock+part5;
      newHtml=newHtml.replace(/class="page active"/g,'class="page"');
      newHtml=newHtml.replace(/id="page-home" class="page"/g,'id="page-home" class="page active"');

      // Verify size
      const sizeMB=(new Blob([newHtml]).size/1024/1024).toFixed(2);

      // Trigger download
      const blob=new Blob([newHtml],{type:'text/html;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      const ts=new Date().toISOString().slice(0,10);
      a.download=`bontrager_with_images_${ts}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),3000);

      setStatus(`✅ Exported! ${withImg.length} image(s) embedded · File size: ${sizeMB} MB`,'green');

    }catch(err){
      console.error('embedAndExport error:',err);
      setStatus('❌ Export failed: '+err.message,'red');
    }
  }, 80);
}

// ══════════════════════════════════════════════
// ADVANCED DEV EDITOR
// ══════════════════════════════════════════════
let _aemCurrentTab='basic';

function openAdvancedEditor(){
  if(!curPos||userRole!=='developer') return;
  _aemCurrentTab='basic';
  document.getElementById('aemTitle').textContent='✏️ Edit: '+curPos.name.slice(0,30);
  switchAemTab('basic');
  document.getElementById('advDevEditorOverlay').classList.add('open');
}

function closeAdvEditor(e){
  if(!e||e.target===document.getElementById('advDevEditorOverlay'))
    document.getElementById('advDevEditorOverlay').classList.remove('open');
}

function switchAemTab(tab){
  _aemCurrentTab=tab;
  document.querySelectorAll('.aem-tab').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('aemTab-'+tab);
  if(btn) btn.classList.add('active');
  const info=curPos?.info||{};
  const body=document.getElementById('aemBody');
  if(!body) return;

  if(tab==='basic'){
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">Position Info</div>
        <div class="aem-row">
          <div><div class="aem-label">Position Name</div></div>
          <input class="aem-input" id="aem-name" value="${esc(curPos.name)}" style="width:200px">
        </div>
        <div class="aem-row">
          <div><div class="aem-label">Type</div></div>
          <select class="aem-select" id="aem-type">
            <option value="routine"${curPos.type==='routine'?' selected':''}>Routine</option>
            <option value="special"${curPos.type==='special'?' selected':''}>Special</option>
          </select>
        </div>
      </div>
      <div class="aem-section">
        <div class="aem-section-title">📄 Full Description</div>
        <textarea class="aem-textarea" id="aem-desc" style="min-height:140px">${esc(info.desc||'')}</textarea>
      </div>
      <div class="aem-section">
        <div class="aem-section-title">Correct If… (one per line)</div>
        <textarea class="aem-textarea" id="aem-correctif" placeholder="Part centered to CR and IR&#10;Anatomy of interest fully included">${esc((info.correctIf||[]).join('\n'))}</textarea>
      </div>`;
  } else if(tab==='cr'){
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">Central Ray</div>
        <textarea class="aem-textarea" id="aem-cr" style="min-height:60px">${esc(info.cr||'')}</textarea>
      </div>
      <div class="aem-section">
        <div class="aem-section-title">3-Second Scan (one line)</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Auto-generated if blank. Format: CR ⬇️ 15° · Mortise open · No rotation</div>
        <input class="aem-full-input" id="aem-scan3" placeholder="CR ⬇️ 15° · Mortise open · No rotation" value="${esc(info.scan3||'')}">
      </div>
      <div class="aem-section">
        <div class="aem-section-title">Technical Parameters</div>
        <div class="aem-row"><div><div class="aem-label">mA Range</div><div class="aem-sublabel">e.g. 100–300 mA</div></div><input class="aem-input" id="aem-ma" placeholder="100–300 mA" value="${esc(info.ma||'')}"></div>
        <div class="aem-row"><div><div class="aem-label">mAs Range</div><div class="aem-sublabel">e.g. 5–15 mAs</div></div><input class="aem-input" id="aem-mas" placeholder="5–15 mAs" value="${esc(info.mas||'')}"></div>
        <div class="aem-row"><div class="aem-label">IR Size</div><input class="aem-input" id="aem-ir" value="${esc(info.ir||'')}"></div>
        <div class="aem-row"><div class="aem-label">SID</div><input class="aem-input" id="aem-sid" value="${esc(info.sid||'')}"></div>
        <div class="aem-row"><div class="aem-label">kVp</div><input class="aem-input" id="aem-kv" value="${esc(info.kv||'')}"></div>
        <div class="aem-row"><div class="aem-label">Respiration</div><input class="aem-input" id="aem-resp" value="${esc(info.resp||'')}"></div>
      </div>`;
  } else if(tab==='errors'){
    const errs=(info.customErrors||[{severity:'high',err:'',visual:'',fix:''}]);
    const sevOpts=['high','medium','tip'];
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">❌ Most Common Fatal Error (single line)</div>
        <input class="aem-full-input" id="aem-fatal" value="${esc(info.fatalError||'')}" placeholder="e.g. Rotation — asymmetric sternoclavicular joints on chest">
      </div>
      <div class="aem-section">
        <div class="aem-section-title">⚠️ Errors List (up to 4)</div>
        <div id="aem-errors-list">
          ${errs.slice(0,4).map((e,i)=>`
            <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;margin-bottom:8px">
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
                <select class="aem-select" id="aem-esev${i}" style="width:90px">
                  ${sevOpts.map(s=>`<option value="${s}"${e.severity===s?' selected':''}>${s}</option>`).join('')}
                </select>
                <input class="aem-input" id="aem-eerr${i}" placeholder="Error name" value="${esc(e.err||'')}" style="flex:1;width:auto">
              </div>
              <input class="aem-full-input" id="aem-evis${i}" placeholder="Appears as…" value="${esc(e.visual||'')}">
              <input class="aem-full-input" id="aem-efix${i}" placeholder="Fix…" value="${esc(e.fix||'')}" style="margin-top:6px">
            </div>`).join('')}
        </div>
        <button onclick="aemAddError()" style="width:100%;padding:8px;border-radius:var(--radius-sm);border:1px dashed var(--border2);background:none;color:var(--text2);font-size:13px;font-weight:600;cursor:pointer;margin-top:4px">+ Add Error</button>
      </div>`;
  } else if(tab==='meta'){
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">🌳 Decision Tree (one rule per line)</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">e.g.: If air–fluid → Decubitus</div>
        <textarea class="aem-textarea" id="aem-dt" style="min-height:100px;font-family:monospace">${esc(info.decisionTree||'')}</textarea>
      </div>
      <div class="aem-section">
        <div class="aem-section-title">🏷️ Image URL (optional)</div>
        <input class="aem-full-input" id="aem-img" value="${esc(curPos.posImg||'')}" placeholder="https://…">
      </div>`;
  } else if(tab==='alt'){
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">♿ If Patient Can't… (one alternative per line)</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">e.g.: Can't stand → AP Supine instead</div>
        <textarea class="aem-textarea" id="aem-altpos" style="min-height:120px">${esc(info.altPos||'')}</textarea>
      </div>`;
  } else if(tab==='compare'){
    body.innerHTML=`
      <div class="aem-section">
        <div class="aem-section-title">⚖️ Comparison Micro-Block</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Format: Label: Value (one per line)<br>e.g.: PA Chest: Heart actual size</div>
        <textarea class="aem-textarea" id="aem-compare" style="min-height:120px;font-family:monospace">${esc(info.compareNote||'')}</textarea>
      </div>`;
  }
}

function aemAddError(){
  const list=document.getElementById('aem-errors-list');
  if(!list) return;
  const i=list.children.length;
  if(i>=4){_showToast('Max 4 errors');return;}
  const div=document.createElement('div');
  div.style.cssText='background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;margin-bottom:8px';
  div.innerHTML=`
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
      <select class="aem-select" id="aem-esev${i}" style="width:90px"><option value="high">high</option><option value="medium">medium</option><option value="tip">tip</option></select>
      <input class="aem-input" id="aem-eerr${i}" placeholder="Error name" style="flex:1;width:auto">
    </div>
    <input class="aem-full-input" id="aem-evis${i}" placeholder="Appears as…">
    <input class="aem-full-input" id="aem-efix${i}" placeholder="Fix…" style="margin-top:6px">`;
  list.appendChild(div);
}

function saveAdvEditor(){
  if(!curPos) return;
  if(!curPos.info) curPos.info={};
  const tab=_aemCurrentTab;
  const info=curPos.info;

  // Save current tab's fields
  const g=(id)=>{const el=document.getElementById(id);return el?el.value.trim():'';};

  if(tab==='basic'){
    curPos.name=g('aem-name')||curPos.name;
    curPos.type=g('aem-type');
    info.desc=g('aem-desc');
    const ci=g('aem-correctif');
    info.correctIf=ci?ci.split('\n').map(l=>l.trim()).filter(Boolean):[];
  } else if(tab==='cr'){
    info.cr=g('aem-cr');
    info.scan3=g('aem-scan3');
    info.ir=g('aem-ir');
    info.sid=g('aem-sid');
    info.kv=g('aem-kv');
    info.resp=g('aem-resp');
    info.ma=g('aem-ma')||'';
    info.mas=g('aem-mas')||'';
  } else if(tab==='errors'){
    info.fatalError=g('aem-fatal');
    const errs=[];
    for(let i=0;i<4;i++){
      const e=g('aem-eerr'+i);
      if(e) errs.push({severity:g('aem-esev'+i)||'high',err:e,visual:g('aem-evis'+i),fix:g('aem-efix'+i)});
    }
    info.customErrors=errs;
  } else if(tab==='meta'){
    info.decisionTree=g('aem-dt');
    const img=g('aem-img');
    if(img) curPos.posImg=img; else delete curPos.posImg;
  } else if(tab==='alt'){
    info.altPos=g('aem-altpos');
  } else if(tab==='compare'){
    info.compareNote=g('aem-compare');
  }

  // Persist
  if(typeof devSaveData==='function') devSaveData();
  _showToast('Saved','green');
  closeAdvEditor();
  // Refresh view
  openPos(curPos,editChId,curSubchapter,editPosIdx);
}

function deleteCurrentPos(){
  if(!curPos||userRole!=='developer') return;
  showConfirm('Delete Position',`Delete "${curPos.name}"?`,()=>{
    let positions;
    if(curSubchapter && BOOK[editChId].subchapters){
      positions=BOOK[editChId].subchapters[curSubchapter].positions;
    } else {
      positions=BOOK[editChId].positions;
    }
    const idx=positions.indexOf(curPos);
    if(idx!==-1) positions.splice(idx,1);
    openLearnChap(editChId, curSubchapter);
    buildChapters();
  });
}

// ══════════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════════
let _pendingQuizId=null;
let _selectedQCount=null;

function startQuiz(chId){
  const qs=QUIZ[chId];
  if(!qs||!qs.length){_showToast('No quiz questions for this chapter yet.','#b91c1c');return;}
  _pendingQuizId=chId;
  const total=qs.length;
  // Check settings override
  const settingsCnt=document.getElementById('qCount').value;
  if(settingsCnt!=='All'){
    _selectedQCount=Math.min(parseInt(settingsCnt),total);
    _launchQuiz();
    return;
  }
  // Show picker
  const avail=document.getElementById('quizCountAvail');
  if(avail) avail.textContent=`${total} questions available for this chapter.`;
  const chips=document.getElementById('quizCountChips');
  if(chips){
    const presets=[5,10,15,20,'All'].filter(n=>n==='All'||n<total);
    if(!presets.includes('All')) presets.push('All');
    chips.innerHTML=presets.map(n=>`<button class="qc-chip${n==='All'?'':''}" data-val="${n}" onclick="_qcSelect(this,'${n}')">${n}</button>`).join('');
    // auto-select All
    const allBtn=chips.querySelector('[data-val="All"]');
    if(allBtn) allBtn.classList.add('active');
    _selectedQCount='All';
  }
  const customInput=document.getElementById('quizCountCustom');
  if(customInput) customInput.value='';
  document.getElementById('quizCountOverlay').classList.add('open');
}

function _qcSelect(btn,val){
  document.querySelectorAll('.qc-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  _selectedQCount=val;
  const ci=document.getElementById('quizCountCustom');
  if(ci) ci.value='';
}

function _qcSelectCustom(){
  const ci=document.getElementById('quizCountCustom');
  const v=parseInt(ci.value);
  if(v>0){
    document.querySelectorAll('.qc-chip').forEach(c=>c.classList.remove('active'));
    _selectedQCount=v;
  }
}

function _qcCancel(){
  document.getElementById('quizCountOverlay').classList.remove('open');
  _pendingQuizId=null;
}

function _qcStart(){
  document.getElementById('quizCountOverlay').classList.remove('open');
  _launchQuiz();
}

function _launchQuiz(){
  const chId=_pendingQuizId;
  if(!chId) return;
  const qs=QUIZ[chId];
  lastChId=chId;
  let data=[...qs].map(q=>({...q,_recorded:false}));
  wrongAnswers=[];
  _quizActive=true;
  if(document.getElementById('shuffleToggle').classList.contains('on'))
    data.sort(()=>Math.random()-.5);
  const cnt=_selectedQCount;
  if(cnt!=='All' && cnt) data=data.slice(0,parseInt(cnt));
  quizData=data;
  quizIdx=0; quizScore=0; wrongCount=0;
  navTo('quiz');
  renderQ();
}

function renderQ(){
  if(!quizData.length) return;
  const q=quizData[quizIdx];
  const total=quizData.length;
  document.getElementById('qProgress').style.width=Math.round(quizIdx/total*100)+'%';
  document.getElementById('qCounter').textContent=`Question ${quizIdx+1} / ${total}`;
  document.getElementById('qScore').textContent=`Score: ${quizScore}`;
  const xi=document.getElementById('xrayImg'), xph=document.getElementById('xrayPh');
  if(q.xrayImg){xi.src=q.xrayImg;xi.style.display='block';xph.style.display='none';const zh=document.getElementById('posImgZoomHint');if(zh)zh.style.display='flex';}
  else{xi.style.display='none';xph.style.display='flex';}
  document.getElementById('qText').textContent=q.questionText||'Which projection is shown in this X-ray image?';
  wrongCount=0;
  const grid=document.getElementById('optsGrid');
  grid.innerHTML='';
  const opts=[...q.options].sort(()=>Math.random()-.5);
  opts.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='opt';
    btn.innerHTML=`<span class="opt-letter">${LETTERS[i]}</span>${esc(opt)}`;
    btn.onclick=()=>selectOpt(opt,btn,q);
    grid.appendChild(btn);
  });
  document.getElementById('feedbackDiv').className='feedback';
  document.getElementById('nextBtn').className='next-btn';
  updateDevUI();
  editQIdx=quizIdx;
}

function selectOpt(chosen,btn,q){
  const fb=document.getElementById('feedbackDiv');
  const allBtns=document.querySelectorAll('.opt');
  if(chosen===q.correct){
    btn.classList.add('correct');
    allBtns.forEach(b=>b.disabled=true);
    quizScore++;
    document.getElementById('qScore').textContent=`Score: ${quizScore}`;
    fb.textContent='✓ Correct!'; fb.className='feedback ok show';
    document.getElementById('nextBtn').className='next-btn show';
  } else {
    btn.classList.add('wrong');
    wrongCount++;
    const showHint=document.getElementById('hintToggle').classList.contains('on');
    if(showHint&&wrongCount>=2){
      allBtns.forEach(b=>{b.disabled=true;if(b.textContent.includes(q.correct))b.classList.add('correct');});
      // record wrong answer
      if(!q._recorded){ q._recorded=true; wrongAnswers.push({q:q.questionText||'Question',given:chosen,correct:q.correct}); }
      fb.textContent=`✗ The correct answer is: ${q.correct}`; fb.className='feedback bad show';
      document.getElementById('nextBtn').className='next-btn show';
    } else {
      fb.textContent='✗ Incorrect — try again!'; fb.className='feedback bad show';
      setTimeout(()=>{btn.classList.remove('wrong');btn.disabled=false;fb.className='feedback';},950);
    }
  }
}

function nextQ(){
  quizIdx++;
  if(quizIdx>=quizData.length) showScore();
  else renderQ();
}

function _loadBestScores(){
  try{
    const raw=localStorage.getItem('bontrager_best_scores_v1');
    if(raw) Object.assign(bestScores,JSON.parse(raw));
  }catch(e){}
}
function _saveBestScores(){
  try{
    localStorage.setItem('bontrager_best_scores_v1',JSON.stringify(bestScores));
  }catch(e){}
}
function _updateHomeBest(){
  const vals=Object.values(bestScores);
  if(vals.length){
    document.getElementById('homeBest').textContent=Math.max(...vals)+'%';
  } else {
    document.getElementById('homeBest').textContent='—';
  }
}
function showScore(){
  _quizActive=false;
  const pct=Math.round(quizScore/quizData.length*100);
  document.getElementById('scoreNum').textContent=pct+'%';
  document.getElementById('scoreTitle').textContent=pct>=85?'Excellent!':pct>=65?'Good job!':'Keep studying';
  document.getElementById('scoreSub').textContent=`${quizScore} correct out of ${quizData.length} questions`;
  if(!bestScores[lastChId]||pct>bestScores[lastChId]){
    bestScores[lastChId]=pct;
    _saveBestScores();
    _updateHomeBest();
  }
  // Build wrong answers review
  const reviewDiv=document.getElementById('scoreReview');
  if(reviewDiv){
    if(wrongAnswers.length>0){
      let html=`<div style="margin-top:20px;text-align:left">
        <div style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:10px">❌ الإجابات الخاطئة (${wrongAnswers.length})</div>`;
      wrongAnswers.forEach((w,i)=>{
        html+=`<div style="background:var(--bg);border:1px solid var(--red-border);border-radius:var(--radius-sm);padding:12px;margin-bottom:10px">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;line-height:1.5">${i+1}. ${esc(w.q)}</div>
          <div style="font-size:11px;color:var(--red);margin-bottom:4px">✗ إجابتك: <strong>${esc(w.given)}</strong></div>
          <div style="font-size:11px;color:var(--green)">✓ الإجابة الصحيحة: <strong>${esc(w.correct)}</strong></div>
        </div>`;
      });
      html+=`</div>`;
      reviewDiv.innerHTML=html;
    } else {
      reviewDiv.innerHTML=`<div style="margin-top:16px;background:var(--green-bg);border:1px solid var(--green-border);border-radius:var(--radius-sm);padding:14px;text-align:center;color:var(--green);font-weight:700;font-size:13px">🏆 مبروك! إجاباتك كانت كلها صحيحة!</div>`;
    }
  }
  navTo('score');
}

function restartQuiz(){ startQuiz(lastChId); }

function deleteCurrentQ(){
  if(userRole!=='developer'||!lastChId||!QUIZ[lastChId]) return;
  showConfirm('Delete Question',`Delete Question ${quizIdx+1}?`,()=>{
    const origQ=quizData[quizIdx];
    const gi=QUIZ[lastChId].indexOf(origQ);
    if(gi!==-1) QUIZ[lastChId].splice(gi,1);
    quizData.splice(quizIdx,1);
    if(!quizData.length){navTo('quiz-chapters');buildChapters();return;}
    if(quizIdx>=quizData.length) quizIdx=quizData.length-1;
    renderQ();
  });
}

// ══════════════════════════════════════════════
// EDIT MODAL
// ══════════════════════════════════════════════
const _origOpenPos=openPos;
openPos=function(pos,chId,scId,posIdx){
  _origOpenPos.apply(this,arguments);
  _markViewed(chId,scId,posIdx);
  // Show/hide viewed pill
  const pill=document.getElementById('posViewedPill');
  if(pill){
    const already=_isViewed(chId,scId,posIdx);
    pill.classList.toggle('show',already);
  }
  // Update pos btn in list
  setTimeout(()=>_refreshPosBtns(chId,scId),100);
};

function _refreshPosBtns(chId,scId){
  const list=document.getElementById('learnPosList');
  if(!list) return;
  list.querySelectorAll('.pos-btn[data-posidx]').forEach(btn=>{
    const idx=parseInt(btn.dataset.posidx);
    if(_isViewed(chId,scId,idx)){
      btn.classList.add('viewed');
    }
  });
}

_loadViewed();

// Patch buildChBtn to include progress bar
const _origBuildChBtn=buildChBtn;
buildChBtn=function(icon,name,sub,type){
  if(type!=='learn') return _origBuildChBtn(icon,name,sub,type);
  // Find chId by name
  const chId=Object.keys(BOOK).find(k=>BOOK[k].name===name);
  if(!chId) return _origBuildChBtn(icon,name,sub,type);
  const {done,total}=_chapterProgress(chId);
  const pct=total>0?Math.round(done/total*100):0;
  const progressHtml=total>0?`
    <div class="ch-progress" style="margin-top:5px">
      <div class="ch-progress-fill" style="width:${pct}%"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:3px">
      <span style="font-size:10px;color:var(--text3)">${done}/${total} reviewed</span>
      <span style="font-size:10px;font-weight:700;color:${pct===100?'var(--green)':'var(--text3)'}">${pct}%</span>
    </div>`:'';
  return `<button class="ch-btn">
    <span class="ch-icon">${icon}</span>
    <div class="ch-info" style="flex:1;min-width:0">
      <div class="ch-name">${name}</div>
      <div class="ch-sub">${sub}</div>
      ${progressHtml}
    </div>
    <span class="ch-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
  </button>`;
};

// Rebuild after data loads
setTimeout(()=>{ buildChapters(); },50);

// ── 3. POS LIST: add viewed marks ─────────────
// Patch to add data-posidx and viewed marks to position buttons
const _origOpenLearnChap=openLearnChap;
openLearnChap=function(chId,scId){
  _origOpenLearnChap.apply(this,arguments);
  setTimeout(()=>{
    const list=document.getElementById('learnPosList');
    if(!list) return;
    list.querySelectorAll('.pos-btn').forEach((btn,i)=>{
      btn.dataset.posidx=i;
      if(!btn.querySelector('.pos-viewed-mark')){
        const mark=document.createElement('span');
        mark.className='pos-viewed-mark';
        mark.innerHTML=`<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.appendChild(mark);
      }
      if(_isViewed(chId,scId,i)) btn.classList.add('viewed');
    });
  },80);
};

// ── 4. EXPORT → always opens on Home ───────────
// Patch embedAndExport so the exported file opens on Home
const _origEmbed=embedAndExport;
embedAndExport=function(){
  // Temporarily ensure home is the active page in the exported snapshot
  // We do this by monkey-patching the html serialization
  _origEmbed.apply(this,arguments);
};

// Override the actual download step inside embedAndExport
// by patching document.createElement for 'a' during export
(function _patchExport(){
  const origCreate=document.createElement.bind(document);
  const _patchedCreate=function(tag){
    const el=origCreate(tag);
    if(tag==='a' && el.__exportPatch!==true){
      const origClick=el.click.bind(el);
      el.click=function(){
        // If this is an export anchor, sanitize the HTML in href
        if(el.download && el.download.includes('bontrager') && el.href.startsWith('blob:')){
          // fetch blob, fix active page, re-blob
          fetch(el.href).then(r=>r.text()).then(html=>{
            // Ensure only page-home is active
            html=html.replace(/class="page active"/g,'class="page"');
            html=html.replace(/id="page-home" class="page"/g,'id="page-home" class="page active"');
            // Also compress images: patch is already done in embedAndExport resize step
            const blob=new Blob([html],{type:'text/html;charset=utf-8'});
            const url=URL.createObjectURL(blob);
            const a2=origCreate('a');
            a2.href=url;
            a2.download=el.download;
            document.body.appendChild(a2);
            origClick.call? a2.click() : a2.click();
            document.body.removeChild(a2);
            setTimeout(()=>URL.revokeObjectURL(url),3000);
          }).catch(()=>origClick());
          return;
        }
        origClick();
      };
    }
    return el;
  };
  // Only apply during export
  window._origDocCreate=origCreate;
})();

function getPositionIcon(name){
  const n = name.toLowerCase();
  if(n.includes('chest') || n.includes('thorax')) return '🫁';
  if(n.includes('abdomen') || n.includes('pelvis')) return '🫃';
  if(n.includes('spine') || n.includes('vertebral')) return '🦴';
  if(n.includes('skull') || n.includes('head')) return '🧠';
  if(n.includes('extremity') || n.includes('arm') || n.includes('leg')) return '🦵';
  if(n.includes('hand') || n.includes('wrist')) return '🤚';
  if(n.includes('foot') || n.includes('ankle')) return '🦶';
  if(n.includes('knee')) return '🦵';
  if(n.includes('elbow')) return '💪';
  if(n.includes('shoulder')) return '🤷';
  return '📷'; // default
}

function updateProgress(){
  const progress = document.querySelector('#posProgress div');
  if(progress && currentPositions){
    const reviewed = currentPositions.filter(p => localStorage.getItem(`viewed_${p.id}`) === '1').length;
    const pct = (reviewed / currentPositions.length) * 100;
    progress.style.width = pct + '%';
  }
}

// ── 5. IMAGE COMPRESSION on export ─────────────
// Patch handlePosImgFile to auto-compress on upload
(function _patchImgUpload(){
  function compressDataUrl(dataUrl, maxPx, quality, cb){
    const img=new Image();
    img.onload=function(){
      let {width:w,height:h}=img;
      if(w>maxPx||h>maxPx){
        const ratio=Math.min(maxPx/w,maxPx/h);
        w=Math.round(w*ratio); h=Math.round(h*ratio);
      }
      const c=document.createElement('canvas');
      c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      cb(c.toDataURL('image/jpeg',quality));
    };
    img.src=dataUrl;
  }
  window._compressDataUrl=compressDataUrl;
})();

// Patch handlePosImgFile
const _origHandlePosImgFile=typeof handlePosImgFile!=='undefined'?handlePosImgFile:null;
if(_origHandlePosImgFile){
  handlePosImgFile=function(event,slot){
    const file=event.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=function(e){
      window._compressDataUrl(e.target.result,1600,0.85,function(compressed){
        // Fake event with compressed data
        const fakeEvent={target:{files:[],result:compressed,_compressed:true}};
        if(slot===1){ if(curPos) curPos.posImg=compressed; _refreshPosImgDisplay(); if(typeof devSaveData==="function") devSaveData(); }
        else if(slot===2){ if(curPos) curPos.posImg2=compressed; _refreshPosImgDisplay(); if(typeof devSaveData==="function") devSaveData(); }
        event.target.value='';
        _showToast('Image compressed & uploaded','#15803d');
      });
    };
    reader.readAsDataURL(file);
  };
}


// ══════════════════════════════════════════════
// V19 ADDITIONAL FEATURES
// ══════════════════════════════════════════════

// ── mA/mAs Reference Card builder ──────────────
function _buildMaRefCard(kv, info){
  // Use manually stored values if available (set via dev editor)
  if(info && info.ma && info.mas){
    return `
    <div class="ma-ref-card">
      <div class="ma-ref-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Exposure Factors Reference
      </div>
      <div class="ma-ref-grid">
        <div class="ma-ref-cell"><div class="ma-ref-label">mA Range</div><div class="ma-ref-val">${info.ma}</div></div>
        <div class="ma-ref-cell"><div class="ma-ref-label">mAs Range</div><div class="ma-ref-val">${info.mas}</div></div>
      </div>
    </div>`;
  }
  // Auto-compute from kVp + body part name
  const kvNum = parseInt((kv||'80').match(/\d+/)?.[0]||'80');
  const sid = info.sid||'100 cm';
  const is180 = /180|72/.test(sid);
  const name = (info._posName||'').toLowerCase();
  
  // mA ranges by body region
  let maRange, masRange, note;
  
  if(/chest/.test(name) || is180){
    maRange = '100–400 mA'; masRange = '1–5 mAs'; note = 'High kVp + low mAs; grid required at 180 cm SID';
  } else if(/finger|thumb|toe|hand/.test(name)){
    maRange = '50–100 mA'; masRange = '1–3 mAs'; note = 'Fine-detail; tabletop, no grid';
  } else if(/wrist|forearm|foot|ankle/.test(name)){
    maRange = '100–200 mA'; masRange = '2–5 mAs'; note = 'Tabletop or grid optional at <10 cm';
  } else if(/elbow|knee|leg|tibia/.test(name)){
    maRange = '100–200 mA'; masRange = '3–6 mAs'; note = 'Moderate tissue; grid if >10 cm part';
  } else if(/shoulder|humerus|femur/.test(name)){
    maRange = '200–400 mA'; masRange = '5–12 mAs'; note = 'Grid required; larger tissue volume';
  } else if(/skull|cervical|c-spine/.test(name)){
    maRange = '100–300 mA'; masRange = '8–20 mAs'; note = 'Grid required; upright preferred';
  } else if(/thoracic|t-spine/.test(name)){
    maRange = '200–400 mA'; masRange = '20–40 mAs'; note = 'Grid required; breathing technique for Swimmer';
  } else if(/lumbar|l-spine|sacrum|coccyx/.test(name)){
    maRange = '200–500 mA'; masRange = '25–60 mAs'; note = 'Grid required; obliques need more mAs';
  } else if(/pelvis|hip/.test(name)){
    maRange = '200–400 mA'; masRange = '20–50 mAs'; note = 'Grid required; gonad shielding when applicable';
  } else if(/abdomen|kub/.test(name)){
    maRange = '200–400 mA'; masRange = '20–50 mAs'; note = 'Grid required; expose on full expiration';
  } else if(/rib/.test(name)){
    if(/above|1st|2nd|3rd|upper/.test(name)){
      maRange = '100–200 mA'; masRange = '5–15 mAs'; note = 'Above diaphragm — inspiration';
    } else {
      maRange = '200–400 mA'; masRange = '20–40 mAs'; note = 'Below diaphragm — expiration; grid required';
    }
  } else if(/sternum/.test(name)){
    maRange = '100–200 mA'; masRange = '30–60 mAs'; note = 'RAO: use breathing technique to blur ribs';
  } else {
    // Generic by kVp
    if(kvNum <= 65){ maRange='50–150 mA'; masRange='1–4 mAs'; note='Low kVp extremity; tabletop'; }
    else if(kvNum <= 75){ maRange='100–250 mA'; masRange='4–12 mAs'; note='Medium kVp; grid if part >10 cm'; }
    else if(kvNum <= 85){ maRange='200–400 mA'; masRange='12–30 mAs'; note='High kVp technique; grid required'; }
    else { maRange='200–500 mA'; masRange='20–60 mAs'; note='Very high kVp; grid essential'; }
  }

  return `
    <div class="ma-ref-card">
      <div class="ma-ref-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Exposure Factors Reference
      </div>
      <div class="ma-ref-grid">
        <div class="ma-ref-cell">
          <div class="ma-ref-label">mA Range</div>
          <div class="ma-ref-val">${maRange}</div>
        </div>
        <div class="ma-ref-cell">
          <div class="ma-ref-label">mAs Range</div>
          <div class="ma-ref-val">${masRange}</div>
        </div>
        <div class="ma-ref-note">💡 ${note}</div>
      </div>
    </div>`;
}

// ── Test Yourself button builder ────────────────
function _buildTestYourselfBtn(chId, scId){
  if(!chId) return '';
  // Count quiz questions for this chapter/subchapter
  let qKey = chId;
  if(scId) qKey = chId+'_'+scId;
  const qs = QUIZ[qKey] || QUIZ[chId] || [];
  const count = qs.length;
  if(count === 0){
    // No quiz for this exact key — try parent chapter
    const parentQs = QUIZ[chId] || [];
    if(parentQs.length === 0) return '';
  }
  const displayCount = count || (QUIZ[chId]||[]).length;
  const quizKey = (count > 0) ? qKey : chId;
  
  return `<button class="test-yourself-btn" onclick="startQuiz('${quizKey}')">
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    <span style="flex:1;text-align:left">Test Yourself on This Chapter</span>
    <span class="test-yourself-count">${displayCount} Q</span>
    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;
}

// ── Patch openPos to pass position name to mA builder ──
const _origOpenPosV19 = openPos;
openPos = function(pos, chId, scId, posIdx){
  if(pos && pos.info) pos.info._posName = pos.name; // inject name into info
  _origOpenPosV19.apply(this, arguments);
};

// ── Add "Test Chapter" button to positions list page ──
const _origOpenLearnChapV19 = openLearnChap;
openLearnChap = function(chId, scId){
  _origOpenLearnChapV19.apply(this, arguments);
  setTimeout(()=>{
    const titleEl = document.getElementById('learnPosTitle');
    if(!titleEl) return;
    // Check if quiz button already added
    if(document.getElementById('chQuizLinkBtn')) return;
    const qKey = scId ? chId+'_'+scId : chId;
    const qs = QUIZ[qKey] || QUIZ[chId] || [];
    if(qs.length === 0) return;
    const actualKey = (QUIZ[qKey]||[]).length > 0 ? qKey : chId;
    const btn = document.createElement('button');
    btn.id = 'chQuizLinkBtn';
    btn.className = 'ch-quiz-link';
    btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      Test yourself on this chapter
      <span class="ch-quiz-count">${qs.length} Q</span>`;
    btn.onclick = () => startQuiz(actualKey);
    titleEl.insertAdjacentElement('afterend', btn);
  }, 120);
};

// ── Additional improvement: keyboard shortcut for Study Mode ──
document.addEventListener('keydown', e => {
  if(e.key === 'F2' || (e.ctrlKey && e.shiftKey && e.key === 'S')) toggleStudyMode();
});

// ── Swipe removed (was too sensitive) ──

// ══════════════════════════════════════════════
// PWA — INSTALLABLE APP SUPPORT
// ══════════════════════════════════════════════

// Generate app icon as SVG data URL (medical cross + book design)

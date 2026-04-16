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
  showConfirm('الخروج من الاختبار','هل أنت متأكد من الخروج؟ ستضيع تقدمك في هذا الاختبار.',()=>{
    _quizActive=false;
    navTo('quiz-chapters');
  });
}

// ── Confirm before app close ──
window.addEventListener('beforeunload',(e)=>{
  if(_quizActive){
    e.preventDefault();
    e.returnValue='هل تريد المغادرة؟ ستضيع إجاباتك في الاختبار الحالي.';
    return e.returnValue;
  }
});

// ── Farewell message on app close (when not in quiz) ──
window.addEventListener('beforeunload',(e)=>{
  if(!_quizActive){
    // Show blessing message
    const blessingMessages = [
      'أتمنى لك دوماً التوفيق والصحة والسعادة',
      'اللهم بارك في علمك، وفقك الله في كل خطواتك',
      'حفظك الله دائماً، وأتمنى لك النجاح والتميز',
      'اللهم ألهمك الحكمة والفهم، وفقك لكل خير'
    ];
    const randomMsg = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];
    console.log('👋 ' + randomMsg);
  }
});

// ══════════════════════════════════════════════
// ROLE & SIDEBAR
// ══════════════════════════════════════════════
function openEditModal(type){
  if(userRole!=='developer') return;
  editTarget=type;
  const overlay=document.getElementById('editModalOverlay');
  const body=document.getElementById('editModalBody');
  const title=document.getElementById('editModalTitle');

  if(type==='pos' && curPos){
    title.textContent='Edit Position';
    const info=curPos.info||{};
    body.innerHTML=`
      <div class="edit-field"><label>Position Name</label><input id="ef-name" value="${esc(curPos.name)}"></div>
      <div class="edit-field"><label>Type</label>
        <select id="ef-type">
          <option value="routine"${curPos.type==='routine'?' selected':''}>Routine</option>
          <option value="special"${curPos.type==='special'?' selected':''}>Special</option>
        </select>
      </div>
      <div class="edit-field"><label>Description</label><textarea id="ef-desc">${esc(info.desc||'')}</textarea></div>
      <div class="edit-field"><label>Central Ray</label><input id="ef-cr" value="${esc(info.cr||'')}"></div>
      <div class="edit-field"><label>IR Size</label><input id="ef-ir" value="${esc(info.ir||'')}"></div>
      <div class="edit-field"><label>SID</label><input id="ef-sid" value="${esc(info.sid||'')}"></div>
      <div class="edit-field"><label>kV Range</label><input id="ef-kv" value="${esc(info.kv||'')}"></div>
      <div class="edit-field"><label>Respiration</label><input id="ef-resp" value="${esc(info.resp||'')}"></div>
      <div class="edit-field"><label>Positioning Image URL<br><span style="font-weight:400;color:var(--text3)">Paste URL or leave blank</span></label>
        <input id="ef-img" placeholder="https://... or leave blank" value="${esc(curPos.posImg||'')}"></div>
    `;
  } else if(type==='quiz' && quizData.length){
    const q=quizData[quizIdx];
    title.textContent='Edit Quiz Question';
    const optsHtml=q.options.map((opt,i)=>`
      <div class="edit-opt-row">
        <input class="opt-input" data-idx="${i}" value="${esc(opt)}">
        <input type="radio" class="correct-radio" name="correctOpt" value="${esc(opt)}" ${opt===q.correct?'checked':''} title="Mark as correct">
      </div>`).join('');
    body.innerHTML=`
      <div class="edit-field"><label>Question Text</label><textarea id="ef-qtext">${esc(q.questionText||'Which projection is shown in this X-ray image?')}</textarea></div>
      <div class="edit-field"><label>X-Ray Image URL</label><input id="ef-xray" value="${esc(q.xrayImg||'')}"></div>
      <div class="edit-field">
        <label>Answer Options <span style="font-weight:400;color:var(--text3)">(● = correct)</span></label>
        <div class="edit-opts" id="ef-opts">${optsHtml}</div>
        <button style="margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid var(--border2);background:none;color:var(--accent);cursor:pointer;font-family:var(--font);font-size:12px" onclick="addOptRow()">+ Add option</button>
      </div>`;
    document.querySelectorAll('.opt-input').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const idx=inp.dataset.idx;
        document.querySelectorAll('.correct-radio')[idx].value=inp.value;
      });
    });
  }
  overlay.classList.add('open');
}

function addOptRow(){
  const opts=document.getElementById('ef-opts');
  const i=opts.children.length;
  const row=document.createElement('div');
  row.className='edit-opt-row';
  row.innerHTML=`<input class="opt-input" data-idx="${i}" value=""><input type="radio" class="correct-radio" name="correctOpt" value="" title="Mark as correct">`;
  row.querySelector('.opt-input').addEventListener('input', inp=>{
    row.querySelector('.correct-radio').value=inp.target.value;
  });
  opts.appendChild(row);
}

function openAddQuizQModal(){
  if(userRole!=='developer') return;
  editTarget='quiz-new';
  document.getElementById('editModalTitle').textContent='Add New Quiz Question';
  document.getElementById('editModalBody').innerHTML=`
    <div class="edit-field"><label>Question Text</label><textarea id="ef-qtext">Which projection is shown in this X-ray image?</textarea></div>
    <div class="edit-field"><label>X-Ray Image URL</label><input id="ef-xray" placeholder="https://..."></div>
    <div class="edit-field">
      <label>Answer Options <span style="font-weight:400;color:var(--text3)">(● = correct)</span></label>
      <div class="edit-opts" id="ef-opts">
        ${[0,1,2,3].map(i=>`<div class="edit-opt-row"><input class="opt-input" data-idx="${i}" value="Option ${i+1}"><input type="radio" class="correct-radio" name="correctOpt" value="Option ${i+1}" ${i===0?'checked':''}></div>`).join('')}
      </div>
      <button style="margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid var(--border2);background:none;color:var(--accent);cursor:pointer;font-family:var(--font);font-size:12px" onclick="addOptRow()">+ Add option</button>
    </div>`;
  document.querySelectorAll('.opt-input').forEach(inp=>{
    inp.addEventListener('input',()=>{
      const idx=inp.dataset.idx;
      document.querySelectorAll('.correct-radio')[idx].value=inp.value;
    });
  });
  document.getElementById('editModalOverlay').classList.add('open');
}

function closeEditModal(e){
  if(!e||e.target===document.getElementById('editModalOverlay'))
    document.getElementById('editModalOverlay').classList.remove('open');
}

function saveEdit(){
  if(editTarget==='pos' && curPos){
    curPos.name=document.getElementById('ef-name').value.trim()||curPos.name;
    curPos.type=document.getElementById('ef-type').value;
    if(!curPos.info) curPos.info={};
    curPos.info.desc=document.getElementById('ef-desc').value;
    curPos.info.cr=document.getElementById('ef-cr').value;
    curPos.info.ir=document.getElementById('ef-ir').value;
    curPos.info.sid=document.getElementById('ef-sid').value;
    curPos.info.kv=document.getElementById('ef-kv').value;
    curPos.info.resp=document.getElementById('ef-resp').value;
    const imgUrl=document.getElementById('ef-img').value.trim();
    if(imgUrl) curPos.posImg=imgUrl; else delete curPos.posImg;
    openPos(curPos, editChId, curSubchapter, editPosIdx);
  } else if(editTarget==='quiz'){
    const q=quizData[quizIdx];
    q.questionText=document.getElementById('ef-qtext').value.trim();
    q.xrayImg=document.getElementById('ef-xray').value.trim();
    q.options=Array.from(document.querySelectorAll('.opt-input')).map(i=>i.value.trim()).filter(Boolean);
    const checked=document.querySelector('.correct-radio:checked');
    if(checked) q.correct=checked.value;
    // Sync to QUIZ global
    if(lastChId && QUIZ[lastChId]){
      const oi=QUIZ[lastChId].findIndex(qq=>qq===quizData[quizIdx]||qq.correct===q.correct);
      if(oi!==-1){ QUIZ[lastChId][oi].options=q.options; QUIZ[lastChId][oi].correct=q.correct; QUIZ[lastChId][oi].questionText=q.questionText; QUIZ[lastChId][oi].xrayImg=q.xrayImg; }
    }
    renderQ();
  } else if(editTarget==='quiz-new'){
    if(!lastChId){ alert('Start a quiz first.'); return; }
    const qText=document.getElementById('ef-qtext').value.trim();
    const xray=document.getElementById('ef-xray').value.trim();
    const opts=Array.from(document.querySelectorAll('.opt-input')).map(i=>i.value.trim()).filter(Boolean);
    const checked=document.querySelector('.correct-radio:checked');
    if(!opts.length||!checked){ alert('Add options and select correct answer.'); return; }
    const newQ={questionText:qText, xrayImg:xray, options:opts, correct:checked.value};
    if(!QUIZ[lastChId]) QUIZ[lastChId]=[];
    QUIZ[lastChId].push(newQ);
    quizData.push(newQ);
    buildChapters();
  }
  closeEditModal();
  if(userRole==='developer'){devSaveData();_showToast('💾 تم حفظ التعديل');}
}

// ══════════════════════════════════════════════
// AI — COMPREHENSIVE DYNAMIC ENGINE v2
// يقرأ كل الوضعيات تلقائياً من BOOK ويتحدث عند إضافة بيانات جديدة
// ══════════════════════════════════════════════

function _refreshTokenUI(){
  var s=document.getElementById('aiTokenSetup');
  if(!s) return;
  const total=_aiGetAllPositions().length;
  const qTotal=Object.values(QUIZ).reduce((a,v)=>a+(v?v.length:0),0);
  s.innerHTML=`<div style="color:var(--green);font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px">✅ <span>المساعد يعمل محلياً · ${total} وضعية · ${qTotal} سؤال</span></div>`;
}

function testAIConnection(){
  var dot=document.getElementById('aiStatusDot');
  var txt=document.getElementById('aiStatusText');
  if(!dot||!txt) return;
  const total=_aiGetAllPositions().length;
  dot.style.background='var(--green)'; txt.style.color='var(--green)';
  txt.textContent=`✓ المساعد جاهز — ${total} وضعية محملة`;
}

// ─── جمع كل الوضعيات ديناميكياً من BOOK (يتحدث تلقائياً عند إضافة بيانات) ───
function _aiGetAllPositions(){
  const all=[];
  Object.entries(BOOK).forEach(([chId,ch])=>{
    const chName=ch.name||'';
    if(ch.positions) ch.positions.forEach((p,i)=>all.push({pos:p,chapter:chName,sub:'',chId,scId:null,posIdx:i}));
    if(ch.subchapters) Object.entries(ch.subchapters).forEach(([scId,sc])=>{
      (sc.positions||[]).forEach((p,i)=>all.push({pos:p,chapter:chName,sub:sc.name||'',chId,scId,posIdx:i}));
    });
  });
  return all;
}

// ─── Intent detection ───
function _aiDetectIntent(q){
  const l=q.toLowerCase();
  return {
    isCR:     /\bcr\b|central.?ray|angle|angulation|زاوية/.test(l),
    isKV:     /\bkvp?\b|kilovolt|كيلو/.test(l),
    isSID:    /\bsid\b|source.?image|مسافة/.test(l),
    isResp:   /resp|breath|inspir|expir|تنفس/.test(l),
    isIR:     /\bir\b|image.?receptor|cassette|film.?size/.test(l),
    isMa:     /\bma\b|\bmas\b|milliamp|exposure.?factor/.test(l),
    isRoutine:/routine|روتين/.test(l),
    isSpecial:/special|خاص/.test(l),
    isList:   /list|all|جميع|كل|enumerate|show.?all/.test(l),
    isCompare:/\bvs\b|versus|differ|مقارنة|الفرق|compare/.test(l),
    isChapter:/chapter|فصل|قسم/.test(l),
    isError:  /error|mistake|wrong|common|artifact|خطأ/.test(l),
  };
}

// ─── Multi-level search with scoring ───
function _aiSearch(query){
  const q=query.toLowerCase().trim();
  const all=_aiGetAllPositions();
  const results=[];
  const stopWords=new Set(['the','a','an','is','are','what','how','which','for','of','in','on','at','to','and','or','with','from','about','this','that']);
  const keywords=q.split(/[\s,?؟.،:;()\/]+/).filter(w=>w.length>1 && !stopWords.has(w));

  all.forEach(({pos,chapter,sub,chId,scId,posIdx})=>{
    let score=0;
    const pname=(pos.name||'').toLowerCase();
    const pdesc=(pos.info?.desc||'').toLowerCase();
    const pcr=(pos.info?.cr||'').toLowerCase();
    const pkv=(pos.info?.kv||'').toLowerCase();
    const pir=(pos.info?.ir||'').toLowerCase();
    const psid=(pos.info?.sid||'').toLowerCase();
    const presp=(pos.info?.resp||'').toLowerCase();
    const chLow=(chapter+' '+sub).toLowerCase();
    const fulltext=pname+' '+pdesc+' '+pcr+' '+pkv+' '+pir+' '+psid+' '+presp+' '+chLow;

    // Exact phrase match — highest priority
    if(pname===q) score+=100;
    else if(pname.includes(q)) score+=60;
    else if(pdesc.includes(q)) score+=20;

    keywords.forEach(kw=>{
      if(kw.length<2) return;
      if(pname===kw) score+=35;
      else if(pname.startsWith(kw)) score+=22;
      else if(pname.includes(kw)) score+=14;
      if(pcr.includes(kw)) score+=8;
      if(pdesc.includes(kw)) score+=6;
      if(chLow.includes(kw)) score+=5;
      if(pkv.includes(kw)||pir.includes(kw)||psid.includes(kw)) score+=4;
      if(fulltext.includes(kw)) score+=2;
    });

    // Abbreviation matching: "PA" matches "PA Chest", "PA Projection"
    const abbrevMatch=q.match(/^([A-Z]{1,5})(\s|$)/);
    if(abbrevMatch && pname.toLowerCase().startsWith(abbrevMatch[1].toLowerCase())) score+=15;

    if(score>0) results.push({pos,chapter,sub,score,chId,scId,posIdx});
  });

  results.sort((a,b)=>b.score-a.score);
  return results.slice(0,8);
}

// ─── Build structured answer ───
function _aiBuildAnswer(query, matches){
  const q=query.toLowerCase();
  const intent=_aiDetectIntent(q);

  if(intent.isList && intent.isChapter) return _aiListChapters();
  if(intent.isList && intent.isRoutine) return _aiListByType('routine');
  if(intent.isList && intent.isSpecial) return _aiListByType('special');
  if(!matches.length) return _aiGeneralAnswer(query);

  const top=matches[0];
  const pos=top.pos;
  const info=pos.info||{};
  const section=top.sub?`${top.chapter} › ${top.sub}`:top.chapter;
  const typeLabel=pos.type==='routine'?'Routine':'Special';

  // Build focused answer based on intent
  let response='';

  if(intent.isCR && info.cr){
    response=`**${pos.name}** — Central Ray:\n\n**CR:** ${info.cr}`;
    if(info.scan3) response+=`\n\n_Quick:_ ${info.scan3}`;
  } else if(intent.isKV && info.kv){
    response=`**${pos.name}** — Technique:\n\n**kVp:** ${info.kv}`;
    if(info.ma) response+=`\n**mA:** ${info.ma}`;
    if(info.mas) response+=`\n**mAs:** ${info.mas}`;
    if(info.sid) response+=`\n**SID:** ${info.sid}`;
    if(info.resp) response+=`\n**Respiration:** ${info.resp}`;
  } else if(intent.isResp && info.resp){
    response=`**${pos.name}** — Respiration:\n\n**${info.resp}**`;
    if(info.desc && info.desc.toLowerCase().includes('breath')) response+=`\n\n${info.desc.split('.').filter(s=>s.toLowerCase().includes('breath')||s.toLowerCase().includes('inspir')||s.toLowerCase().includes('expir')).join('. ').trim()}`;
  } else if(intent.isMa){
    response=`**${pos.name}** — Exposure Factors:\n`;
    if(info.kv) response+=`**kVp:** ${info.kv}\n`;
    if(info.ma) response+=`**mA Range:** ${info.ma}\n`;
    if(info.mas) response+=`**mAs Range:** ${info.mas}\n`;
    if(!info.ma && !info.mas) response+=`_mA/mAs not manually set — check Exposure Factors Reference card on the position page._`;
  } else {
    // Full answer
    response=`**${pos.name}**\n_${section}_ · ${typeLabel}\n\n`;
    if(info.desc){
      // Limit description to 3 sentences for readability
      const sentences=info.desc.split(/[.!?]+/).filter(s=>s.trim().length>5).slice(0,3);
      response+=sentences.join('. ')+(sentences.length===3?'...':'')+'\n\n';
    }
    const tech=[];
    if(info.cr)   tech.push(`**CR:** ${info.cr}`);
    if(info.ir)   tech.push(`**IR:** ${info.ir}`);
    if(info.sid)  tech.push(`**SID:** ${info.sid}`);
    if(info.kv)   tech.push(`**kVp:** ${info.kv}`);
    if(info.resp) tech.push(`**Resp:** ${info.resp}`);
    if(info.ma)   tech.push(`**mA:** ${info.ma}`);
    if(info.mas)  tech.push(`**mAs:** ${info.mas}`);
    if(tech.length) response+=tech.join('\n');
  }

  // Related positions
  if(matches.length>1 && !intent.isCR && !intent.isKV && !intent.isResp){
    response+=`\n\n---\n**Related positions:**\n`;
    matches.slice(1,4).forEach(m=>{
      const s=m.sub?` › ${m.sub}`:'';
      response+=`• **${m.pos.name}** _(${m.chapter}${s})_\n`;
    });
  }

  return response;
}

// ─── Compare two projections ───
function _aiCompare(query, matches){
  if(matches.length<2) return null;
  const a=matches[0], b=matches[1];
  const ia=a.pos.info||{}, ib=b.pos.info||{};
  const aSection=a.sub?`${a.chapter} › ${a.sub}`:a.chapter;
  const bSection=b.sub?`${b.chapter} › ${b.sub}`:b.chapter;

  // Build HTML comparison table
  const rows=[
    ['Chapter', aSection, bSection],
    ['Type', a.pos.type==='routine'?'Routine':'Special', b.pos.type==='routine'?'Routine':'Special'],
    ['Patient Position', _extractPatientPosShort(ia.desc||''), _extractPatientPosShort(ib.desc||'')],
    ['CR', ia.cr||'—', ib.cr||'—'],
    ['IR Size', ia.ir||'—', ib.ir||'—'],
    ['SID', ia.sid||'—', ib.sid||'—'],
    ['kVp', ia.kv||'—', ib.kv||'—'],
    ['mA Range', ia.ma||'Auto', ib.ma||'Auto'],
    ['mAs Range', ia.mas||'Auto', ib.mas||'Auto'],
    ['Respiration', ia.resp||'—', ib.resp||'—'],
  ];

  let tableHtml=`<div style="margin:4px 0 8px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--text3)">Comparison</div>
<div style="border-radius:10px;overflow:hidden;border:1.5px solid var(--border2);font-size:12px">
<div style="display:grid;grid-template-columns:80px 1fr 1fr;background:var(--accent);color:#fff;font-weight:700;font-size:11px">
  <div style="padding:8px 10px">Parameter</div>
  <div style="padding:8px 10px;border-left:1px solid rgba(255,255,255,.2)">${esc(a.pos.name)}</div>
  <div style="padding:8px 10px;border-left:1px solid rgba(255,255,255,.2)">${esc(b.pos.name)}</div>
</div>`;

  rows.forEach(([label,va,vb],i)=>{
    if(!va||!vb) return;
    const same=va===vb;
    const bg=same?'':'';
    const highlightA=(!same&&va!=='—')?'background:rgba(0,87,184,.06);':'';
    const highlightB=(!same&&vb!=='—')?'background:rgba(200,150,12,.06);':'';
    tableHtml+=`<div style="display:grid;grid-template-columns:80px 1fr 1fr;border-top:1px solid var(--border);${i%2===1?'background:var(--bg2)':'background:var(--bg)'}">
  <div style="padding:7px 10px;font-weight:700;color:var(--text3);font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center">${label}</div>
  <div style="padding:7px 10px;border-left:1px solid var(--border);color:var(--text);${highlightA}line-height:1.45">${esc(va)}</div>
  <div style="padding:7px 10px;border-left:1px solid var(--border);color:var(--text);${highlightB}line-height:1.45">${esc(vb)}</div>
</div>`;
  });
  tableHtml+='</div>';

  // Add key differences summary
  const diffs=rows.filter(([l,va,vb])=>va&&vb&&va!==vb&&va!=='—'&&vb!=='—').map(([l])=>l);
  if(diffs.length){
    tableHtml+=`<div style="margin-top:8px;padding:8px 12px;background:var(--accent-bg);border-radius:8px;border:1px solid var(--c-position-border);font-size:12px;color:var(--text2)"><strong style="color:var(--accent)">Key differences:</strong> ${diffs.join(' · ')}</div>`;
  }

  return '[[HTML]]'+tableHtml;
}

function _extractPatientPosShort(desc){
  if(!desc) return '—';
  const m=desc.match(/(?:erect|supine|prone|seated|standing|lateral|upright|recumbent)[^,;.\n]*/i);
  return m?m[0].trim().slice(0,60):'See description';
}

// ─── List all chapters ───
function _aiListChapters(){
  let r='**All Chapters in the Program:**\n\n';
  Object.entries(BOOK).forEach(([id,ch])=>{
    let total=0;
    if(ch.positions) total+=ch.positions.length;
    if(ch.subchapters) Object.values(ch.subchapters).forEach(sc=>total+=sc.positions.length);
    r+=`${ch.icon||'◉'} **${ch.name}** — ${total} positions\n`;
    if(ch.subchapters) Object.values(ch.subchapters).forEach(sc=>{
      r+=`  └ ${sc.name} (${sc.positions.length})\n`;
    });
  });
  const total=_aiGetAllPositions().length;
  r+=`\n**Total: ${total} positions** in ${Object.keys(BOOK).length} chapters`;
  return r;
}

// ─── List by type ───
function _aiListByType(type){
  const all=_aiGetAllPositions();
  const filtered=all.filter(({pos})=>pos.type===type);
  let r=`**${type==='routine'?'Routine':'Special'} Positions (${filtered.length}):**\n\n`;
  let lastCh='';
  filtered.forEach(({pos,chapter,sub})=>{
    const sec=sub?`${chapter} › ${sub}`:chapter;
    if(sec!==lastCh){ r+=`\n**${sec}:**\n`; lastCh=sec; }
    r+=`• ${pos.name}\n`;
  });
  return r;
}

// ─── Dynamic knowledge from live BOOK data ───
function _aiDynamicKnowledge(query){
  const q=query.toLowerCase();
  const all=_aiGetAllPositions();

  // kVp by region
  const kvBodyMatch=q.match(/kvp?.*(chest|abdomen|spine|rib|sternum|hand|wrist|elbow|forearm|shoulder|humerus|knee|leg|foot|ankle|hip|pelvis|finger|thumb|toe)/i)
    || q.match(/(chest|abdomen|spine|rib|sternum|hand|wrist|elbow|forearm|shoulder|humerus|knee|leg|foot|ankle|hip|pelvis|finger|thumb|toe).*kvp?/i);
  if(kvBodyMatch){
    const kw=(kvBodyMatch[1]||kvBodyMatch[2]).toLowerCase();
    const found=all.filter(({pos,chapter,sub})=>
      (pos.name+' '+chapter+' '+sub).toLowerCase().includes(kw) && pos.info?.kv
    ).slice(0,8);
    if(found.length){
      let r=`**kVp ranges for ${kw}:**\n`;
      found.forEach(({pos})=>r+=`• **${pos.name}**: ${pos.info.kv}\n`);
      return r;
    }
  }

  // SID summary
  if(/\bsid\b/.test(q) && !/specific|what is/.test(q)){
    const sidMap={};
    all.forEach(({pos,chapter})=>{
      if(pos.info?.sid){ const k=pos.info.sid; if(!sidMap[k]) sidMap[k]=[]; sidMap[k].push(pos.name); }
    });
    let r='**Common SID values (from program data):**\n';
    Object.entries(sidMap).sort().forEach(([sid,names])=>{
      r+=`• **${sid}**: ${names.slice(0,3).join(', ')}${names.length>3?` (+${names.length-3} more)`:''}\n`;
    });
    return r;
  }

  // Respiration summary
  if(/respir|breath|inspir|expir/.test(q)){
    const map={inspiration:[],expiration:[],suspended:[],other:[]};
    all.forEach(({pos})=>{
      const r=(pos.info?.resp||'').toLowerCase();
      if(!r) return;
      if(r.includes('inspir')) map.inspiration.push(pos.name);
      else if(r.includes('expir')) map.expiration.push(pos.name);
      else if(r.includes('suspend')) map.suspended.push(pos.name);
      else map.other.push(pos.name);
    });
    let r='**Positions by Respiration:**\n\n';
    if(map.inspiration.length) r+=`**Inspiration (${map.inspiration.length}):** ${map.inspiration.slice(0,6).join(', ')}${map.inspiration.length>6?'...':''}\n\n`;
    if(map.expiration.length) r+=`**Expiration (${map.expiration.length}):** ${map.expiration.slice(0,6).join(', ')}${map.expiration.length>6?'...':''}\n\n`;
    if(map.suspended.length) r+=`**Suspended (${map.suspended.length}):** ${map.suspended.slice(0,6).join(', ')}${map.suspended.length>6?'...':''}\n`;
    return r;
  }

  // mA/mAs summary
  if(/\bma\b|\bmas\b|milliamp|exposure factor/i.test(q)){
    return `**Typical Exposure Factors by Region:**\n\n**Chest PA/Lateral:** 100–400 mA · 1–5 mAs (180 cm SID, grid)\n**Extremities (fingers/hand/foot):** 50–150 mA · 1–4 mAs (tabletop)\n**Wrist/Ankle/Elbow/Knee:** 100–200 mA · 2–8 mAs\n**Shoulder/Hip/Femur:** 200–400 mA · 5–15 mAs (grid)\n**Spine (C/T/L):** 200–500 mA · 10–60 mAs (grid required)\n**Abdomen/Pelvis:** 200–400 mA · 20–50 mAs (grid)\n\n_Note: Use the Exposure Factors Reference card on each position page for region-specific guidance._`;
  }

  return null;
}

// ─── General + fixed knowledge bank ───
function _aiGeneralAnswer(query){
  const q=query.toLowerCase();

  const dyn=_aiDynamicKnowledge(query);
  if(dyn) return dyn;

  if(/(list|show|all|every).*(chapter|position|content)/i.test(q)) return _aiListChapters();

  if(/how many|total count|statistics|كم|إجمالي/.test(q)){
    const all=_aiGetAllPositions();
    const routine=all.filter(x=>x.pos.type==='routine').length;
    const special=all.filter(x=>x.pos.type==='special').length;
    const qTotal=Object.values(QUIZ).reduce((a,v)=>a+(v?v.length:0),0);
    return `**Program Statistics:**\n• Routine positions: **${routine}**\n• Special positions: **${special}**\n• Total positions: **${all.length}**\n• Total quiz questions: **${qTotal}**\n• Chapters: **${Object.keys(BOOK).length}**`;
  }

  const kb=[
    {keys:['pleural effusion','hydrothorax','انصباب'],
     ans:'**Pleural Effusion:**\nAbnormal fluid in pleural space.\n\n**Best position:** Lateral Decubitus (affected side down) with horizontal beam\n**Appearance:** Increased opacity, oblique angle at costophrenic angle\n**Minimum detectable:** ~200 mL on PA; ~50 mL on lateral decubitus'},
    {keys:['pneumothorax','استرواح','استرواح صدري'],
     ans:'**Pneumothorax:**\nAir in pleural space → lung collapse.\n\n**Best position:** PA Erect on full expiration (enhances contrast)\n**Alternative:** Lateral decubitus (affected side up) with horizontal beam\n**Appearance:** Visible lung edge, absent lung markings peripherally'},
    {keys:['pneumoperitoneum','free air','peritoneal'],
     ans:'**Pneumoperitoneum — Free Intraperitoneal Air:**\nUsually from perforated hollow viscus.\n\n**Best position:** Left Lateral Decubitus (air rises to right, away from gastric bubble)\n**Appearance:** Radiolucent crescent under right hemidiaphragm\n**Wait time:** Patient in position 5–20 min before exposure'},
    {keys:['bennett','بينيت'],
     ans:'**Bennett Fracture:**\nIntra-articular fracture at base of 1st metacarpal with dislocation.\n\n**Projection:** AP Axial Thumb — Modified Robert Method\n**CR:** 15° proximally toward wrist, entering at 1st CMC joint'},
    {keys:['colles','كولز'],
     ans:'**Colles Fracture:**\nFracture of distal radius with dorsal (posterior) displacement.\n\n**Projections:** PA Wrist + Lateral Wrist\n**Common in:** Postmenopausal women (osteoporosis) — FOOSH injury'},
    {keys:['scaphoid','navicular','زورقي','زورقية'],
     ans:'**Scaphoid Fracture:**\nMost common carpal fracture — may not show immediately.\n\n**Projections:** PA + Lateral + Ulnar Deviation + Semisupination oblique\n**If not visible:** Repeat at 10–14 days, or CT/MRI for confirmation\n**Risk:** Avascular necrosis if missed'},
    {keys:['hip fracture','كسر الورك','hip trauma'],
     ans:'**Hip Fracture Protocol:**\n**WARNING:** Do NOT internally rotate leg if fracture suspected!\n\n**Sequence:** AP Pelvis (bilateral) → AP Hip → Axiolateral Inferosuperior (Danelius-Miller)\n**CR (Danelius-Miller):** Horizontal beam, perpendicular to femoral neck'},
    {keys:['danelius','miller','danelius-miller','axiolateral inferosuperior'],
     ans:'**Axiolateral Inferosuperior — Danelius-Miller:**\nLateral hip projection for trauma when leg cannot be moved.\n\n**Setup:** Unaffected leg raised ~90°; grid/IR placed in groin\n**CR:** Horizontal, perpendicular to femoral neck\n**Key:** No rotation of affected limb'},
    {keys:['judet','posterior oblique pelvis','جوديه'],
     ans:'**Judet Method — Acetabulum:**\n45° Posterior Oblique, both sides.\n\n• **Affected side down (internal oblique):** Anterior rim + posterior column\n• **Affected side up (external oblique):** Posterior rim + anterior column\n**CR:** 2 inches below ASIS, directed to hip'},
    {keys:['kvp range','kilovoltage range','kv ranges'],
     ans:`**Standard kVp Ranges:**\n• Chest PA/Lateral: **110–125 kVp**\n• Ribs / Sternum: **70–85 kVp**\n• Abdomen / KUB: **70–85 kVp**\n• Fingers / Hand: **55–65 kVp**\n• Wrist / Forearm: **60–70 kVp**\n• Elbow / Humerus: **65–75 kVp**\n• Shoulder: **70–80 kVp**\n• Cervical Spine: **70–85 kVp**\n• Thoracic Spine: **75–85 kVp**\n• Lumbar Spine: **80–90 kVp**\n• Pelvis / Hip: **80–90 kVp**\n• Knee / Leg: **65–80 kVp**\n• Foot / Ankle: **60–75 kVp**`},
    {keys:['sid standard','source image','180','72 inch'],
     ans:'**Standard SID Values:**\n• **100 cm (40 in):** Most body parts — standard minimum\n• **180 cm (72 in):** Chest PA/Lateral — mandatory to reduce cardiac magnification\n• **150–180 cm:** Lateral Sternum (RAO) — reduce magnification\n\n**Rule:** Longer SID = less magnification = sharper image'},
    {keys:['rao lao','oblique chest','chest oblique'],
     ans:'**Chest Obliques:**\n• **RAO (45°):** Demonstrates LEFT lung without cardiac superimposition\n• **LAO (45°–60°):** Demonstrates RIGHT lung; best cardiac view\n• **RPO = LAO anatomy; LPO = RAO anatomy** (opposite patient rotation)\n\n**Heart:** Best shown on LAO 60°'},
    {keys:['pa vs ap','pa ap difference','anteroposterior'],
     ans:'**PA vs AP:**\n• **PA:** Heart/anterior structures closer to IR → less magnification, sharper image\n• **AP:** Heart further from IR → more magnification (~15–20% larger heart)\n\n**Use AP when:** Patient cannot stand/cooperate (trauma, ICU)'},
    {keys:['grid','bucky','grid ratio'],
     ans:'**Grid Usage Guidelines:**\n• **Required when:** Part thickness ≥ 10 cm\n• **Not used (tabletop):** Thin extremities — fingers, hand, wrist, foot, ankle\n• **Grid ratios:** 8:1 (general), 12:1 (high kVp chest)\n• **Moving grid (Bucky):** Eliminates grid lines on image'},
    {keys:['aec','automatic exposure','phototimer'],
     ans:'**AEC — Automatic Exposure Control:**\n**Good for:** Chest, abdomen, spine, pelvis\n**Avoid for:** Ribs (uneven density), very small/thin parts\n**Detector placement:** Active cell must be under the anatomy of interest'},
    {keys:['gonadal shield','shielding','gonad'],
     ans:'**Gonadal Shielding:**\n• **Male:** Upper edge of shield at superior edge of pubic symphysis\n• **Female:** Difficult due to internal ovary location — use contact shield when ovaries not in primary beam\n• **Children:** Always shield when gonads within or near primary field'},
    {keys:['folio','stress view','ucl','ulnar collateral'],
     ans:'**PA Stress Thumb — Folio Method:**\nEvaluates ulnar collateral ligament (UCL) at 1st MCP joint.\n\n**Setup:** Both thumbs PA, round spacer between thumbs, patient pulls apart\n**CR:** Perpendicular to midpoint between MCP joints\n**Positive:** Angle ≥ 20° = torn or sprained UCL (Skier\'s thumb)'},
    {keys:['weight bearing','standing','erect','weightbearing'],
     ans:'**Weight-Bearing Projections:**\nImportant for functional assessment of joints under load.\n\n**Common WB projections:**\n• AP Ankle (erect) — joint space narrowing assessment\n• PA Foot (erect) — flatfoot, arch evaluation\n• AP Knee (erect bilateral) — Rosenberg view for cartilage loss\n• PA Chest (erect) — standard for chest radiography'},
    {keys:['trauma series','trauma protocol','emergency'],
     ans:'**Common Trauma Series:**\n• **Cervical spine:** Lateral (immediate) → AP → Open Mouth → Swimmers if needed\n• **Chest trauma:** AP (supine if needed) → Lateral if possible\n• **Hip trauma:** AP Pelvis bilateral → AP Hip → Danelius-Miller (no rotation!)\n• **Wrist trauma:** PA + Lateral + Oblique\n• **Ankle trauma:** AP + Lateral + Mortise'},
  ];

  for(const item of kb){
    if(item.keys.some(k=>q.includes(k.toLowerCase()))) return item.ans;
  }

  // Final fallback: show top search results
  const fallback=_aiSearch(query);
  if(fallback.length) return _aiBuildAnswer(query, fallback);

  const totalPos=_aiGetAllPositions().length;
  return `**No specific result for: "${query}"**\n\nThe program has **${totalPos} positions** ready to search. Try:\n• Position name: _PA Chest, Lateral Knee, Mortise Ankle_\n• Technical term: _CR, kVp, SID, IR, respiration, grid_\n• Anatomy: _wrist, spine, hip, shoulder, foot_\n• Pathology: _pneumothorax, fracture, effusion, Bennett_\n• Type: _routine, special_\n\nOr type **"list all chapters"** to see everything.`;
}

function _aiSuggestedAnswer(query){
  const q=query.toLowerCase().trim();
  if(q==='list all chapters') return _aiListChapters();
  if(q==='pa chest cr and technique' || q==='pa chest cr & technique'){
    const matches=_aiSearch('pa chest');
    return matches.length?_aiBuildAnswer('pa chest',matches):_aiGeneralAnswer(query);
  }
  if(q==='lateral knee positioning'){
    const matches=_aiSearch('lateral knee');
    return matches.length?_aiBuildAnswer('lateral knee',matches):_aiGeneralAnswer(query);
  }
  if(q==='compare pa chest vs ap chest' || q==='pa vs ap chest' || q==='pa chest vs ap chest'){
    const matches=[...new Set([].concat(_aiSearch('pa chest'), _aiSearch('ap chest')))].slice(0,4);
    const cmp=_aiCompare(query,matches);
    return cmp||_aiBuildAnswer(query,matches);
  }
  if(q==='compare rao chest vs lao chest' || q==='rao vs lao chest' || q==='rao chest vs lao chest'){
    const matches=[...new Set([].concat(_aiSearch('rao chest'), _aiSearch('lao chest')))].slice(0,4);
    const cmp=_aiCompare(query,matches);
    return cmp||_aiBuildAnswer(query,matches);
  }
  if(q==='danelius-miller hip axiolateral' || q==='danelius miller hip axiolateral' || q==='hip trauma'){
    const matches=_aiSearch('danelius-miller');
    return matches.length?_aiBuildAnswer(query,matches):_aiGeneralAnswer(query);
  }
  if(q==='kvp ranges for all regions' || q==='kvp reference' || q==='kVp reference'){
    return `**Standard kVp Ranges:**\n• Chest PA/Lateral: **110–125 kVp**\n• Ribs / Sternum: **70–85 kVp**\n• Abdomen / KUB: **70–85 kVp**\n• Fingers / Hand: **55–65 kVp**\n• Wrist / Forearm: **60–70 kVp**\n• Elbow / Humerus: **65–75 kVp**\n• Shoulder: **70–80 kVp**\n• Cervical Spine: **70–85 kVp**\n• Thoracic Spine: **75–85 kVp**\n• Lumbar Spine: **80–90 kVp**\n• Pelvis / Hip: **80–90 kVp**\n• Knee / Leg: **65–80 kVp**\n• Foot / Ankle: **60–75 kVp**`;
  }
  if(/\bma\b.*\bmas\b|\bmas\b.*\bma\b|\bma\s*\/\s*mas\b/.test(q) || q==='ma mAs exposure factors' || q==='mA mAs exposure factors' || q==='mA/mAs exposure factors'){
    return `**Exposure factor guidance:**\n• **Chest PA/Lateral:** 100–400 mA · 1–5 mAs (180 cm SID, grid)\n• **Extremities (fingers/hand/foot):** 50–150 mA · 1–4 mAs (tabletop)\n• **Wrist/Ankle/Elbow/Knee:** 100–200 mA · 2–8 mAs\n• **Shoulder/Hip/Femur:** 200–400 mA · 5–15 mAs (grid)\n• **Spine (C/T/L):** 200–500 mA · 10–60 mAs (grid required)\n• **Abdomen/Pelvis:** 200–400 mA · 20–50 mAs (grid)\n\n_Note: Use the Exposure Factors Reference card on each position page for region-specific guidance._`;
  }
  if(q==='pleural effusion' || q==='pleural effusion radiographic signs'){
    return `**Pleural Effusion:**\nFluid in the pleural space.\n\n**Best position:** Lateral decubitus (affected side down) with horizontal beam.\n**Appearance:** Blunted costophrenic angle, increased opacity, meniscus sign.\n**Note:** On PA, look for obliteration of the lateral costophrenic angle and layering fluid.`;
  }
  if(q==='pneumothorax best projection' || q==='pneumothorax'){
    return `**Pneumothorax — Best projection:**\n• **PA erect:** Preferred for spontaneous pneumothorax.\n• **Lateral decubitus (affected side up):** Best for small or occult pneumothorax when patient cannot stand.\n**Appearance:** Visible visceral pleural line with absent lung markings peripheral to it.`;
  }
  return null;
}

// ─── Format reply with markdown-like rendering ───
function _aiFormatReply(text){
  // Raw HTML passthrough for compare tables
  if(text.startsWith('[[HTML]]')) return text.slice(8);
  return text
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/`(.*?)`/g,'<code style="background:var(--bg3);padding:2px 5px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/^---$/gm,'<hr style="border:none;border-top:1px solid var(--border);margin:8px 0">')
    .replace(/\n/g,'<br>');
}

// ─── Main send function ───
function sendAI(prompt){
  var input=document.getElementById('aiInput');
  var msg=(prompt||input.value).trim();
  if(!msg) return;
  input.value='';
  var chat=document.getElementById('aiChat');
  document.getElementById('aiSuggestions').style.display='none';
  chat.innerHTML+=`<div class="ai-bubble user">${esc(msg)}</div>`;

  var tid='think-'+Date.now();
  const totalPos=_aiGetAllPositions().length;
  chat.innerHTML+=`<div class="ai-bubble thinking" id="${tid}">Searching ${totalPos} positions…</div>`;
  chat.scrollTop=chat.scrollHeight;

  setTimeout(()=>{
    const suggested=_aiSuggestedAnswer(msg);
    let reply;
    if(suggested){
      reply=suggested;
    } else {
      const intent=_aiDetectIntent(msg);
      const matches=_aiSearch(msg);

      // Compare intent: "RAO vs LAO", "PA vs AP", "compare X vs Y"
      const compareMatch=msg.match(/compare\s+(.+?)\s+(?:vs?|versus|and)\s+(.+)/i)||msg.match(/(.+?)\s+vs?\.?\s+(.+)/i);
      if((intent.isCompare || compareMatch) && matches.length>=2){
        // Try to find the two named positions if explicit
        let cmpMatches=matches;
        if(compareMatch){
          const nameA=compareMatch[1].trim(), nameB=compareMatch[2].trim();
          const all=_aiGetAllPositions();
          const findPos=name=>{
            const nl=name.toLowerCase();
            return all.find(({pos})=>pos.name.toLowerCase().includes(nl)||nl.includes(pos.name.toLowerCase().split(' ')[0]));
          };
          const foundA=findPos(nameA), foundB=findPos(nameB);
          if(foundA && foundB) cmpMatches=[foundA, foundB];
        }
        const cmp=_aiCompare(msg, cmpMatches);
        reply = cmp || _aiBuildAnswer(msg, matches);
      } else if(matches.length>0){
        reply=_aiBuildAnswer(msg, matches);
      } else {
        reply=_aiGeneralAnswer(msg);
      }
    }

    var tel=document.getElementById(tid);
    if(tel) tel.remove();
    chat.innerHTML+=`<div class="ai-bubble bot">${_aiFormatReply(reply)}</div>`;
    chat.scrollTop=chat.scrollHeight;
  }, 220);
}

// ══════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════
function toggleDark(){
  const t=document.getElementById('darkToggle');
  t.classList.toggle('on');
  const isDark=t.classList.contains('on');
  document.body.classList.toggle('dark',isDark);
  t.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  // Update header icon
  const colorBtn = document.getElementById('colorModeBtn');
  if(colorBtn) colorBtn.innerHTML = isDark ? '<span style="font-size:18px;">🌙</span>' : '<span style="font-size:18px;">☀️</span>';
  // persist dark mode separately so it loads even without full appearance save
  try{ localStorage.setItem('bontrager_dark_v1', isDark?'1':'0'); }catch(e){}
}
function toggleLarge(){
  const t=document.getElementById('largeToggle');
  t.classList.toggle('on');
  const big=t.classList.contains('on');
  const sz=big?'17px':'15px';
  document.documentElement.style.setProperty('--base-fs',sz);
  document.body.style.fontSize=sz;
  t.setAttribute('aria-pressed', big ? 'true' : 'false');
  try{ localStorage.setItem('bontrager_large_v1', big?'1':'0'); }catch(e){}
}

// ══════════════════════════════════════════════
// PROFILE MODAL
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
// DEV — ADD / DELETE CHAPTERS
// ══════════════════════════════════════════════
function buildAddChapterPanel(){
  const panel=document.getElementById('devAddChapterPanel');
  if(!panel) return;
  if(userRole!=='developer'){panel.style.display='none';return;}
  panel.style.display='block';
  panel.innerHTML=`
    <div class="dev-add-chapter-panel">
      <div class="dap-title">🛠 Add New Chapter</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <input id="newChId" placeholder="Chapter ID (e.g. wrist)" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none">
        <input id="newChName" placeholder="Chapter Name (e.g. Wrist)" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none">
        <input id="newChIcon" placeholder="Icon emoji (e.g. 🦴)" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none">
        <div style="display:flex;gap:8px">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);cursor:pointer">
            <input type="checkbox" id="newChHasSub"> Has Sub-chapters
          </label>
        </div>
        <button onclick="addChapter()" style="padding:10px;border-radius:var(--radius-sm);border:none;background:var(--green);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">+ Add Chapter</button>
      </div>
    </div>`;
}

function addChapter(){
  const id=document.getElementById('newChId').value.trim().replace(/\s+/g,'_').toLowerCase();
  const name=document.getElementById('newChName').value.trim();
  const icon=document.getElementById('newChIcon').value.trim()||'📋';
  const hasSub=document.getElementById('newChHasSub').checked;
  if(!id||!name){alert('Enter both Chapter ID and Name.');return;}
  if(BOOK[id]){alert('Chapter ID already exists.');return;}
  if(hasSub){
    BOOK[id]={name,icon,subchapters:{}};
  } else {
    BOOK[id]={name,icon,positions:[]};
    QUIZ[id]=[];
  }
  document.getElementById('newChId').value='';
  document.getElementById('newChName').value='';
  document.getElementById('newChIcon').value='';
  buildChapters();
  if(userRole==='developer'){devSaveData();_showToast('💾 تم حفظ الفصل الجديد');}
}

function deleteChapter(chId){
  const ch=BOOK[chId];
  showConfirm('Delete Chapter',`Delete chapter "${ch.name}" and all its content?`,()=>{
    delete BOOK[chId];
    // Remove related quiz keys
    Object.keys(QUIZ).filter(k=>k===chId||k.startsWith(chId+'_')).forEach(k=>delete QUIZ[k]);
    buildChapters();
    navTo('learn-chapters');
  });
}

// ══════════════════════════════════════════════
// DEV — APPEARANCE CONTROLS
// ══════════════════════════════════════════════
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
    if(a.fs){ root.style.setProperty('--base-fs',a.fs+'px'); document.body.style.fontSize=a.fs+'px'; }
    if(a.dark){ document.body.classList.add('dark'); const t=document.getElementById('darkToggle'); if(t) t.classList.add('on'); }
    if(a.large){ const t=document.getElementById('largeToggle'); if(t) t.classList.add('on'); }
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
  document.getElementById('dap-fontsize').value=parseInt(document.body.style.fontSize)||15;
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
  const fs=parseInt(document.getElementById('dap-fontsize').value)||15;
  const root=document.documentElement;
  root.style.setProperty('--bg2',bg);
  root.style.setProperty('--bg',bgCard);
  root.style.setProperty('--accent',accent);
  root.style.setProperty('--text',text);
  root.style.setProperty('--text2',text2);
  // Set font size via CSS variable so it cascades properly
  root.style.setProperty('--base-fs',fs+'px');
  document.body.style.fontSize=fs+'px';
}

function saveAppearance(){
  applyAppearanceValues();
  _savedAppearance={
    bg:document.getElementById('dap-bg').value,
    bgCard:document.getElementById('dap-bg-card').value,
    accent:document.getElementById('dap-accent').value,
    text:document.getElementById('dap-text').value,
    text2:document.getElementById('dap-text2').value,
    fs:document.getElementById('dap-fontsize').value,
    dark:document.body.classList.contains('dark'),
    large:document.getElementById('largeToggle')?.classList.contains('on')||false
  };
  try{ localStorage.setItem(_APPEARANCE_KEY, JSON.stringify(_savedAppearance)); }catch(e){}
  _showToast('🎨 تم حفظ المظهر');
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
  // sync inputs
  const style=getComputedStyle(root);
  const toHex=v=>{v=v.trim();if(v.startsWith('#'))return v;const m=v.match(/\d+/g);if(m&&m.length>=3)return '#'+m.slice(0,3).map(n=>parseInt(n).toString(16).padStart(2,'0')).join('');return '#ffffff';};
  document.getElementById('dap-bg').value=toHex(style.getPropertyValue('--bg2'));
  document.getElementById('dap-bg-card').value=toHex(style.getPropertyValue('--bg'));
  document.getElementById('dap-accent').value=toHex(style.getPropertyValue('--accent'));
  document.getElementById('dap-text').value=toHex(style.getPropertyValue('--text'));
  document.getElementById('dap-text2').value=toHex(style.getPropertyValue('--text2'));
  document.getElementById('dap-fontsize').value=15;
  _showToast('تم إعادة ضبط المظهر');
  closeDevAppearance();
}

// ══════════════════════════════════════════════
// DEV — POSITION IMAGE MANAGEMENT
// ══════════════════════════════════════════════
// ══════════════════════════════════════════════
// IMAGE MANAGEMENT — POSITION IMAGES (BASE64 EMBEDDED)
// ══════════════════════════════════════════════
function _refreshPosImgDisplay(){
  if(!curPos) return;
  const img1  = document.getElementById('posImg');
  const img2  = document.getElementById('posImg2');
  const ph    = document.getElementById('posImgPh');
  const wrap  = document.getElementById('posImgWrap');
  const row   = document.getElementById('posImgRow');

  // ── 1. Try auto-images from IMAGE_DATA first (upper-limb positions) ──
  const autoData = _getImagesForPos(curPos.name);
  if(autoData && (autoData.positions.length || autoData.xrays.length)){
    // Hide legacy elements
    img1.style.display='none';
    img2.style.display='none';
    ph.style.display='none';
    row.style.display='flex';
    row.innerHTML='';

    const totalImgs = autoData.positions.length + autoData.xrays.length;
    // Layout classes for CSS-driven sizing
    row.className = '';
    if(totalImgs === 1) row.classList.add('layout-1');
    else if(totalImgs === 2) row.classList.add('layout-2');
    else row.classList.add('layout-many');

    function _makeCell(fname, type, labelText){
      const cell = document.createElement('div');
      cell.className = 'pos-img-cell type-' + type;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'pos-img-cell-img-wrap';

      const img = document.createElement('img');
      img.src = IMAGES_PATH + fname;
      img.alt = type === 'position' ? 'Positioning photo' : 'Radiograph';
      img.loading = 'lazy';
      img.title = 'Tap to zoom';
      img.onclick = () => openImgZoom(img.src);
      imgWrap.appendChild(img);

      const dot = document.createElement('span');
      dot.className = 'lbl-dot';

      const label = document.createElement('div');
      label.className = 'pos-img-cell-label';
      label.appendChild(dot);
      label.appendChild(document.createTextNode(labelText));

      cell.appendChild(imgWrap);
      cell.appendChild(label);
      return cell;
    }

    // Render position/setup photos first (green label)
    autoData.positions.forEach((fname, i) => {
      const lbl = autoData.positions.length > 1 ? `Positioning ${i + 1}` : 'Positioning';
      row.appendChild(_makeCell(fname, 'position', lbl));
    });

    // Render x-ray images (blue label)
    autoData.xrays.forEach((fname, i) => {
      const lbl = autoData.xrays.length > 1 ? `X-ray ${i + 1}` : 'X-ray Result';
      row.appendChild(_makeCell(fname, 'xray', lbl));
    });

    // Show scroll hint if many images
    const hint = document.getElementById('posImgScrollHint');
    if(hint){
      hint.style.display = totalImgs > 2 ? 'flex' : 'none';
      // Auto-hide scroll hint after first scroll
      if(totalImgs > 2){
        row.addEventListener('scroll', function(){ hint.style.display='none'; }, {once:true});
      }
    }
    return;
  }

  // ── 2. Fall back to manually uploaded images (dev posImg / posImg2) ──
  row.style.display='none';
  row.innerHTML='';

  if(curPos.posImg){
    img1.src=curPos.posImg;
    img1.style.display='block';
    ph.style.display='none';
    if(curPos.posImg2){
      img2.src=curPos.posImg2;
      img2.style.display='block';
      const layout=curPos.imgLayout||'side';
      if(layout==='stack'){
        img1.style.width='100%'; img2.style.width='100%';
        img1.style.borderLeft='none'; img2.style.borderLeft='none';
        wrap.style.flexDirection='column';
      } else {
        img1.style.width='50%'; img2.style.width='50%';
        img2.style.borderLeft='1px solid #333';
        wrap.style.flexDirection='row';
      }
    } else {
      img2.style.display='none';
      img1.style.width='100%';
      wrap.style.flexDirection='row';
    }
  } else {
    img1.style.display='none';
    img2.style.display='none';
    ph.style.display='flex';
  }
}

function devUploadPosImg(slot){
  if(userRole!=='developer') return;
  document.getElementById('posImgFileInput'+(slot||1)).click();
}

function handlePosImgFile(e,slot){
  if(userRole!=='developer'||!curPos) return;
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const data=ev.target.result;
    if(slot===2){ curPos.posImg2=data; }
    else { curPos.posImg=data; }
    _refreshPosImgDisplay();
    // Update dual tab preview
    if(slot===2){
      const thumb=document.getElementById('edImg2Thumb');
      const prev=document.getElementById('edImg2Preview');
      if(thumb){thumb.src=data; prev.style.display='block';}
    }
    if(typeof devSaveData==="function") devSaveData();
    _showToast('✅ Image '+(slot||1)+' uploaded');
  };
  reader.readAsDataURL(file);
  e.target.value='';
}

function devChangePosImg(){
  if(userRole!=='developer'||!curPos) return;
  const url=prompt('Enter image URL:', curPos.posImg||'');
  if(url===null) return;
  if(url.trim()){ curPos.posImg=url.trim(); _refreshPosImgDisplay(); if(typeof devSaveData==="function") devSaveData(); }
  else { devDeletePosImg(); }
}

function devDeletePosImg(){
  if(userRole!=='developer'||!curPos) return;
  showConfirm('Delete Images','Remove all images from this position?',()=>{
    delete curPos.posImg; delete curPos.posImg2; delete curPos.imgLayout;
    _refreshPosImgDisplay(); if(typeof devSaveData==="function") devSaveData();
  });
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
function devExportHTMLWithImages(){
  _showToast('⏳ Preparing export...');
  setTimeout(()=>{
    try{
      // Get current HTML
      const html=document.documentElement.outerHTML;
      // Find the BOOK and QUIZ variables and replace them with current state
      // We inject a script that self-replaces the data on load
      const bookJSON=JSON.stringify(BOOK);
      const quizJSON=JSON.stringify(QUIZ);
      // Create a self-contained HTML with injected data
      let exportHtml=html;
      // Replace the BOOK const declaration with current data
      exportHtml=exportHtml.replace(/const BOOK = \{[\s\S]*?\};\s*\n\s*\/\/ ── QUIZ DATA ──/m,
        'const BOOK = '+bookJSON+';\n// ── QUIZ DATA ──');
      exportHtml=exportHtml.replace(/const QUIZ = \{[\s\S]*?\};\s*\n\s*\/\/ ── QUIZ/m,
        'const QUIZ = '+quizJSON+';\n// ── QUIZ');
      const blob=new Blob([exportHtml],{type:'text/html;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download='bontrager_complete_'+new Date().toISOString().split('T')[0]+'.html';
      a.click();
      URL.revokeObjectURL(url);
      _showToast('✅ HTML exported with all embedded images!');
    }catch(err){
      alert('Export error: '+err.message);
    }
  },300);
}


function devChangeQuizImg(){
  if(userRole!=='developer'||!quizData.length) return;
  const q=quizData[quizIdx];
  const url=prompt('Enter new X-ray image URL:', q.xrayImg||'');
  if(url===null) return;
  q.xrayImg=url.trim();
  _syncQuizImgToGlobal(q);
  const xi=document.getElementById('xrayImg'), xph=document.getElementById('xrayPh');
  if(q.xrayImg){xi.src=q.xrayImg;xi.style.display='block';xph.style.display='none';}
  else{xi.style.display='none';xph.style.display='flex';}
}

function devUploadQuizImg(){
  if(userRole!=='developer') return;
  document.getElementById('quizImgFileInput').click();
}

function handleQuizImgFile(e){
  if(userRole!=='developer'||!quizData.length) return;
  const file=e.target.files[0];
  if(!file) return;
  const q=quizData[quizIdx];
  const reader=new FileReader();
  reader.onload=ev=>{
    q.xrayImg=ev.target.result;
    _syncQuizImgToGlobal(q);
    const xi=document.getElementById('xrayImg'), xph=document.getElementById('xrayPh');
    xi.src=q.xrayImg; xi.style.display='block'; xph.style.display='none';
  };
  reader.readAsDataURL(file);
  e.target.value='';
}

function devDeleteQuizImg(){
  if(userRole!=='developer'||!quizData.length) return;
  const q=quizData[quizIdx];
  showConfirm('Delete X-Ray Image','Remove the X-ray image from this question?',()=>{
    q.xrayImg='';
    _syncQuizImgToGlobal(q);
    const xi=document.getElementById('xrayImg'), xph=document.getElementById('xrayPh');
    xi.style.display='none'; xi.src=''; xph.style.display='flex';
  });
}

function _syncQuizImgToGlobal(q){
  if(!lastChId||!QUIZ[lastChId]) return;
  const i=QUIZ[lastChId].indexOf(q);
  if(i!==-1) QUIZ[lastChId][i].xrayImg=q.xrayImg;
}

// ══════════════════════════════════════════════
// DEV — INLINE TEXT EDITING
// ══════════════════════════════════════════════
let _inlineEditActive=false;
let _inlineEditables=[];

function toggleInlineEdit(btn){
  _inlineEditActive=!_inlineEditActive;
  btn.classList.toggle('on',_inlineEditActive);
  const hint=document.getElementById('inlineEditHint');
  if(hint) hint.style.display=_inlineEditActive?'block':'none';
  if(_inlineEditActive){
    enableInlineEditing();
  } else {
    disableInlineEditing();
  }
}

function enableInlineEditing(){
  // Make key text elements editable
  const selectors=[
    '.hero h1','.hero p','.htitle','.ptitle',
    '.pos-title','.desc-text','.tech-val','.tech-label',
    '.q-text','.ch-name','.ch-sub','.score-title','.score-sub',
    '.settings-row-label','.settings-group-title',
    '.sb-user-name','.sb-user-role'
  ];
  selectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      if(el.dataset.inlineEditable) return;
      el.dataset.inlineEditable='1';
      el.dataset.origContent=el.textContent;
      el.style.cursor='text';
      el.style.outline='none';
      el.addEventListener('click',_inlineEditHandler);
      _inlineEditables.push(el);
    });
  });
  // Add visual cue
  const style=document.getElementById('inlineEditStyle')||document.createElement('style');
  style.id='inlineEditStyle';
  style.textContent='[data-inline-editable="1"]:hover{outline:2px dashed var(--amber)!important;outline-offset:2px;}';
  document.head.appendChild(style);
}

function _inlineEditHandler(e){
  if(!_inlineEditActive || userRole!=='developer') return;
  const el=e.currentTarget;
  if(el.contentEditable==='true') return;
  el.contentEditable='true';
  el.focus();
  // Select all text
  const range=document.createRange();
  range.selectNodeContents(el);
  const sel=window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  el.style.outline='2px solid var(--accent)';
  el.style.outlineOffset='2px';
  el.style.background='var(--accent-bg)';
  const done=()=>{
    el.contentEditable='false';
    el.style.outline='';
    el.style.outlineOffset='';
    el.style.background='';
  };
  el.addEventListener('blur',done,{once:true});
  el.addEventListener('keydown',ev=>{
    if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();el.blur();}
    if(ev.key==='Escape'){el.textContent=el.dataset.origContent||el.textContent;el.blur();}
  },{once:true});
}

function disableInlineEditing(){
  _inlineEditables.forEach(el=>{
    el.removeEventListener('click',_inlineEditHandler);
    el.contentEditable='false';
    el.style.cursor='';
    delete el.dataset.inlineEditable;
  });
  _inlineEditables=[];
  const style=document.getElementById('inlineEditStyle');
  if(style) style.remove();
}

// ══════════════════════════════════════════════
// DEV — AUTO-SAVE (localStorage)
// ══════════════════════════════════════════════
const _SAVE_KEY='bontrager_dev_save_v4';
function buildDevManager(){
  if(userRole!=='developer'){
    document.getElementById('devManagerContent').innerHTML='<div style="text-align:center;padding:40px;color:var(--text3)">Developer mode required</div>';
    return;
  }
  const extra=_loadExtraButtons();
  const c=document.getElementById('devManagerContent');
  c.innerHTML=`
    <!-- EMBED & EXPORT PANEL -->
    <div class="dev-panel" style="border-color:#a78bfa">
      <div class="dev-panel-header" style="background:linear-gradient(90deg,#3b0764,#1e1b4b)">
        <div class="dev-panel-title" style="color:#c4b5fd">💾 Embed Images & Export — تصدير مع تضمين الصور</div>
      </div>
      <div class="dev-panel-body">
        <p style="font-size:12.5px;color:var(--text2);margin-bottom:12px;line-height:1.7">
          يقوم هذا الزر بتوليد نسخة <strong>HTML مستقلة كاملة</strong> تحتوي جميع الصور التي أضفتها
          مضمّنة داخل الملف كـ Base64 — بحيث يرى أي شخص الصور بدون إنترنت وبدون أي إعداد.
        </p>
        <div id="embedExportStatus" style="display:none;padding:10px 13px;border-radius:var(--radius-sm);margin-bottom:10px;font-size:12.5px;font-weight:600"></div>
        <button onclick="embedAndExport()" style="width:100%;padding:13px;border-radius:var(--radius-sm);border:none;background:linear-gradient(90deg,#7c3aed,#2563eb);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);display:flex;align-items:center;justify-content:center;gap:8px">
          💾 Embed All Images & Export HTML
        </button>
        <div style="font-size:11px;color:var(--text3);text-align:center;margin-top:8px;line-height:1.6">
          يشمل: جميع الصور · جميع التعديلات · جميع البيانات المضافة · لا يتطلب إنترنت
        </div>
      </div>
    </div>

    <!-- BUTTON MANAGER -->
    <div class="dev-panel">
      <div class="dev-panel-header">
        <div class="dev-panel-title">🔘 Button Manager — إدارة الأزرار</div>
      </div>
      <div class="dev-panel-body">
        <p style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.6">أضف أزراراً مخصصة تظهر في الصفحة الرئيسية أو الشريط الجانبي. يمكنك تحديد الاسم والأيقونة واللون والصفحة المستهدفة.</p>
        <div id="btnMgrList"></div>
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em">➕ Add New Button</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <input id="btnNewLabel" placeholder="Button label (e.g. Ribs Guide)" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none;width:100%">
            <div style="display:flex;gap:8px">
              <input id="btnNewIcon" placeholder="Icon emoji 🦴" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none;flex:1">
              <input id="btnNewColor" type="color" value="#2563eb" title="Button color" style="width:42px;height:38px;border-radius:var(--radius-sm);border:1px solid var(--border2);padding:2px;cursor:pointer;background:var(--bg2)">
            </div>
            <select id="btnNewTarget" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none;width:100%">
              <option value="learn-chapters">📚 Learn — Chapters</option>
              <option value="quiz-chapters">📝 Quiz — Chapters</option>
              <option value="ai">🤖 Ask AI</option>
              <option value="settings">⚙️ Settings</option>
              <option value="home">🏠 Home</option>
              <option value="dev-manager">🛠 Developer Manager</option>
            </select>
            <div style="display:flex;gap:8px">
              <select id="btnNewPos" style="padding:8px 10px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:13px;font-family:var(--font);outline:none;flex:1">
                <option value="home">Show on Home page</option>
                <option value="sidebar">Show in Sidebar</option>
                <option value="both">Show in Both</option>
              </select>
            </div>
            <button onclick="devAddButton()" style="padding:10px;border-radius:var(--radius-sm);border:none;background:var(--accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font);width:100%">➕ Add Button</button>
          </div>
        </div>
      </div>
    </div>

    <!-- INLINE EDIT TOOL -->
    <div class="dev-panel">
      <div class="dev-panel-header"><div class="dev-panel-title">✏️ Inline Text Editor</div></div>
      <div class="dev-panel-body">
        <p style="font-size:12px;color:var(--text2);margin-bottom:10px;line-height:1.6">فعّل وضع التحرير المباشر للنقر على أي نص في التطبيق وتعديله في مكانه.</p>
        <button id="inlineEditToggle" onclick="toggleInlineEdit(this)" style="width:100%;padding:10px;border-radius:var(--radius-sm);border:1.5px solid var(--amber);background:none;color:var(--amber);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">🖊 Enable Inline Editing</button>
        <div id="inlineEditHint" style="display:none;margin-top:8px;font-size:11px;color:var(--amber);padding:8px 10px;background:var(--amber-bg);border-radius:var(--radius-sm)">📌 Click any text element to edit it directly. Press Enter or click away to save. Press Escape to cancel.</div>
      </div>
    </div>

    <!-- BUTTON PROPERTIES EDITOR -->
    <div class="dev-panel" id="btnPropsPanel" style="display:none">
      <div class="dev-panel-header"><div class="dev-panel-title">⚙️ Button Properties</div></div>
      <div class="dev-panel-body" id="btnPropsBody"></div>
    </div>

    <!-- CHAPTER BUTTONS REORDER -->
    <div class="dev-panel">
      <div class="dev-panel-header"><div class="dev-panel-title">📑 Chapter Order — ترتيب الفصول</div></div>
      <div class="dev-panel-body">
        <p style="font-size:12px;color:var(--text2);margin-bottom:10px;line-height:1.6">احذف الفصول أو عدّل ترتيبها من هنا.</p>
        ${Object.entries(BOOK).map(([id,ch])=>`
          <div class="dev-item-row">
            <div class="dev-item-name">${ch.icon||''} ${ch.name}</div>
            <button class="dev-small-btn blue" onclick="devEditChapterMeta('${id}')">Edit</button>
            <button class="dev-small-btn red" onclick="deleteChapter('${id}')">Delete</button>
          </div>`).join('')}
      </div>
    </div>

    <!-- QUIZ BANK OVERVIEW -->
    <div class="dev-panel">
      <div class="dev-panel-header"><div class="dev-panel-title">❓ Quiz Bank — بنك الأسئلة</div></div>
      <div class="dev-panel-body">
        ${Object.entries(QUIZ).map(([key,qs])=>`
          <div class="dev-item-row">
            <div class="dev-item-name" style="font-size:12px">${key}</div>
            <div style="font-size:11px;color:var(--text3);flex:1;text-align:right">${qs.length} Qs</div>
            <button class="dev-small-btn blue" onclick="startQuiz('${key}');navTo('quiz')">Preview</button>
          </div>`).join('')}
      </div>
    </div>

    <!-- DATA MANAGEMENT -->
    <div class="dev-panel">
      <div class="dev-panel-header"><div class="dev-panel-title">💾 Data — البيانات</div></div>
      <div class="dev-panel-body" style="display:flex;flex-direction:column;gap:8px">
        <button onclick="devSaveData();_showToast('✅ تم الحفظ')" style="padding:10px;border-radius:var(--radius-sm);border:none;background:var(--green);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">💾 Save All Data Now</button>
        <button onclick="devExportData()" style="padding:10px;border-radius:var(--radius-sm);border:1.5px solid var(--accent);background:none;color:var(--accent);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">📤 Export JSON</button>
        <button onclick="devImportData()" style="padding:10px;border-radius:var(--radius-sm);border:1.5px solid var(--text3);background:none;color:var(--text2);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font)">📥 Import JSON</button>
        <button onclick="devExportHTMLWithImages()" style="padding:10px;border-radius:var(--radius-sm);border:1.5px solid var(--green);background:none;color:var(--green);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">🌐 Export HTML+Images</button>
        <input type="file" id="devImportFile" accept=".json" style="display:none" onchange="handleDevImport(event)">
      </div>
    </div>
  `;
  _renderBtnMgrList();
}

function _renderBtnMgrList(){
  const extra=_loadExtraButtons();
  const list=document.getElementById('btnMgrList');
  if(!list) return;
  if(!extra.length){
    list.innerHTML='<div style="font-size:12px;color:var(--text3);text-align:center;padding:12px">No custom buttons yet</div>';
    return;
  }
  list.innerHTML=extra.map((btn,i)=>`
    <div class="dev-item-row" style="flex-wrap:wrap;gap:6px">
      <div class="dev-item-name" style="display:flex;align-items:center;gap:6px">
        <span style="font-size:18px">${btn.icon||'🔘'}</span>
        <div>
          <div style="font-size:13px;font-weight:600">${esc(btn.label)}</div>
          <div style="font-size:10px;color:var(--text3)">→ ${btn.target} · ${btn.position}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <div style="width:16px;height:16px;border-radius:50%;background:${btn.color||'var(--accent)'};border:1px solid var(--border)"></div>
        <button class="dev-small-btn blue" onclick="devEditButtonProps(${i})">Edit</button>
        <button class="dev-small-btn red" onclick="devDeleteButton(${i})">Delete</button>
      </div>
    </div>`).join('');
}

function devAddButton(){
  const label=(document.getElementById('btnNewLabel').value||'').trim();
  const icon=(document.getElementById('btnNewIcon').value||'').trim()||'🔘';
  const color=document.getElementById('btnNewColor').value||'#2563eb';
  const target=document.getElementById('btnNewTarget').value||'home';
  const position=document.getElementById('btnNewPos').value||'home';
  if(!label){_showToast('⚠ أدخل اسم الزر','var(--amber)');return;}
  const extra=_loadExtraButtons();
  extra.push({label,icon,color,target,position});
  _saveExtraButtons(extra);
  document.getElementById('btnNewLabel').value='';
  document.getElementById('btnNewIcon').value='';
  _renderBtnMgrList();
  _applyExtraButtons();
  _showToast('✅ تمت إضافة الزر');
}

function devDeleteButton(i){
  const extra=_loadExtraButtons();
  showConfirm('Delete Button',`Delete "${extra[i].label}"?`,()=>{
    extra.splice(i,1);
    _saveExtraButtons(extra);
    _renderBtnMgrList();
    _applyExtraButtons();
    buildDevManager();
  });
}

function devEditButtonProps(i){
  const extra=_loadExtraButtons();
  const btn=extra[i];
  const panel=document.getElementById('btnPropsPanel');
  const body=document.getElementById('btnPropsBody');
  if(!panel||!body) return;
  panel.style.display='block';
  body.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="edit-field"><label>Label</label><input id="bpe-label" value="${esc(btn.label)}"></div>
      <div class="edit-field"><label>Icon</label><input id="bpe-icon" value="${esc(btn.icon||'')}"></div>
      <div class="edit-field"><label>Color</label><input type="color" id="bpe-color" value="${btn.color||'#2563eb'}" style="width:60px;height:36px;border-radius:var(--radius-sm);border:1px solid var(--border2);cursor:pointer;padding:2px"></div>
      <div class="edit-field"><label>Target Page</label>
        <select id="bpe-target">
          ${['learn-chapters','quiz-chapters','ai','settings','home','dev-manager'].map(t=>`<option value="${t}" ${btn.target===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="edit-field"><label>Position</label>
        <select id="bpe-pos">
          ${['home','sidebar','both'].map(p=>`<option value="${p}" ${btn.position===p?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="devSaveButtonProps(${i})" style="flex:1;padding:10px;border-radius:var(--radius-sm);border:none;background:var(--accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">💾 Save</button>
        <button onclick="document.getElementById('btnPropsPanel').style.display='none'" style="padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border2);background:none;color:var(--text2);font-size:13px;cursor:pointer;font-family:var(--font)">Cancel</button>
      </div>
    </div>`;
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function devSaveButtonProps(i){
  const extra=_loadExtraButtons();
  extra[i]={
    label:(document.getElementById('bpe-label').value||'').trim()||extra[i].label,
    icon:(document.getElementById('bpe-icon').value||'').trim()||'🔘',
    color:document.getElementById('bpe-color').value||'#2563eb',
    target:document.getElementById('bpe-target').value||'home',
    position:document.getElementById('bpe-pos').value||'home'
  };
  _saveExtraButtons(extra);
  _renderBtnMgrList();
  _applyExtraButtons();
  document.getElementById('btnPropsPanel').style.display='none';
  _showToast('✅ تم تحديث الزر');
}

function _applyExtraButtons(){
  // Remove existing extra buttons
  document.querySelectorAll('.extra-dev-btn').forEach(el=>el.remove());
  const extra=_loadExtraButtons();
  // Home page extra buttons
  const homeTarget=document.getElementById('homeExtraButtons');
  if(!homeTarget){
    // Create container after stats row on home page if not exists
    const statsRow=document.querySelector('.stats-row');
    if(statsRow){
      const div=document.createElement('div');
      div.id='homeExtraButtons';
      div.style.cssText='margin-top:12px;display:flex;flex-direction:column;gap:8px';
      statsRow.parentNode.insertBefore(div,statsRow.nextSibling);
    }
  }
  const homeDiv=document.getElementById('homeExtraButtons');
  // Sidebar extra
  const sbSection=document.querySelector('.sb-footer');

  extra.forEach((btn,i)=>{
    const showHome=btn.position==='home'||btn.position==='both';
    const showSidebar=btn.position==='sidebar'||btn.position==='both';
    if(showHome && homeDiv){
      const b=document.createElement('button');
      b.className='extra-dev-btn';
      b.style.cssText=`width:100%;padding:12px 16px;border-radius:var(--radius-sm);border:2px solid ${btn.color||'var(--accent)'};background:none;color:${btn.color||'var(--accent)'};font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:10px;transition:all .15s`;
      b.innerHTML=`<span style="font-size:20px">${btn.icon||'🔘'}</span>${esc(btn.label)}`;
      b.onclick=()=>navTo(btn.target);
      b.onmouseover=()=>{b.style.background=btn.color||'var(--accent)';b.style.color='#fff';};
      b.onmouseout=()=>{b.style.background='none';b.style.color=btn.color||'var(--accent)';};
      homeDiv.appendChild(b);
    }
    if(showSidebar && sbSection){
      const b=document.createElement('button');
      b.className='nav-item extra-dev-btn';
      b.style.cssText=`color:${btn.color||'var(--accent)'}`;
      b.innerHTML=`<span style="font-size:16px">${btn.icon||'🔘'}</span>${esc(btn.label)}`;
      b.onclick=()=>{navTo(btn.target);closeSidebar();};
      sbSection.parentNode.insertBefore(b,sbSection);
    }
  });
}

function devEditChapterMeta(chId){
  const ch=BOOK[chId];
  if(!ch) return;
  const newName=prompt('Chapter name:', ch.name);
  if(newName===null) return;
  const newIcon=prompt('Chapter icon:', ch.icon||'📋');
  if(newIcon===null) return;
  ch.name=newName.trim()||ch.name;
  ch.icon=newIcon.trim()||ch.icon;
  buildChapters();
  buildDevManager();
  _showToast('✅ تم تحديث الفصل');
}

function devExportData(){
  const data=JSON.stringify({BOOK,QUIZ,extra:_loadExtraButtons(),ts:new Date().toISOString()},null,2);
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='bontrager_data_'+new Date().toISOString().split('T')[0]+'.json';
  a.click();
  URL.revokeObjectURL(url);
  _showToast('📤 تم التصدير');
}

function devImportData(){
  document.getElementById('devImportFile').click();
}

function handleDevImport(e){
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      showConfirm('Import Data','This will replace all current BOOK and QUIZ data. Continue?',()=>{
        if(d.BOOK){Object.keys(BOOK).forEach(k=>delete BOOK[k]);Object.assign(BOOK,d.BOOK);}
        if(d.QUIZ){Object.keys(QUIZ).forEach(k=>delete QUIZ[k]);Object.assign(QUIZ,d.QUIZ);}
        if(d.extra) _saveExtraButtons(d.extra);
        buildChapters();
        buildDevManager();
        _showToast('✅ تم الاستيراد بنجاح');
      });
    }catch(err){alert('Invalid JSON file: '+err.message);}
  };
  reader.readAsText(file);
  e.target.value='';
}


buildChapters();
_loadBestScores();
updateStats();
// ── Restore appearance settings on startup ──
_loadSavedAppearance();
// Restore dark mode from its own key (always applied, even for students)
(function(){
  try{
    const dark=localStorage.getItem('bontrager_dark_v1');
    const isDark = dark==='1' || dark===null;
    if(isDark){
      document.body.classList.add('dark');
      const t=document.getElementById('darkToggle');
      if(t){ t.classList.add('on'); t.setAttribute('aria-pressed','true'); }
      const colorBtn=document.getElementById('colorModeBtn');
      if(colorBtn) colorBtn.innerHTML = '<span style="font-size:18px;">🌙</span>';
    } else {
      const colorBtn=document.getElementById('colorModeBtn');
      if(colorBtn) colorBtn.innerHTML = '<span style="font-size:18px;">☀️</span>';
    }
    const large=localStorage.getItem('bontrager_large_v1');
    if(large==='1'){
      document.documentElement.style.setProperty('--base-fs','17px');
      document.body.style.fontSize='17px';
      const t=document.getElementById('largeToggle');
      if(t){ t.classList.add('on'); t.setAttribute('aria-pressed','true'); }
    }
    const highContrast=localStorage.getItem('bontrager_highcontrast_v1');
    if(highContrast==='1'){
      document.body.classList.add('high-contrast');
      const t=document.getElementById('highContrastToggle');
      if(t){ t.classList.add('on'); t.setAttribute('aria-pressed','true'); }
    }
  }catch(e){}
})();
// Load saved user profile (name) on startup
_loadUserProfile();
// Update header title if we loaded a name
(function(){
  const sbn=document.getElementById('sbName');
  if(sbn) sbn.textContent=userName;
  const sba=document.getElementById('sbAvatar');
  if(sba){ sba.textContent=userName.charAt(0).toUpperCase()||'S'; }
  // Update hero badge
  const hb=document.getElementById('heroBadge');
  if(hb) hb.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg> Student Mode';
  // Update hero subtitle with personalized greeting if name is saved
  const hs=document.getElementById('heroSubtitle');
  if(hs && userName && userName!=='Student'){
    hs.textContent='Welcome back, '+userName+' · 10th Edition';
  }
})();
// Init token UI
setTimeout(_refreshTokenUI,100);
// Apply any saved extra buttons
setTimeout(_applyExtraButtons,200);
// Offer to restore saved dev data
(function(){
  var saved=_loadSaved();
  if(!saved) return;
  var d=new Date(saved.ts);
  var label=d.toLocaleString();
  setTimeout(()=>{
    if(confirm('يوجد تعديلات محفوظة من '+label+'\nهل تريد استعادتها؟')){
      Object.keys(BOOK).forEach(k=>delete BOOK[k]);Object.assign(BOOK,saved.BOOK);
      Object.keys(QUIZ).forEach(k=>delete QUIZ[k]);Object.assign(QUIZ,saved.QUIZ);
      buildChapters();updateStats();setTimeout(_applyExtraButtons,100);_showToast('تم استعادة التعديلات');
    }
  },600);
})();
// First-run: show profile modal if name not yet set
(function(){
  try{
    const raw=localStorage.getItem(_USER_KEY);
    if(!raw){
      // New user — show profile modal after a short delay
      setTimeout(()=>openProfileModal(),800);
    }
  }catch(e){}
})();

// ══════════════════════════════════════════════
// V19 FEATURES
// ══════════════════════════════════════════════

// ── 1. STUDY MODE ──────────────────────────────
const _STUDY_KEY='bontrager_study_mode_v1';

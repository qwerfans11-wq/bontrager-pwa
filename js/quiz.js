// js/quiz.js — Quiz flow, rendering, scoring, and editing functions

// ══════════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════════
let _pendingQuizId=null;
let _selectedQCount=null;

const _QUIZ_STOP_WORDS=new Set([
  'the','a','an','is','are','what','which','for','of','in','on','to','and','or','with','from','this','that','these','those',
  'what','when','where','why','how','during','using','used','into','your','you','does','must','should','could','would','can'
]);

function _quizNorm(value){
  return String(value||'')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function _quizTokens(value){
  return _quizNorm(value)
    .split(' ')
    .filter(t=>t.length>2 && !_QUIZ_STOP_WORDS.has(t));
}

function _quizResolveBankKey(qKey){
  if(BOOK[qKey]) return {chId:qKey, scId:null};
  for(const [chId,ch] of Object.entries(BOOK)){
    if(!ch || !ch.subchapters) continue;
    if(!qKey.startsWith(chId+'_')) continue;
    const scId=qKey.slice(chId.length+1);
    if(scId && ch.subchapters[scId]) return {chId, scId};
  }
  return {chId:qKey, scId:null};
}

function _quizLabelForKey(qKey){
  const resolved=_quizResolveBankKey(qKey);
  const ch=BOOK[resolved.chId];
  if(!ch) return 'General Quiz';
  if(!resolved.scId) return ch.name || 'General Quiz';
  const sc=ch.subchapters && ch.subchapters[resolved.scId];
  return sc ? `${ch.name} - ${sc.name}` : (ch.name || 'General Quiz');
}

function _quizGetPositionsForKey(qKey){
  const resolved=_quizResolveBankKey(qKey);
  const ch=BOOK[resolved.chId];
  if(!ch) return [];

  if(resolved.scId){
    const sc=ch.subchapters && ch.subchapters[resolved.scId];
    return (sc && Array.isArray(sc.positions)) ? sc.positions : [];
  }

  const out=[];
  if(Array.isArray(ch.positions)) out.push(...ch.positions);
  if(ch.subchapters){
    Object.values(ch.subchapters).forEach(sc=>{
      if(Array.isArray(sc.positions)) out.push(...sc.positions);
    });
  }
  return out;
}

function _quizPickImageFromBundle(bundle){
  if(!bundle) return '';
  if(Array.isArray(bundle.xrays) && bundle.xrays.length) return bundle.xrays[0];
  if(Array.isArray(bundle.positions) && bundle.positions.length) return bundle.positions[0];
  return '';
}

function _resolveQuizImageSrc(imageRef){
  const raw=String(imageRef||'').trim();
  if(!raw) return '';
  if(_looksLikeDataUri(raw) || /^https?:\/\//i.test(raw) || /^blob:/i.test(raw)) return raw;
  return _resolveInlineImageSrc(raw, 'xray');
}

function _quizFindPositionForQuestion(q, qKey){
  const positions=_quizGetPositionsForKey(qKey);
  if(!positions.length) return null;

  const sourceText=[q.questionText||'', q.correct||'', ...(Array.isArray(q.options)?q.options:[])].join(' ');
  const sourceNorm=_quizNorm(sourceText);
  const correctNorm=_quizNorm(q.correct||'');
  const sourceTokens=_quizTokens(sourceText);
  const sourceSet=new Set(sourceTokens);

  let best=null;
  let bestScore=0;
  positions.forEach(pos=>{
    const name=String(pos.name||'');
    const nameNorm=_quizNorm(name);
    if(!nameNorm) return;

    let score=0;
    if(correctNorm && (correctNorm===nameNorm || correctNorm.includes(nameNorm) || nameNorm.includes(correctNorm))) score+=85;
    if(sourceNorm.includes(nameNorm)) score+=70;

    const nameTokens=_quizTokens(nameNorm);
    let shared=0;
    nameTokens.forEach(t=>{ if(sourceSet.has(t)) shared++; });
    score+=shared*10;
    if(shared>=2) score+=12;

    const desc=pos.info ? _quizNorm(pos.info.desc||'') : '';
    if(desc){
      sourceTokens.forEach(t=>{ if(t.length>3 && desc.includes(t)) score+=1; });
    }

    if(score>bestScore){
      bestScore=score;
      best=pos;
    }
  });

  return bestScore>=18 ? best : null;
}

function _quizAutoImageForQuestion(q, qKey, matchedPos){
  if(q.xrayImg) return q.xrayImg;

  const posRef=matchedPos || _quizFindPositionForQuestion(q, qKey);
  if(posRef){
    const matchedBundle=_getImagesForPos(posRef);
    const matchedImg=_quizPickImageFromBundle(matchedBundle);
    if(matchedImg) return matchedImg;
  }

  if(q.correct){
    const byCorrect=_quizPickImageFromBundle(_getImagesForPos(q.correct));
    if(byCorrect) return byCorrect;
  }

  const qText=String(q.questionText||'');
  const quoted=qText.match(/"([^"]{4,80})"|\*\*([^*]{4,80})\*\*/);
  if(quoted){
    const term=(quoted[1]||quoted[2]||'').trim();
    if(term){
      const byQuoted=_quizPickImageFromBundle(_getImagesForPos(term));
      if(byQuoted) return byQuoted;
    }
  }

  return '';
}

function _quizCleanQuestionText(text){
  const raw=String(text||'Which projection is shown in this X-ray image?')
    .replace(/\*\*(.*?)\*\*/g,'$1')
    .replace(/\s+/g,' ')
    .trim();
  return raw || 'Which projection is shown in this X-ray image?';
}

function _quizEnsureOptions(optionsIn, correctIn, fallbackPool){
  let correct=String(correctIn||'').trim();
  const options=[];

  (Array.isArray(optionsIn)?optionsIn:[]).forEach(opt=>{
    const clean=String(opt||'').trim();
    if(!clean) return;
    if(!options.some(existing=>_quizNorm(existing)===_quizNorm(clean))) options.push(clean);
  });

  if(correct){
    const foundIdx=options.findIndex(opt=>_quizNorm(opt)===_quizNorm(correct));
    if(foundIdx!==-1) correct=options[foundIdx];
    else options.unshift(correct);
  } else if(options.length){
    correct=options[0];
  }

  (Array.isArray(fallbackPool)?fallbackPool:[]).forEach(candidate=>{
    if(options.length>=4) return;
    const clean=String(candidate||'').trim();
    if(!clean) return;
    if(correct && _quizNorm(clean)===_quizNorm(correct)) return;
    if(options.some(opt=>_quizNorm(opt)===_quizNorm(clean))) return;
    options.push(clean);
  });

  while(options.length<2){
    const filler=options.length===0 ? 'Not specified' : 'None of the above';
    if(!options.some(opt=>_quizNorm(opt)===_quizNorm(filler))) options.push(filler);
    else break;
  }

  let finalOptions=options.slice(0,6);
  if(correct && !finalOptions.some(opt=>_quizNorm(opt)===_quizNorm(correct))){
    if(finalOptions.length>=6) finalOptions[finalOptions.length-1]=correct;
    else finalOptions.push(correct);
  }

  if(!correct && finalOptions.length) correct=finalOptions[0];
  return {options:finalOptions, correct};
}

function _quizBuildLearningTip(q, pos){
  const intent=_quizNorm(q.questionText||'');
  const info=(pos && pos.info) ? pos.info : {};
  let tip='';

  if(/\bcr\b|central ray|angle/.test(intent) && info.cr){
    tip=`CR: ${info.cr}`;
  } else if(/kvp|k v p|kilovolt/.test(intent) && info.kv){
    tip=`kVp: ${info.kv}`;
  } else if(/resp|breath|inspir|expir/.test(intent) && info.resp){
    tip=`Respiration: ${info.resp}`;
  } else if(/sid|source image/.test(intent) && info.sid){
    tip=`SID: ${info.sid}`;
  } else if(pos && pos.name){
    const mini=[];
    if(info.cr) mini.push(`CR ${info.cr}`);
    if(info.kv) mini.push(`kVp ${info.kv}`);
    if(info.resp) mini.push(`Resp ${info.resp}`);
    tip = mini.length ? `${pos.name}: ${mini.join(' | ')}` : `Review this position in Section 1: ${pos.name}`;
  }

  if(tip.length>220) return tip.slice(0,217)+'...';
  return tip;
}

function _prepareQuizQuestion(rawQuestion, qKey, sourceIdx){
  const q={...(rawQuestion||{})};
  q.questionText=_quizCleanQuestionText(q.questionText);

  const fallbackPool=_quizGetPositionsForKey(qKey).map(p=>p.name).filter(Boolean);
  const ensured=_quizEnsureOptions(q.options, q.correct, fallbackPool);
  q.options=ensured.options;
  q.correct=ensured.correct;

  const matchedPos=_quizFindPositionForQuestion(q, qKey);
  if(!q.xrayImg){
    q.xrayImg=_quizAutoImageForQuestion(q, qKey, matchedPos);
  }

  q._resolvedXray=_resolveQuizImageSrc(q.xrayImg);
  q._topicLabel=_quizLabelForKey(qKey);
  q._matchedPosition=matchedPos ? matchedPos.name : '';
  q._learningTip=_quizBuildLearningTip(q, matchedPos);
  q._sourceKey=qKey;
  q._sourceIdx=sourceIdx;
  q._recorded=false;
  return q;
}

function _prepareQuizBankForKey(qKey){
  const bank=QUIZ[qKey];
  if(!Array.isArray(bank) || !bank.length) return;

  for(let i=0;i<bank.length;i++){
    const prepared=_prepareQuizQuestion(bank[i], qKey, i);
    bank[i].questionText=prepared.questionText;
    bank[i].options=[...prepared.options];
    bank[i].correct=prepared.correct;
    if(!bank[i].xrayImg && prepared.xrayImg) bank[i].xrayImg=prepared.xrayImg;
  }
}

function _refreshQuizBankQuality(){
  Object.keys(QUIZ).forEach(_prepareQuizBankForKey);
}

function _quizCountWithImages(keys){
  let withImages=0;
  let total=0;
  keys.forEach(key=>{
    const list=Array.isArray(QUIZ[key]) ? QUIZ[key] : [];
    total+=list.length;
    list.forEach(q=>{
      if(String(q.xrayImg||'').trim()) withImages++;
    });
  });
  return {withImages,total};
}

function _renderQuizQuestionImage(q){
  const xi=document.getElementById('xrayImg');
  const xph=document.getElementById('xrayPh');
  const label=document.getElementById('qImageLabel');
  const imageChip=document.getElementById('qImageChip');
  if(!xi || !xph) return;

  const src=q._resolvedXray || _resolveQuizImageSrc(q.xrayImg);
  if(src){
    xi.src=src;
    xi.style.display='block';
    xph.style.display='none';
    if(label){
      label.style.display='block';
      label.textContent=q._matchedPosition ? q._matchedPosition : 'Radiographic reference image';
    }
    if(imageChip){
      imageChip.textContent='Image: ready';
      imageChip.classList.add('ready');
    }
  } else {
    xi.style.display='none';
    xi.removeAttribute('src');
    xph.style.display='flex';
    if(label){
      label.style.display='none';
      label.textContent='';
    }
    if(imageChip){
      imageChip.textContent='Image: none';
      imageChip.classList.remove('ready');
    }
  }
}

function _setQuizFeedback(mode, message, note){
  const fb=document.getElementById('feedbackDiv');
  if(!fb) return;
  fb.textContent=message;
  fb.className=`feedback ${mode} show`;

  const helper=document.getElementById('qHelper');
  if(helper){
    if(note){
      helper.textContent=note;
      helper.classList.add('show');
    } else {
      helper.textContent='';
      helper.classList.remove('show');
    }
  }
}

function startQuiz(chId){
  _prepareQuizBankForKey(chId);
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
    chips.innerHTML=presets.map(n=>`<button class="qc-chip${n==='All'?'':''}" data-val="${n}">${n}</button>`).join('');
    chips.querySelectorAll('.qc-chip').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const raw=btn.dataset.val;
        _qcSelect(btn, raw==='All' ? 'All' : parseInt(raw,10));
      });
    });
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
  _prepareQuizBankForKey(chId);
  const qs=QUIZ[chId];
  lastChId=chId;
  let data=qs.map((q,idx)=>_prepareQuizQuestion(q,chId,idx));
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
  document.getElementById('qProgress').style.width=Math.round((quizIdx+1)/total*100)+'%';
  document.getElementById('qCounter').textContent=`Question ${quizIdx+1} / ${total}`;
  document.getElementById('qScore').textContent=`Score: ${quizScore}`;

  const topicChip=document.getElementById('qTopicChip');
  if(topicChip) topicChip.textContent=q._topicLabel || _quizLabelForKey(lastChId);

  _renderQuizQuestionImage(q);
  document.getElementById('qText').textContent=q.questionText||'Which projection is shown in this X-ray image?';

  const helper=document.getElementById('qHelper');
  if(helper){
    helper.textContent='';
    helper.classList.remove('show');
  }

  wrongCount=0;
  const grid=document.getElementById('optsGrid');
  grid.innerHTML='';
  const opts=[...q.options].sort(()=>Math.random()-.5);
  opts.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='opt';
    btn.dataset.option=opt;
    btn.setAttribute('aria-label', `Option ${LETTERS[i]}: ${opt}`);
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
  const allBtns=document.querySelectorAll('.opt');
  const sameOption=(a,b)=>_quizNorm(a)===_quizNorm(b);

  if(chosen===q.correct){
    btn.classList.add('correct');
    allBtns.forEach(b=>b.disabled=true);
    quizScore++;
    document.getElementById('qScore').textContent=`Score: ${quizScore}`;
    _setQuizFeedback('ok','✓ Correct!', q._learningTip || '');
    document.getElementById('nextBtn').className='next-btn show';
  } else {
    btn.classList.add('wrong');
    wrongCount++;
    const showHint=document.getElementById('hintToggle').classList.contains('on');
    if(showHint&&wrongCount>=2){
      allBtns.forEach(b=>{
        b.disabled=true;
        if(sameOption(b.dataset.option||'', q.correct)) b.classList.add('correct');
      });
      // record wrong answer
      if(!q._recorded){
        q._recorded=true;
        wrongAnswers.push({
          q:q.questionText||'Question',
          given:chosen,
          correct:q.correct,
          topic:q._topicLabel||'',
          position:q._matchedPosition||''
        });
      }
      _setQuizFeedback('bad',`✗ The correct answer is: ${q.correct}`, q._learningTip || '');
      document.getElementById('nextBtn').className='next-btn show';
    } else {
      _setQuizFeedback('bad','✗ Incorrect — try again!','');
      setTimeout(()=>{
        btn.classList.remove('wrong');
        btn.disabled=false;
        const fb=document.getElementById('feedbackDiv');
        if(fb) fb.className='feedback';
      },950);
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
  const withImg=quizData.filter(q=>String(q.xrayImg||'').trim()).length;
  document.getElementById('scoreNum').textContent=pct+'%';
  document.getElementById('scoreTitle').textContent=pct>=85?'Excellent!':pct>=65?'Good job!':'Keep studying';
  document.getElementById('scoreSub').textContent=`${quizScore} correct out of ${quizData.length} questions · ${withImg}/${quizData.length} with images`;
  if(!bestScores[lastChId]||pct>bestScores[lastChId]){
    bestScores[lastChId]=pct;
    _saveBestScores();
    _updateHomeBest();
  }
  // Build wrong answers review
  const reviewDiv=document.getElementById('scoreReview');
  if(reviewDiv){
    if(wrongAnswers.length>0){
      // Chapter-linked study button — chapterForLink is a safe chapter key (no user input)
      const chapterForLink = lastChId ? lastChId.split('_')[0] : null;
      const chObj = chapterForLink ? BOOK[chapterForLink] : null;
      const studyBtnHtml = chObj ? `
        <button class="score-study-btn" data-score-chap="${chapterForLink}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          Study the ${esc(chObj.name)} chapter
        </button>` : '';

      let html=studyBtnHtml;
      html+=`<div style="margin-top:16px;text-align:left">
        <div style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:10px">❌ Wrong answers (${wrongAnswers.length})</div>`;
      wrongAnswers.forEach((w,i)=>{
        // Use data attributes instead of inline onclick to avoid XSS
        const posLink = w.position ? `<button class="score-pos-link" data-score-pos="${esc(w.position)}" style="margin-top:6px;font-size:11px;padding:4px 10px;border:1px solid var(--accent);border-radius:20px;background:var(--accent-bg);color:var(--accent);cursor:pointer;font-family:var(--font);font-weight:600">📖 Open Position ›</button>` : '';
        html+=`<div style="background:var(--bg);border:1px solid var(--red-border);border-radius:var(--radius-sm);padding:12px;margin-bottom:10px">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;line-height:1.5">${i+1}. ${esc(w.q)}</div>
          <div style="font-size:11px;color:var(--red);margin-bottom:4px">✗ Your answer: <strong>${esc(w.given)}</strong></div>
          <div style="font-size:11px;color:var(--green)">✓ Correct answer: <strong>${esc(w.correct)}</strong></div>
          ${w.position?`<div style="font-size:10.5px;color:var(--text3);margin-top:4px">Focus position: ${esc(w.position)}</div>`:''}
          ${posLink}
        </div>`;
      });

      const focusMap={};
      wrongAnswers.forEach(w=>{
        const key=w.position||w.topic||'General review';
        focusMap[key]=(focusMap[key]||0)+1;
      });
      const focusItems=Object.entries(focusMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
      if(focusItems.length){
        html+=`<div style="margin-top:10px;padding:10px 12px;background:var(--accent-bg);border:1px solid var(--c-position-border);border-radius:var(--radius-sm)">
          <div style="font-size:11px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Recommended focus</div>
          ${focusItems.map(([name,count])=>`<div style="font-size:12px;color:var(--text);line-height:1.55;margin-bottom:4px">• ${esc(name)} <span style="color:var(--text3)">(${count} mistake${count!==1?'s':''})</span><button class="score-pos-link" data-score-pos="${esc(name)}" style="margin-left:8px;font-size:10px;padding:2px 8px;border:1px solid var(--accent);border-radius:20px;background:var(--accent-bg);color:var(--accent);cursor:pointer;font-family:var(--font);font-weight:600">Open ›</button></div>`).join('')}
        </div>`;
      }
      html+=`</div>`;
      reviewDiv.innerHTML=html;
      // Attach delegated handlers (safe – no inline onclick with user data)
      // Guard: only bind once; innerHTML reset doesn't remove listeners so we track binding
      if(!reviewDiv._scoreBound){
        reviewDiv._scoreBound=true;
        reviewDiv.addEventListener('click', function(e){
          const posBtn=e.target.closest('.score-pos-link');
          if(posBtn) { _openPosFromScore(posBtn.dataset.scorePos); return; }
          const chapBtn=e.target.closest('[data-score-chap]');
          if(chapBtn) openLearnChap(chapBtn.dataset.scoreChap, null);
        });
      }
    } else {
      reviewDiv.innerHTML=`<div style="margin-top:16px;background:var(--green-bg);border:1px solid var(--green-border);border-radius:var(--radius-sm);padding:14px;text-align:center;color:var(--green);font-weight:700;font-size:13px">🏆 Great job! All your answers were correct.</div>`;
    }
  }
  lastQuizSession={
    chapterId:lastChId,
    score:quizScore,
    total:quizData.length,
    percentage:pct,
    wrongAnswers:wrongAnswers.map(w=>({q:w.q,given:w.given,correct:w.correct})),
    timestamp:Date.now()
  };
  navTo('score');
}

// ── Open position from score page ──
function _openPosFromScore(posName){
  if(!posName) return;
  const flat=_getAllPosFlat();
  const item=flat.find(x=>x.pos.name.toLowerCase()===posName.toLowerCase()) ||
    flat.find(x=>x.pos.name.toLowerCase().includes(posName.toLowerCase()));
  if(item) openPos(item.pos, item.chId, item.scId, item.posIdx);
  else _showToast('Position not found: '+posName);
}

function restartQuiz(){ startQuiz(lastChId); }

(function _bindScorePageButtons(){
  const tryAnotherBtn=document.getElementById('scoreTryAnotherBtn');
  const retryBtn=document.getElementById('scoreRetryBtn');
  const askAIBtn=document.getElementById('scoreAskAIBtn');
  const homeBtn=document.getElementById('scoreHomeBtn');

  if(tryAnotherBtn) tryAnotherBtn.addEventListener('click', ()=>navTo('quiz-chapters'));
  if(retryBtn) retryBtn.addEventListener('click', restartQuiz);
  if(askAIBtn) askAIBtn.addEventListener('click', askAIAboutMistakes);
  if(homeBtn) homeBtn.addEventListener('click', ()=>navTo('home'));
}());

function deleteCurrentQ(){
  if(userRole!=='developer'||!lastChId||!QUIZ[lastChId]) return;
  showConfirm('Delete Question',`Delete Question ${quizIdx+1}?`,()=>{
    const origQ=quizData[quizIdx];
    let gi=-1;
    if(Number.isInteger(origQ._sourceIdx) && QUIZ[lastChId][origQ._sourceIdx]) gi=origQ._sourceIdx;
    if(gi===-1) gi=QUIZ[lastChId].indexOf(origQ);
    if(gi!==-1) QUIZ[lastChId].splice(gi,1);
    quizData.splice(quizIdx,1);
    if(gi!==-1){
      quizData.forEach(item=>{
        if(Number.isInteger(item._sourceIdx) && item._sourceIdx>gi) item._sourceIdx-=1;
      });
    }
    if(!quizData.length){navTo('quiz-chapters');buildChapters();return;}
    if(quizIdx>=quizData.length) quizIdx=quizData.length-1;
    renderQ();
  });
}

// ══════════════════════════════════════════════
// EDIT MODAL
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
        <button class="ef-add-opt-btn" style="margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid var(--border2);background:none;color:var(--accent);cursor:pointer;font-family:var(--font);font-size:12px">+ Add option</button>
      </div>`;
    document.querySelectorAll('.opt-input').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const idx=inp.dataset.idx;
        document.querySelectorAll('.correct-radio')[idx].value=inp.value;
      });
    });
    const addOptBtn=body.querySelector('.ef-add-opt-btn');
    if(addOptBtn) addOptBtn.addEventListener('click', addOptRow);
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
      <button class="ef-add-opt-btn" style="margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid var(--border2);background:none;color:var(--accent);cursor:pointer;font-family:var(--font);font-size:12px">+ Add option</button>
    </div>`;
  document.querySelectorAll('.opt-input').forEach(inp=>{
    inp.addEventListener('input',()=>{
      const idx=inp.dataset.idx;
      document.querySelectorAll('.correct-radio')[idx].value=inp.value;
    });
  });
  const addOptBtn=document.querySelector('#editModalBody .ef-add-opt-btn');
  if(addOptBtn) addOptBtn.addEventListener('click', addOptRow);
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
    q._resolvedXray=_resolveQuizImageSrc(q.xrayImg);
    q._learningTip=_quizBuildLearningTip(q, q._matchedPosition ? {name:q._matchedPosition,info:{}} : null);
    // Sync to QUIZ global
    const sourceKey=q._sourceKey || lastChId;
    if(sourceKey && QUIZ[sourceKey]){
      let oi=-1;
      if(Number.isInteger(q._sourceIdx) && QUIZ[sourceKey][q._sourceIdx]) oi=q._sourceIdx;
      if(oi===-1) oi=QUIZ[sourceKey].findIndex(qq=>qq===quizData[quizIdx]||qq.correct===q.correct);
      if(oi!==-1){
        QUIZ[sourceKey][oi].options=[...q.options];
        QUIZ[sourceKey][oi].correct=q.correct;
        QUIZ[sourceKey][oi].questionText=q.questionText;
        QUIZ[sourceKey][oi].xrayImg=q.xrayImg;
        q._sourceIdx=oi;
        q._sourceKey=sourceKey;
      }
      _prepareQuizBankForKey(sourceKey);
      Object.assign(q, _prepareQuizQuestion(q, sourceKey, Number.isInteger(q._sourceIdx)?q._sourceIdx:quizIdx));
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
    _prepareQuizBankForKey(lastChId);
    const newIdx=QUIZ[lastChId].length-1;
    quizData.push(_prepareQuizQuestion(QUIZ[lastChId][newIdx], lastChId, newIdx));
    buildChapters();
  }
  closeEditModal();
  if(userRole==='developer'){devSaveData();_showToast('💾 Changes saved');}
}

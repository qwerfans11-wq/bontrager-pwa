// js/utils.js — Pure utility functions (XSS protection, search, image helpers, toast)

function _escapeHtml(s){
  return String(s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function _toDataUriSvg(svgMarkup){
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarkup);
}

function _looksLikeDataUri(value){
  return typeof value === 'string' && value.trim().startsWith('data:image/');
}

function _mimeFromFilename(fname){
  const lower = String(fname || '').toLowerCase();
  if(lower.endsWith('.png')) return 'image/png';
  if(lower.endsWith('.webp')) return 'image/webp';
  if(lower.endsWith('.gif')) return 'image/gif';
  if(lower.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
}

function _resolveInlineImageSrc(fname, typeHint){
  if(!fname) return '';
  if(_looksLikeDataUri(fname)) return fname;

  const direct = INLINE_IMAGE_DATA[fname];
  if(direct){
    if(_looksLikeDataUri(direct)) return direct;
    const mime = _mimeFromFilename(fname);
    return 'data:' + mime + ';base64,' + direct;
  }

  const norm = _normalizeImageKey(fname);
  const mapped = INLINE_IMAGE_DATA[norm];
  if(mapped){
    if(_looksLikeDataUri(mapped)) return mapped;
    const mime = _mimeFromFilename(fname);
    return 'data:' + mime + ';base64,' + mapped;
  }

  const safeName = _escapeHtml(String(fname).replace(/\.[a-z0-9]+$/i,''));
  const label = typeHint === 'xray' ? 'X-RAY' : 'POSITION';
  const colorA = typeHint === 'xray' ? '#1d4ed8' : '#15803d';
  const colorB = typeHint === 'xray' ? '#0ea5e9' : '#22c55e';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="780" viewBox="0 0 1200 780">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1220"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="tag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${colorA}"/>
          <stop offset="100%" stop-color="${colorB}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="780" fill="url(#bg)"/>
      <g opacity="0.18">
        <circle cx="1020" cy="130" r="170" fill="#ffffff"/>
        <circle cx="180" cy="640" r="240" fill="#ffffff"/>
      </g>
      <rect x="80" y="84" rx="26" ry="26" width="210" height="54" fill="url(#tag)"/>
      <text x="185" y="120" text-anchor="middle" font-size="24" font-weight="700" fill="#ffffff" font-family="Arial,sans-serif">${label}</text>
      <text x="100" y="220" font-size="52" font-weight="700" fill="#e5e7eb" font-family="Arial,sans-serif">Embedded In index.html</text>
      <text x="100" y="292" font-size="36" fill="#cbd5e1" font-family="Arial,sans-serif">${safeName}</text>
      <rect x="100" y="350" width="1000" height="2" fill="#334155"/>
      <text x="100" y="420" font-size="28" fill="#94a3b8" font-family="Arial,sans-serif">No external image files required</text>
    </svg>
  `;

  return _toDataUriSvg(svg);
}

function _normalizeImageKey(value){
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'_')
    .replace(/^_|_$/g,'');
}

function _collectPositionLookupText(posRef){
  if(!posRef) return '';
  if(typeof posRef === 'string') return posRef;

  const parts = [];
  const push = (value) => {
    if(value && typeof value === 'string') parts.push(value);
  };

  push(posRef.name);
  push(posRef.symbol);
  push(posRef.code);
  push(posRef.title);
  push(posRef.alias);
  push(posRef.desc);
  push(posRef.description);
  push(posRef.note);
  push(posRef.notes);
  push(posRef.summary);

  if(posRef.info && typeof posRef.info === 'object'){
    push(posRef.info.name);
    push(posRef.info.symbol);
    push(posRef.info.code);
    push(posRef.info.title);
    push(posRef.info.alias);
    push(posRef.info.desc);
    push(posRef.info.description);
    push(posRef.info.note);
    push(posRef.info.notes);
    push(posRef.info.summary);
  }

  return parts.join(' ');
}

function _setImageSrcWithFallback(imgEl, fname, typeHint){
  const src = _resolveInlineImageSrc(fname, typeHint);
  if(!src){
    imgEl.style.display = 'none';
    imgEl.removeAttribute('src');
    return;
  }
  imgEl.onerror = null;
  imgEl.src = src;
  imgEl.style.display = 'block';
}

// Explicit map: BOOK position name → IMAGE_DATA key (takes priority over fuzzy matching)
const _SEARCH_STOP_WORDS=new Set(['the','of','and','for','with','from','into','onto','view','position','projection','xray','x-ray','radiograph']);

function _searchNormalize(value){
  return String(value||'')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[’'`]/g,'')
    .replace(/[-_/\\|]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function _searchTokens(value){
  return Array.from(new Set(
    _searchNormalize(value)
      .split(' ')
      .filter(t=>t && t.length>1 && !_SEARCH_STOP_WORDS.has(t))
  ));
}

function _levenshteinWithin(a,b,maxDist){
  if(a===b) return true;
  const al=a.length;
  const bl=b.length;
  if(!al || !bl) return Math.max(al,bl)<=maxDist;
  if(Math.abs(al-bl)>maxDist) return false;

  let prev=new Array(bl+1);
  let curr=new Array(bl+1);
  for(let j=0;j<=bl;j++) prev[j]=j;

  for(let i=1;i<=al;i++){
    curr[0]=i;
    let rowMin=curr[0];
    const ca=a.charCodeAt(i-1);
    for(let j=1;j<=bl;j++){
      const cost=(ca===b.charCodeAt(j-1))?0:1;
      const del=prev[j]+1;
      const ins=curr[j-1]+1;
      const sub=prev[j-1]+cost;
      const val=Math.min(del,ins,sub);
      curr[j]=val;
      if(val<rowMin) rowMin=val;
    }
    if(rowMin>maxDist) return false;
    const tmp=prev; prev=curr; curr=tmp;
  }
  return prev[bl]<=maxDist;
}

function _fieldHasFuzzyToken(field, token){
  if(!field || !token || token.length<4) return false;
  const maxDist=token.length>=9?2:1;
  const words=field.split(' ').filter(Boolean);
  for(let i=0;i<words.length;i++){
    const w=words[i];
    if(!w || Math.abs(w.length-token.length)>maxDist) continue;
    if(_levenshteinWithin(w, token, maxDist)) return true;
  }
  return false;
}

function _searchScore(queryNorm, queryTokens, fields){
  if(!queryNorm) return 0;
  const name=fields.name||'';
  const chapter=fields.chapter||'';
  const sub=fields.sub||'';
  const cr=fields.cr||'';
  const desc=fields.desc||'';
  const type=fields.type||'';
  let score=0;

  if(name===queryNorm) score+=280;
  else if(name.startsWith(queryNorm)) score+=230;
  else if(name.includes(queryNorm)) score+=190;

  if(chapter.startsWith(queryNorm)) score+=70;
  else if(chapter.includes(queryNorm)) score+=52;

  if(sub.includes(queryNorm)) score+=42;
  if(cr.includes(queryNorm)) score+=36;
  if(type.includes(queryNorm)) score+=18;
  if(desc.includes(queryNorm)) score+=12;

  let coverageCount=0;
  queryTokens.forEach(tok=>{
    let covered=false;

    if(name.startsWith(tok)){ score+=34; covered=true; }
    if(name.includes(tok)){ score+=24; covered=true; }
    if(chapter.includes(tok)){ score+=14; covered=true; }
    if(sub.includes(tok)){ score+=11; covered=true; }
    if(cr.includes(tok)){ score+=9; covered=true; }
    if(desc.includes(tok)){ score+=5; covered=true; }

    if(!name.includes(tok) && _fieldHasFuzzyToken(name, tok)){ score+=13; covered=true; }
    if(!chapter.includes(tok) && _fieldHasFuzzyToken(chapter, tok)){ score+=8; covered=true; }
    if(!sub.includes(tok) && _fieldHasFuzzyToken(sub, tok)){ score+=6; covered=true; }
    if(!cr.includes(tok) && _fieldHasFuzzyToken(cr, tok)){ score+=5; covered=true; }

    if(covered) coverageCount+=1;
  });

  if(queryTokens.length>1){
    score+=coverageCount*8;
  }
  return score;
}

function _escapeRegExp(str){
  return String(str||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
}

function _highlightSearchText(text, query){
  const source=String(text||'');
  const tokens=_searchTokens(query).sort((a,b)=>b.length-a.length).slice(0,5);
  if(!tokens.length) return esc(source);
  const rx=new RegExp(tokens.map(_escapeRegExp).join('|'),'ig');
  let out='';
  let last=0;
  let m;
  while((m=rx.exec(source))){
    const start=m.index;
    out+=esc(source.slice(last,start));
    out+=`<mark>${esc(source.slice(start,rx.lastIndex))}</mark>`;
    last=rx.lastIndex;
    if(!m[0]) rx.lastIndex+=1;
  }
  out+=esc(source.slice(last));
  return out;
}

function _restoreChapterText(item){
  const nameEl=item.querySelector('.ch-name');
  const subEl=item.querySelector('.ch-sub');
  if(nameEl){
    if(!nameEl.dataset.rawText) nameEl.dataset.rawText=nameEl.textContent||'';
    nameEl.innerHTML=esc(nameEl.dataset.rawText);
  }
  if(subEl){
    if(!subEl.dataset.rawText) subEl.dataset.rawText=subEl.textContent||'';
    subEl.innerHTML=esc(subEl.dataset.rawText);
  }
}

function _highlightChapterText(item, query){
  const nameEl=item.querySelector('.ch-name');
  const subEl=item.querySelector('.ch-sub');
  if(nameEl){
    if(!nameEl.dataset.rawText) nameEl.dataset.rawText=nameEl.textContent||'';
    nameEl.innerHTML=_highlightSearchText(nameEl.dataset.rawText, query);
  }
  if(subEl){
    if(!subEl.dataset.rawText) subEl.dataset.rawText=subEl.textContent||'';
    subEl.innerHTML=_highlightSearchText(subEl.dataset.rawText, query);
  }
}

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
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

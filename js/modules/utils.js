function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
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


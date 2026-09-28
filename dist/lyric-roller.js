/* Cache layout outside scroll events; only transforms/opacity change per frame. */
const lyricRoller=(()=>{
  const box=document.querySelector('.lyrics-scroll');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let items=[],frame=0,coast=0,drag=null,refreshFrame=0;
  function paint(){
    frame=0;const middle=box.scrollTop+box.clientHeight/2;
    const radius=Math.max(1,box.clientHeight*.58);
    for(const item of items){
      const proximity=Math.max(0,1-Math.abs(item.center-middle)/radius);
      const emphasis=proximity*proximity*(3-2*proximity);
      item.row.style.transform=`scale(${reduce.matches?1:1+emphasis*.055})`;
      item.row.style.opacity=reduce.matches?'1':String(.62+emphasis*.38);
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  function refresh(){
    refreshFrame=0;if(!box.clientHeight)return;
    const rows=[...box.querySelectorAll('p')];if(!rows.length)return;
    box.style.paddingTop=Math.max(12,(box.clientHeight-rows[0].offsetHeight)/2)+'px';
    box.style.paddingBottom=Math.max(12,(box.clientHeight-rows.at(-1).offsetHeight)/2)+'px';
    items=rows.map(row=>({row,center:row.offsetTop+row.offsetHeight/2}));schedule();
  }
  function cancel(){cancelAnimationFrame(coast);coast=0;drag=null;box.scrollTo({top:box.scrollTop,behavior:'instant'});}
  function center(row,smooth=true){
    const item=items.find(item=>item.row===row);if(!item)return;
    cancelAnimationFrame(coast);coast=0;
    box.scrollTo({top:item.center-box.clientHeight/2,behavior:smooth&&!reduce.matches?'smooth':'instant'});
  }
  box.addEventListener('scroll',schedule,{passive:true});
  box.addEventListener('wheel',cancel,{passive:true});
  box.addEventListener('touchstart',cancel,{passive:true});
  box.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))cancel();});
  box.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0)return;
    // Leave the native scrollbar available for dragging.
    if(e.clientX>=box.getBoundingClientRect().left+box.clientWidth)return;
    cancel();drag={y:e.clientY,top:box.scrollTop,lastY:e.clientY,lastTime:performance.now(),speed:0};
    box.setPointerCapture(e.pointerId);box.classList.add('is-dragging');e.preventDefault();box.focus({preventScroll:true});
  });
  box.addEventListener('pointermove',e=>{
    if(!drag)return;const now=performance.now(),dt=Math.max(1,now-drag.lastTime);
    drag.speed=Math.max(-2.5,Math.min(2.5,(drag.lastY-e.clientY)/dt));
    drag.lastY=e.clientY;drag.lastTime=now;
    box.scrollTo({top:drag.top+drag.y-e.clientY,behavior:'instant'});
  });
  function release(e){
    box.classList.remove('is-dragging');if(!drag)return;
    let velocity=performance.now()-drag.lastTime<80?drag.speed:0;drag=null;
    if(box.hasPointerCapture(e.pointerId))box.releasePointerCapture(e.pointerId);
    if(reduce.matches||e.type==='pointercancel')return;
    let last=performance.now();
    function glide(now){
      const dt=Math.min(32,now-last);last=now;
      const before=box.scrollTop;box.scrollTo({top:before+velocity*dt,behavior:'instant'});
      velocity*=Math.exp(-dt/160);
      if(Math.abs(velocity)>.025&&Math.abs(box.scrollTop-before)>.1)coast=requestAnimationFrame(glide);else coast=0;
    }
    if(Math.abs(velocity)>.025)coast=requestAnimationFrame(glide);
  }
  box.addEventListener('pointerup',release);box.addEventListener('pointercancel',release);
  box.addEventListener('lostpointercapture',()=>{drag=null;box.classList.remove('is-dragging');});
  new ResizeObserver(()=>{if(!refreshFrame)refreshFrame=requestAnimationFrame(refresh);}).observe(box);
  document.fonts.ready.then(refresh);reduce.addEventListener('change',()=>{cancel();schedule();});
  return {refresh,center,cancel};
})();
// Silhouettes traced in the supplied picnic painting's 1536 × 1024 coordinates.
const EXTRA_FRUITS = [
{id:'pineapple',x:938,y:112,w:270,h:273,cut:1072,path:'M1050 119 C1080 99 1132 128 1168 175 C1201 218 1212 276 1192 315 C1170 355 1128 390 1087 378 C1029 364 984 320 965 266 C946 217 942 167 974 139 C996 118 1025 112 1050 119Z'},
{id:'apple',x:1204,y:210,w:225,h:195,cut:1320,path:'M1319 227 C1364 189 1414 219 1423 271 C1437 315 1415 373 1384 392 C1357 410 1336 394 1318 399 C1275 406 1232 389 1219 348 C1199 294 1213 248 1254 226 C1279 213 1300 218 1319 227Z'},
{id:'mango',x:1175,y:390,w:283,h:216,cut:1313,path:'M1219 407 C1260 375 1322 388 1370 417 C1414 441 1433 486 1441 530 C1448 554 1466 578 1450 591 C1431 610 1398 603 1362 593 C1327 587 1279 584 1245 563 C1205 541 1178 502 1180 466 C1180 440 1191 421 1219 407Z'},
{id:'starfruit',x:1137,y:559,w:302,h:260,cut:1300,path:'M1284 566 Q1299 547 1310 578 L1356 641 L1410 652 Q1425 656 1413 676 L1380 721 L1430 756 Q1449 770 1422 773 L1355 769 L1343 807 Q1336 831 1317 805 L1276 767 L1215 783 Q1194 783 1208 761 L1232 718 L1149 719 Q1127 713 1153 691 L1213 654 L1182 598 Q1174 578 1200 587 L1260 601Z'}
];
const ALL_FRUITS = [
{id:'strawberry',x:465,y:183,w:98,h:96,path:'M466 259 C465 247 471 225 478 207 C487 180 505 181 520 187 L532 184 L540 194 L548 192 L548 208 C561 216 565 228 556 244 C548 259 518 270 485 278 C474 280 465 275 466 259Z'},
{id:'lemon',x:561,y:27,w:155,h:151,path:'M636 30 C606 24 581 42 570 68 C555 97 575 136 604 150 C628 164 652 162 675 174 C685 180 696 175 697 160 C710 137 718 102 706 75 C692 43 667 30 636 30Z'},
...EXTRA_FRUITS];
const FRUIT_THEMES={strawberry:'LOVE',lemon:'MEET',pineapple:'WOMEN',apple:'ME&PEOPLE',mango:'A LITTLE BRAVE',starfruit:'DEAR YOU'};
const sliceScene=document.querySelector('#scene');
const svgArt=document.querySelector('.art'), svgDefs=svgArt.querySelector('defs');
// Replace the old per-fruit hover layers with one isolated slicing system.
for(const node of [...svgArt.children])if(node!==svgDefs&&node.tagName.toLowerCase()!=='image')node.remove();
sliceScene.querySelectorAll('button').forEach(button=>button.remove());
svgDefs.insertAdjacentHTML('beforeend','<pattern id="slice-cloth-tile" patternUnits="userSpaceOnUse" width="75" height="62"><image href="assets/picnic.png" x="-707" y="-178" width="1536" height="1024"/></pattern>');
const sliceStates=[];
function closeFruit(state){state.open=false;state.start=null;state.down=null;state.swiped=false;state.art.classList.remove('sliced','lifted');state.button.classList.remove('sliced','lifted');state.button.setAttribute('aria-expanded','false');}
function resetFruitSlices(){for(const state of sliceStates)closeFruit(state);}
function pointInArt(e){const matrix=svgArt.getScreenCTM();return matrix?new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()):null;}
for(const f of ALL_FRUITS){
  svgDefs.insertAdjacentHTML('beforeend',`<clipPath id="slice-${f.id}-outline"><path d="${f.path}"/></clipPath><clipPath id="slice-${f.id}-a"><polygon/></clipPath><clipPath id="slice-${f.id}-b"><polygon/></clipPath>`);
  const halves=['a','b'].map(side=>`<g class="slice-half" data-half="${side}"><g clip-path="url(#slice-${f.id}-outline)"><g clip-path="url(#slice-${f.id}-${side})"><image href="assets/${f.id}.png" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" preserveAspectRatio="xMidYMid slice"/><image class="slice-skin" href="assets/picnic.png" width="1536" height="1024"/><path class="slice-edge"/></g></g></g>`).join('');
  svgArt.insertAdjacentHTML('beforeend',`<g data-slice-fruit="${f.id}"><path class="slice-cloth" d="${f.path}" fill="url(#slice-cloth-tile)"/><g class="fruit-lift" style="transform-origin:${f.x+f.w/2}px ${f.y+f.h/2}px">${halves}</g><path class="blade-flash"/></g>`);
  const button=document.createElement('button');button.id=f.id;button.className='slice-button';button.style.cssText=`left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;--label-size:${f.id==='strawberry'?18:f.id==='mango'?19:22}px`;button.setAttribute('aria-label',`Slice ${f.id} to reveal ${FRUIT_THEMES[f.id]}, then open ${SONGS[f.id].title}`);button.setAttribute('aria-expanded','false');
  const label=document.createElement('span');label.className='fruit-engraving slice-label';label.textContent=FRUIT_THEMES[f.id];const ribbon=document.createElement('span');ribbon.className='silk-ribbon';ribbon.textContent=FRUIT_THEMES[f.id];button.append(label,ribbon);sliceScene.append(button);
  const art=svgArt.querySelector(`[data-slice-fruit="${f.id}"]`),outline=svgDefs.querySelector(`#slice-${f.id}-outline path`);
  const state={f,art,button,open:false,start:null,down:null,swiped:false};sliceStates.push(state);
  function cut(a,b){
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,t={x:dx/len,y:dy/len},n={x:-t.y,y:t.x};
    const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},R=3000;
    for(const other of sliceStates)if(other!==state)closeFruit(other);state.open=true;
    for(const [index,side] of ['a','b'].entries()){
      const sign=index===0?1:-1;
      const p1={x:mid.x-t.x*R,y:mid.y-t.y*R},p2={x:mid.x+t.x*R,y:mid.y+t.y*R};
      const points=[p1,p2,{x:p2.x+n.x*R*sign,y:p2.y+n.y*R*sign},{x:p1.x+n.x*R*sign,y:p1.y+n.y*R*sign}];
      svgDefs.querySelector(`#slice-${f.id}-${side} polygon`).setAttribute('points',points.map(p=>`${p.x},${p.y}`).join(' '));
      const half=art.querySelector(`[data-half="${side}"]`),distance=Math.max(24,Math.min(f.w,f.h)*.16);
      half.style.setProperty('--split-x',`${n.x*distance*sign}px`);half.style.setProperty('--split-y',`${n.y*distance*sign}px`);half.style.setProperty('--split-rotation',`${sign*10}deg`);half.style.transformOrigin=`${mid.x}px ${mid.y}px`;
      half.querySelector('.slice-edge').setAttribute('d',`M${p1.x} ${p1.y} L${p2.x} ${p2.y}`);
    }
    art.querySelector('.blade-flash').setAttribute('d',`M${a.x-t.x*20} ${a.y-t.y*20} L${b.x+t.x*30} ${b.y+t.y*30}`);
    art.classList.add('sliced');button.classList.add('sliced');button.setAttribute('aria-expanded','true');
  }
  function defaultCut(){cut({x:f.x+f.w*.5,y:f.y+f.h*.1},{x:f.x+f.w*.5,y:f.y+f.h*.9});}
  // Initialize complementary masks without opening the fruit.
  svgDefs.querySelector(`#slice-${f.id}-a polygon`).setAttribute('points',`0,0 ${f.x+f.w/2},0 ${f.x+f.w/2},1024 0,1024`);
  svgDefs.querySelector(`#slice-${f.id}-b polygon`).setAttribute('points',`${f.x+f.w/2},0 1536,0 1536,1024 ${f.x+f.w/2},1024`);
  button.addEventListener('pointerenter',()=>{state.start=null;art.classList.add('lifted');button.classList.add('lifted');});
  button.addEventListener('pointerleave',()=>closeFruit(state));
  button.addEventListener('blur',()=>closeFruit(state));
  button.addEventListener('pointerdown',e=>{state.down={x:e.clientX,y:e.clientY};state.swiped=false;if(e.pointerType==='touch'){state.start=pointInArt(e);button.setPointerCapture(e.pointerId);}});
  button.addEventListener('pointermove',e=>{
    if(state.down&&Math.hypot(e.clientX-state.down.x,e.clientY-state.down.y)>8)state.swiped=true;
    if(state.open)return;
    const p=pointInArt(e);if(!p||!outline.isPointInFill(p))return;
    if(!state.start){state.start=p;return;}
    if(Math.hypot(p.x-state.start.x,p.y-state.start.y)>Math.min(f.w,f.h)*.23)cut(state.start,p);
  });
  button.addEventListener('pointercancel',()=>{state.start=null;state.down=null;state.swiped=false;});
  button.addEventListener('focus',()=>{if(button.matches(':focus-visible')&&!state.open)defaultCut();});
  button.addEventListener('click',()=>{state.down=null;if(state.swiped){state.swiped=false;return;}if(!state.open){defaultCut();return;}location.hash=f.id;});
}
addEventListener('hashchange',resetFruitSlices);

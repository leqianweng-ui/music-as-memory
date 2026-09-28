/* Cue times are clip-relative seconds, checked against the supplied burned-in
   subtitles at one-second intervals (approximately +/- 0.5 s), not full-song
   timings. Adjacent lines shown together in a subtitle share a cue.
   Strawberry timings (16, 19, 25 seconds) were confirmed by the user. */
const LYRIC_CUES = {
  strawberry: {video:'how-long.mp4', cues:[
    [16,19,[0]], [19,25,[1]], [25,Infinity,[2]]
  ]},
  lemon: {video:'lemon-film.mp4', introBefore:19, cues:[
    [0,6.5,[-1]], [6.5,10.5,[19]], [10.5,15.5,[20]],
    [15.5,21,[21]], [22.5,25.5,[22]], [25.5,29.5,[23]],
    [29.5,41.54,[24]]
  ]},
  pineapple: {video:'pineapple.mp4', cues:[
    [0,2.5,[21]], [2.5,5.5,[22]], [5.5,10.5,[23]],
    [10.5,13.5,[24]], [13.5,16.5,[25]], [16.5,22.152,[26]]
  ]},
  apple: {video:'apple.mp4', cues:[
    [0.5,6,[51]], [6.5,11.5,[52]], [11.5,15.5,[53,54]],
    [15.5,16.5,[54]], [16.5,18.5,[55]], [18.5,21.5,[56]],
    [21.5,24.5,[57]], [24.5,31,[58]]
  ]},
  mango: {video:'mango.mp4', cues:[
    [0,5.5,[8]], [5.5,13.5,[9]], [13.5,20.5,[10]],
    [20.5,28.5,[11]], [28.5,35.5,[12]], [35.5,43.282,[13]]
  ]},
  starfruit: {video:'starfruit-current.mp4', cues:[
    [0.5,7.5,[13]], [7.5,14.5,[14]], [14.5,20.5,[15]],
    [20.5,29.768,[16]]
  ]}
};

const lyricSync = (() => {
  const box=document.querySelector('.lyrics-scroll');
  const media=document.querySelector('#music-video');
  const panel=document.querySelector('#song');
  const guide=document.querySelector('.lyrics-guide');
  const originalGuide=guide.textContent;
  const button=document.createElement('button');
  button.type='button'; button.className='lyrics-follow'; button.hidden=true;
  button.setAttribute('aria-label','Return to the current lyric and follow playback');
  guide.before(button);
  let track=null, rows=[], intro=null, following=true, currentKey=null;
  function showState(){
    button.hidden=!track;
    button.textContent=following?'FOLLOWING LYRICS':'BACK TO CURRENT LYRIC';
    button.setAttribute('aria-pressed',String(following));
    guide.textContent=track?(following?'SCROLL TO EXPLORE OTHER LYRICS':'AUTO-SCROLL PAUSED · EXPLORE AT YOUR PACE'):originalGuide;
  }
  function rowFor(index){return index===-1?intro:rows[index];}
  function update(force=false,instant=false){
    if(!track||panel.hidden)return;
    if(!media.currentSrc.endsWith('/'+track.video)&&!media.src.endsWith('/'+track.video))return;
    const time=media.currentTime;
    const cue=track.cues.find(([start,end])=>time>=start&&time<end);
    const key=cue?cue[0]:null;
    if(force||key!==currentKey){
      for(const row of [...rows,intro].filter(Boolean)){
        row.classList.remove('current-lyric');row.removeAttribute('aria-current');
      }
      if(cue)for(const index of cue[2]){const row=rowFor(index);if(row){row.classList.add('current-lyric');row.setAttribute('aria-current','true');}}
      currentKey=key;
      if(following){
        const upcoming=cue||track.cues.find(([start])=>start>time)||track.cues.at(-1);
        lyricRoller.center(rowFor(upcoming[2][0]),!instant);
      }
    }
  }
  function pauseFollowing(){if(!track||!following)return;following=false;showState();}
  box.addEventListener('wheel',pauseFollowing,{passive:true});
  box.addEventListener('pointerdown',pauseFollowing,{passive:true});
  box.addEventListener('touchstart',pauseFollowing,{passive:true});
  box.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))pauseFollowing();});
  button.addEventListener('click',()=>{following=true;showState();update(true);});
  for(const event of ['timeupdate','seeked','loadedmetadata','play'])media.addEventListener(event,()=>update());
  addEventListener('resize',()=>{if(following)update(true);});
  if(document.fonts)document.fonts.ready.then(()=>{if(following)update(true);});
  return {select(fruit){
    // Render each existing strawberry line separately so the reel can center it.
    // All verses remain available; only the confirmed opening three are timed.
    if(fruit==='strawberry'){
      const lines=[];
      for(const verse of box.querySelectorAll('p')){
        for(const html of verse.innerHTML.split(/<br\s*\/?>/i)){
          const line=document.createElement('p');line.className='english-lyric-line';line.lang='en';line.innerHTML=html;lines.push(line);
        }
      }
      box.replaceChildren(...lines);
    }
    track=LYRIC_CUES[fruit]||null;rows=[...box.querySelectorAll('p')];intro=null;
    currentKey=null;following=true;box.classList.toggle('synced-lyrics',Boolean(track));
    if(track&&track.introBefore!==undefined){
      intro=document.createElement('p');intro.className='lyric-intro';
      intro.textContent='Vocal intro · 哼唱';rows[track.introBefore].before(intro);
    }
    lyricRoller.cancel();lyricRoller.refresh();
    showState();
    if(track){update(true,true);requestAnimationFrame(()=>{if(following)update(true,true);});}
    else box.scrollTop=0;
  }};
})();
const sceneMusic = {
  basket: new Audio('assets/basket-bgm.mp3'),
  market: new Audio('assets/market-bgm.mp3')
};
let musicEnabled=true, musicScene=null, musicEpoch=0;
for(const [id,audio] of Object.entries(sceneMusic)){
  audio.loop=true;audio.preload='metadata';audio.volume=.45;
  const control=document.createElement('button');control.className='bgm-toggle';control.type='button';
  control.setAttribute('aria-label',id==='basket'?'Play or pause 霞光 background music':'Play or pause 生活倒影 background music');
  document.querySelector('#'+id).append(control);
  control.addEventListener('click',()=>{musicEnabled=audio.paused;updateSceneMusic();});
  for(const event of ['play','pause','error'])audio.addEventListener(event,()=>{
    control.textContent=audio.error?'MUSIC UNAVAILABLE':audio.paused?'♪ MUSIC ON':'Ⅱ MUSIC OFF';
    control.setAttribute('aria-pressed',String(!audio.paused));
    control.title=audio.paused?'Play background music':'Pause background music';
  });
  control.textContent='♪ MUSIC ON';
}
async function updateSceneMusic(){
  const epoch=++musicEpoch;
  musicScene=location.hash==='#market'?'market':Object.hasOwn(SONGS,location.hash.slice(1))?null:'basket';
  for(const [id,audio] of Object.entries(sceneMusic))if(id!==musicScene||!musicEnabled)audio.pause();
  if(!musicScene||!musicEnabled)return;
  const audio=sceneMusic[musicScene];
  try{await audio.play();if(epoch!==musicEpoch&&audio!==sceneMusic[musicScene])audio.pause();}catch{/* The music control or the next user gesture can start audible playback. */}
}
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.bgm-toggle')&&musicScene&&musicEnabled&&sceneMusic[musicScene].paused)updateSceneMusic();});
document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&musicScene&&musicEnabled&&sceneMusic[musicScene].paused)updateSceneMusic();});

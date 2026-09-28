const scene = document.querySelector('#scene');
const berry = document.querySelector('#strawberry');
const basket = document.querySelector('#basket');
const song = document.querySelector('#song');
const market = document.querySelector('#market');
const video = document.querySelector('#music-video');
const dialog = document.querySelector('#video-dialog');
const lemon = document.querySelector('#lemon');
const strawberryLyrics = document.querySelector('.lyrics-scroll').innerHTML;
let activeFruit = 'strawberry';
function selectSong(fruit) {
  const data=SONGS[fruit];
  song.classList.toggle('lemon-song',fruit==='lemon');
  song.classList.toggle('light-song',fruit!=='strawberry');
  song.dataset.language=data.language;
  song.style.backgroundImage=`url('assets/${data.background}')`;
  if(activeFruit!==fruit){video.pause();video.src=`assets/${data.video}`;video.load();activeFruit=fruit;document.querySelector('#video-time').textContent='0:00';document.querySelector('#video-seek').value=0;document.querySelector('#video-seek').style.setProperty('--progress','0%');}
  document.querySelector('.song-heading .eyebrow').textContent=`${data.number} / ${fruit.toUpperCase()}`;
  const title=document.querySelector('#song-title');title.innerHTML=data.heading||data.title;title.lang=data.language;
  document.querySelector('.song-translation').textContent=data.translation;
  const artist=document.querySelector('.artist');artist.textContent=data.artist;
  if(data.artistEnglish){const en=document.createElement('span');en.className='artist-local';en.lang='en';en.textContent=data.artistEnglish;artist.append(en);}
  const lyricsBox=document.querySelector('.lyrics-scroll');lyricsBox.replaceChildren();
  if(fruit==='strawberry')lyricsBox.innerHTML=strawberryLyrics;
  for(const [original,english] of data.lines||[]){const p=document.createElement('p');p.className='lyric-pair';const ko=document.createElement('span');ko.lang=data.language;ko.textContent=original;const en=document.createElement('span');en.className='lyric-translation';en.lang='en';en.textContent=english;p.append(ko,en);lyricsBox.append(p);}
  lyricsBox.scrollTop=0;
  for(const line of data.englishLines||[]){const p=document.createElement('p');p.className='english-lyric-line';p.lang='en';p.textContent=line;lyricsBox.append(p);}
  const hasLyrics=fruit==='strawberry'||Boolean(data.lines)||Boolean(data.englishLines);
  document.querySelector('.lyrics-area').style.visibility=hasLyrics?'':'hidden';document.querySelector('.lyrics-area').inert=!hasLyrics;
  document.querySelector('#song footer span:first-child').textContent=fruit==='strawberry'?'LOVE, HELD IN A SONG.':'';
  document.querySelector('#song footer span:last-child').textContent=`${data.number} / 06`;
  video.setAttribute('aria-label',`${data.title} music video`);
}function fitScene() {
  const w = innerWidth, h = innerHeight;
  const scale = Math.max(w / 1536, h / 1024);
  // Keep both the fruit and the title visible on narrow screens.
  const anchor = w < 700 ? .40 : .50;
  scene.style.transform = `translate(${(w - 1536 * scale) * anchor}px,${(h - 1024 * scale) * .46}px) scale(${scale})`;
}
function route() {
  updateSceneMusic();
  const isSong = Object.hasOwn(SONGS,location.hash.slice(1));
  if(isSong) selectSong(location.hash.slice(1));
  const isMarket = location.hash === '#market';
  basket.hidden = isSong || isMarket; song.hidden = !isSong; market.hidden = !isMarket;
  if(isSong) lyricSync.select(activeFruit);
  if(!isSong) { video.pause(); if(dialog.open) dialog.close(); }
  document.title = isSong ? `${SONGS[activeFruit].title} — Music & Life` : isMarket ? 'The Fruit Market — Music & Life' : 'Music & Life — The Basket';
  if(isSong) { document.querySelector('#back').focus({preventScroll:true}); startOnEntry(); }
  else { resetFruitSlices(); fitScene(); }
}
const play = document.querySelector('#play-video');
const seek = document.querySelector('#video-seek');
const status = document.querySelector('#video-status');
async function startOnEntry() {
  video.muted = false;
  if(video.volume === 0) video.volume = 1;
  status.textContent = '';
  try { await video.play(); }
  catch(error) {
    if(song.hidden || error.name !== 'NotAllowedError') return;
    status.textContent='Press play to start the film with sound.';
  }
  if(song.hidden) video.pause();
}
play.addEventListener('click', async () => {
  if(!video.paused) { video.pause(); return; }
  try { await video.play(); status.textContent=''; } catch { status.textContent='Playback could not start. Please try again.'; }
});
for(const event of ['play','pause','ended']) video.addEventListener(event, () => {
  const playing = !video.paused && !video.ended;
  document.querySelector('#record').classList.toggle('playing', playing);
  play.textContent = playing ? '❚❚' : '▶';
  play.setAttribute('aria-label',playing ? 'Pause video' : 'Play video');
  play.title = playing ? 'Pause video' : 'Play video';
});
video.addEventListener('timeupdate', () => {
  seek.value = video.duration ? video.currentTime / video.duration * 100 : 0;
  seek.style.setProperty('--progress',`${seek.value}%`);
  document.querySelector('#video-time').textContent = `${Math.floor(video.currentTime/60)}:${String(Math.floor(video.currentTime%60)).padStart(2,'0')}`;
});
seek.addEventListener('input', () => { seek.style.setProperty('--progress',`${seek.value}%`); if(Number.isFinite(video.duration)) video.currentTime = Number(seek.value)/100*video.duration; });
video.addEventListener('volumechange', () => {
  const button = document.querySelector('#mute-video');
  button.textContent=video.muted ? 'SOUND OFF' : 'SOUND ON';
  button.setAttribute('aria-pressed',String(video.muted));
  button.setAttribute('aria-label',video.muted ? 'Unmute video' : 'Mute video');
});
document.querySelector('#mute-video').addEventListener('click', e => {
  video.muted = !video.muted; e.currentTarget.textContent = video.muted ? 'SOUND OFF' : 'SOUND ON'; e.currentTarget.setAttribute('aria-pressed',String(video.muted));
});
video.addEventListener('error', () => { status.textContent = 'The video could not load. Please refresh and try again.'; });
document.querySelector('#expand-video').addEventListener('click', async () => {
  document.querySelector('#expanded-video-slot').append(video); video.controls = true; dialog.showModal();
  try { if(dialog.requestFullscreen) await dialog.requestFullscreen(); } catch { /* The full-window dialog remains usable. */ }
});
document.querySelector('#close-video').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  if(document.fullscreenElement === dialog) document.exitFullscreen().catch(()=>{});
  document.querySelector('#record').append(video); video.controls = false;
  document.querySelector('#expand-video').focus();
});
addEventListener('keydown', e => { if(e.key === 'Escape' && !dialog.open && !document.fullscreenElement && !song.hidden) location.hash='basket'; });
addEventListener('resize', fitScene);
addEventListener('hashchange', route);
route();

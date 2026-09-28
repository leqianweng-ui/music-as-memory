// English lyric translations prepared from the two supplied Word documents.
const windLines = [
['살면서 듣게 될까 언젠가는','Will I hear it someday, as I live—'],
['바람의 노래를','the song of the wind?'],
['세월 가면 그때는 알게 될까','When the years pass, will I finally understand'],
['꽃이지는 이유를','why flowers fall?'],
['나를 떠난 사람들과 만나게 될','The people who have left me, and those'],
['또 다른 사람들','I have yet to meet—'],
['스쳐 가는 인연과 그리움은','the fleeting connections and the longing,'],
['어느 곳으로 가는가','where do they go?'],
['나의 작은 지혜로는 알 수가 없네','My little wisdom cannot tell me.'],
['내가 아는 건 살아가는 방법뿐이야','All I know is how to keep on living.'],
['보다 많은 실패와 고뇌의 시간이','More failures and hours of anguish—'],
['비켜갈 수 없다는 걸 우린 깨달았네','we have learned that we cannot avoid them.'],
['이제 그 해답이 사랑이라면','Now, if love is the answer,'],
['나는 이 세상 모든 것들을 사랑하겠네','I will love everything in this world.']
];
const rainbowVerse1 = [
['눈도 안 뜬 이 아침을 맞고','I greet the morning before my eyes are even open,'],
['지친 나를 위해 기도하고','and pray for my weary self.'],
['벗어놓은 어젤 다시 입고','I put yesterday back on, after taking it off,'],
['또 하루는 애써 나를 달래주고','and another day tries its best to comfort me.']
];
const rainbowChorus = [
['변함없이 다들 같은 곳을 향해','As always, everyone heads toward the same place,'],
['소리 없이 도는 시계바늘처럼','like the hands of a clock turning silently.'],
['끝도 없는 저기 저 길 위','On that endless road ahead,'],
['점 한 칸을 겨우 지나서야','only after barely passing a single tiny mark,'],
['내 하룬 진다','my day comes to an end.']
];
const rainbowVerse2 = [
['익숙하게 내려놓은 믿음','The faith I have grown used to setting aside,'],
['무덤덤히 쌓여가는 변명','the excuses piling up without a feeling—'],
['세상 닮은 나를 조각하고','I carve myself into the image of the world,'],
['내 모든 걸 깊이 맘에 묻어두고','and bury everything deep inside my heart.'],
['붉게 물든 저녁 노을 빛 어딘가','Somewhere in the red glow of the evening sky,'],
['단단하게 굳어버린 내 그림자','my shadow has hardened into something solid.'],
['꺼질 듯한 하루하루를 견뎌보면','If I endure these days that seem about to fade out,'],
['소망 같던 꿈에 가까워질까','will I get closer to the dream I once wished for?']
];
const SONGS = {
strawberry:{number:'01',title:'How Long Will I Love You',heading:'How long will<br><em>I love you</em>',translation:'',artist:'Jon Boden, Sam Sweeney & Ben Coleman',video:'how-long.mp4',background:'strawberry.png',language:'en'},
lemon:{number:'02',title:'路过人间',translation:'Passing Through This World',artist:'郁可唯',artistEnglish:'Yisa Yu',video:'lemon-film.mp4',background:'lemon.png',language:'zh'},
pineapple:{number:'03',title:'心要野',translation:'Let Your Heart Run Wild',artist:'后海大鲨鱼',artistEnglish:'Queen Sea Big Shark',video:'pineapple.mp4',background:'pineapple.png',language:'zh'},
apple:{number:'04',title:'This Is Me',translation:'',artist:'Keala Settle & The Greatest Showman Ensemble',video:'apple.mp4',background:'apple.png',language:'en'},
mango:{number:'05',title:'바람의 노래',translation:'Wind Song',artist:'소향',artistEnglish:'Sohyang',video:'mango.mp4',background:'mango.png',language:'ko',lines:[...windLines,...windLines.slice(4),...windLines.slice(10),windLines[13],['이 세상 모든 것들을 사랑하겠네','I will love everything in this world.']]},
starfruit:{number:'06',title:'무지개는 있다 (Band Ver.)',translation:'There Is a Rainbow (Band Ver.)',artist:'빈센트 블루',artistEnglish:'Vincent Blue',video:'starfruit-current.mp4',background:'starfruit.png',language:'ko',lines:[...rainbowVerse1,...rainbowChorus,...rainbowVerse2,['우 우우 우','Ooh, ooh, ooh.'],['고단했던 밤이 그친 걸까','Has the weary night finally ended?'],['무지개는 다시 떠오르고','The rainbow rises once again.'],...rainbowChorus,['오늘도 난 무지개를 쫓아','Today, once again, I chase the rainbow.']]}
};

SONGS.apple.englishLines = ["I am not a stranger to the dark","\"Hide away, \" they say","\"'Cause we don't want your broken parts\"","I've learned to be ashamed of all my scars","\"Run away, \" they say","\"No one'll love you as you are\"","But I won't let them break me down to dust","I know that there's a place for us","For we are glorious","When the sharpest words wanna cut me down","I'm gonna send a flood, gonna drown 'em out","I am brave, I am bruised","I am who I'm meant to be, this is me","Look out 'cause here I come","And I'm marching on to the beat I drum","I'm not scared to be seen","I make no apologies, this is me","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh, oh-oh-oh, oh-oh-oh, oh, oh","Another round of bullets hits my skin","Well, fire away 'cause today, I won't let the shame sink in","We are bursting through the barricades and","Reaching for the sun (we are warriors)","Yeah, that's what we've become (yeah, that's what we've become)","I won't let them break me down to dust","I know that there's a place for us","For we are glorious","When the sharpest words wanna cut me down","I'm gonna send a flood, gonna drown 'em out","I am brave, I am bruised","I am who I'm meant to be, this is me","Look out 'cause here I come","And I'm marching on to the beat I drum","I'm not scared to be seen","I make no apologies, this is me","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh-oh","Oh-oh-oh, oh-oh-oh, oh-oh-oh, oh, oh","This is me","and I know that I deserve your love","(Oh-oh-oh-oh) there's nothing I'm not worthy of","(Oh-oh-oh, oh-oh-oh, oh-oh-oh, oh, oh)","When the sharpest words wanna cut me down","I'm gonna send a flood, gonna drown 'em out","This is brave, this is bruised","This is who I'm meant to be, this is me","Look out 'cause here I come (look out 'cause here I come)","And I'm marching on to the beat I drum (marching on, marching, marching on)","I'm not scared to be seen","I make no apologies, this is me","Whenever the words wanna cut me down (oh-oh-oh-oh)","I'll send a flood to drown 'em out (oh, oh-oh, oh-oh)","I'm gonna send a flood (oh-oh-oh-oh)","Gonna drown them 'em out (oh-oh-oh, oh-oh-oh, oh-oh-oh, oh, oh)","Oh","This is me"];

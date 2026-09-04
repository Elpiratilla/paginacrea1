const BRAILLE = {
    a:[1],b:[1,2],c:[1,4],d:[1,4,5],e:[1,5],f:[1,2,4],g:[1,2,4,5],h:[1,2,5],i:[2,4],j:[2,4,5],
    k:[1,3],l:[1,2,3],m:[1,3,4],n:[1,3,4,5],o:[1,3,5],p:[1,2,3,4],q:[1,2,3,4,5],r:[1,2,3,5],s:[2,3,4],t:[2,3,4,5],
    u:[1,3,6],v:[1,2,3,6],w:[2,4,5,6],x:[1,3,4,6],y:[1,3,4,5,6],z:[1,3,5,6]
};
const DIGIT_TO_LETTER = {'1':'a','2':'b','3':'c','4':'d','5':'e','6':'f','7':'g','8':'h','9':'i','0':'j'};
function brailleChar(letter){
    let n = 0;
    BRAILLE[letter].forEach(d => n |= (1 << (d-1)));
    return String.fromCodePoint(0x2800 + n);
}
const ROWS = [
    [["Escape","Esc",1],["Digit1","1",1],["Digit2","2",1],["Digit3","3",1],["Digit4","4",1],["Digit5","5",1],["Digit6","6",1],["Digit7","7",1],["Digit8","8",1],["Digit9","9",1],["Digit0","0",1],["Minus","-",1],["Equal","=",1],["Backspace","⌫",1.8]],
    [["Tab","Tab",1.5],["KeyQ","Q",1],["KeyW","W",1],["KeyE","E",1],["KeyR","R",1],["KeyT","T",1],["KeyY","Y",1],["KeyU","U",1],["KeyI","I",1],["KeyO","O",1],["KeyP","P",1],["BracketLeft","[",1],["BracketRight","]",1],["Backslash","\\\\",1.3]],
    [["CapsLock","Caps",1.8],["KeyA","A",1],["KeyS","S",1],["KeyD","D",1],["KeyF","F",1],["KeyG","G",1],["KeyH","H",1],["KeyJ","J",1],["KeyK","K",1],["KeyL","L",1],["Semicolon",";",1],["Quote","'",1],["Enter","Enter",2.1]],
    [["ShiftLeft","Shift",2.3],["KeyZ","Z",1],["KeyX","X",1],["KeyC","C",1],["KeyV","V",1],["KeyB","B",1],["KeyN","N",1],["KeyM","M",1],["Comma",",",1],["Period",".",1],["Slash","/",1],["ShiftRight","Shift",2.6]],
    [["ControlLeft","Ctrl",1.3],["MetaLeft","Win",1.3],["AltLeft","Alt",1.3],["Space","",6.2],["AltRight","Alt",1.3],["ContextMenu","Menu",1.3],["ControlRight","Ctrl",1.3]]
];
const kbEl = document.getElementById('keyboard');
const codeToEl = {};
let colIndex = 0;
ROWS.forEach(row=>{
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(([code,label,w])=>{
    const k = document.createElement('div');
    k.className = 'key';
    k.style.flexGrow = w; 
    k.style.setProperty('--i', colIndex++);
    const isLetter = /^Key[A-Z]$/.test(code);
    const isDigit = /^Digit[0-9]$/.test(code);
    if(isLetter){
        const letter = code.slice(3).toLowerCase();
        k.innerHTML = `<span class="glyph">${brailleChar(letter)}</span><span class="capt">${letter}</span>`;
        k.dataset.type = 'letter';
        k.dataset.char = letter;
    } else if(isDigit){
        const digit = code.replace('Digit','');
        const glyph = digit==='0'&&false ? '' : brailleChar(DIGIT_TO_LETTER[digit]);
        k.innerHTML = `<span class="glyph">${glyph}</span><span class="capt">${digit}</span>`;
        k.dataset.type = 'digit';
        k.dataset.char = digit;
    } else {
        k.innerHTML = `<span class="glyph" style="font-size:12px">${label}</span>`;
        k.dataset.type = 'other';
    }
    k.dataset.code = code;
    k.dataset.label = label || 'Space';
    rowEl.appendChild(k);
    codeToEl[code] = k
    });
    kbEl.appendChild(rowEl);
});

let pulsaciones = 0, sessionStart = Date.now();
const freq = {};
const keyLog = [];
let phrase = '';
let soundEnabled = true, particlesEnabled = true, switchType = 'brown', autoVoice = true;

const logbar = document.getElementById('logbar');
const phraseOut = document.getElementById('phraseOut');
const kbcontainer = document.getElementById('kbcontainer');

function updateStats(){
}

function pushLog(label){
    keyLog.push(label);
    if(keyLog.length>40) keyLog.shift();
    logbar.innerHTML = keyLog.map(l=>`<span>${l}</span>`).join(' ');
    logbar.scrollLeft = logbar.scrollWidth;
}

function renderPhrase(){
    phraseOut.textContent = phrase || '\u00A0';
    phraseOut.scrollLeft = phraseOut.scrollWidth;
}
function appendChar(c){
    phrase += c;
    renderPhrase();
}
function speak(text){
    if(!('speechSynthesis' in window) || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
}
function speakLetter(t){ if(autoVoice) speak(t); }
function speakPhrase(){ if(phrase.trim()) speak(phrase); }
let actx;
function playClick(){
    if(!soundEnabled || switchType==='silent') return;
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    const cfg = {
    brown:{freq:220, type:'triangle', dur:.05},
    blue:{freq:520, type:'square', dur:.03},
    red:{freq:160, type:'sine', dur:.06}
    }[switchType] || {freq:220,type:'triangle',dur:.05};
    o.type = cfg.type; o.frequency.value = cfg.freq;
    g.gain.value = .06; // volumen bajito para que no moleste
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime+cfg.dur);
    o.stop(actx.currentTime+cfg.dur+.02);
}
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas(){
    const r = kbcontainer.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
function spawnParticles(x,y,color){
    if(!particlesEnabled) return;
    for(let i=0;i<10;i++){
    particles.push({x,y,vx:(Math.random()-.5)*3,vy:-Math.random()*3-1,life:1,color});
    }
}
function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.08; p.life-=0.025;
    ctx.globalAlpha = Math.max(p.life,0);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,2.4,0,7);
    ctx.fill();
    });
    ctx.globalAlpha=1;
    particles = particles.filter(p=>p.life>0);
    requestAnimationFrame(loop);
}
loop();
const pressed = new Set();
window.addEventListener('keydown', e=>{
    if(pressed.size > 0 && !pressed.has(e.code)) return;
    if(['Space','Backspace'].includes(e.code)) e.preventDefault();
    const el = codeToEl[e.code];
    if(el && !pressed.has(e.code)){
    pressed.add(e.code);
    el.classList.add('pressed');
    pulsaciones++;
    const label = el.dataset.label;
    freq[label] = (freq[label]||0)+1;
    pushLog(label);
    updateStats();
    playClick();
    const rect = el.getBoundingClientRect();
    const cRect = kbcontainer.getBoundingClientRect();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    spawnParticles(rect.left-cRect.left+rect.width/2, rect.top-cRect.top+rect.height/2, accent);
    if(el.dataset.type === 'letter'){
        appendChar(el.dataset.char);
        speakLetter(el.dataset.char);
    } else if(el.dataset.type === 'digit'){
        appendChar(el.dataset.char);
        speakLetter(el.dataset.char);
    }
    }
    if(e.code === 'Space') appendChar(' ');
    if(e.code === 'Backspace'){ phrase = phrase.slice(0,-1); renderPhrase(); }
    if(e.code === 'Enter') speakPhrase();
});
window.addEventListener('keyup', e=>{
    pressed.delete(e.code);
    const el = codeToEl[e.code];
    if(el) el.classList.remove('pressed');
});
document.getElementById('addBtn').addEventListener('click', ()=> appendChar(' '));
document.getElementById('delBtn').addEventListener('click', ()=>{ phrase = phrase.slice(0,-1); renderPhrase(); });
document.getElementById('clrBtn').addEventListener('click', ()=>{ phrase=''; renderPhrase(); });
document.getElementById('readBtn').addEventListener('click', speakPhrase);
document.getElementById('contrastBtn').addEventListener('click', ()=> document.body.classList.toggle('high-contrast'));
document.getElementById('autoVoiceChk').addEventListener('change', e=> autoVoice = e.target.checked);
document.getElementById('showLettersChk').addEventListener('change', e=> kbcontainer.classList.toggle('show-letters', e.target.checked));

setInterval(updateStats, 2000);
renderPhrase();
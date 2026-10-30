// teclado.js
// Arma el teclado Braille: cada tecla muestra su celda de seis puntos.
// Funciona con el teclado físico y también tocando o haciendo clic en las teclas.

// la tabla de puntos viene de braille.js (se carga antes que este archivo)
const BRAILLE = BRAILLE_PUNTOS;
const DIGIT_TO_LETTER = BRAILLE_DIGITO_A_LETRA;

// [código de tecla, texto, ancho relativo]
// solo teclas que hacen algo: letras, números, borrar, leer (Enter) y espacio
const ROWS = [
    [["Digit1","1",1],["Digit2","2",1],["Digit3","3",1],["Digit4","4",1],["Digit5","5",1],["Digit6","6",1],["Digit7","7",1],["Digit8","8",1],["Digit9","9",1],["Digit0","0",1],["Backspace","Borrar",1.6]],
    [["KeyQ","Q",1],["KeyW","W",1],["KeyE","E",1],["KeyR","R",1],["KeyT","T",1],["KeyY","Y",1],["KeyU","U",1],["KeyI","I",1],["KeyO","O",1],["KeyP","P",1]],
    [["KeyA","A",1],["KeyS","S",1],["KeyD","D",1],["KeyF","F",1],["KeyG","G",1],["KeyH","H",1],["KeyJ","J",1],["KeyK","K",1],["KeyL","L",1],["Semicolon","Ñ",1],["Enter","Leer",1.6]],
    [["KeyZ","Z",1],["KeyX","X",1],["KeyC","C",1],["KeyV","V",1],["KeyB","B",1],["KeyN","N",1],["KeyM","M",1]],
    [["Space","Espacio",1]]
];

function celdaHTML(puntos){
    let html = '<span class="tb-celda" aria-hidden="true">';
    for(let n = 1; n <= 6; n++){
        html += '<span class="punto' + (puntos.includes(n) ? ' lleno' : '') + '"></span>';
    }
    return html + '</span>';
}
function describirPuntos(puntos){
    return (puntos.length === 1 ? "punto " : "puntos ") + puntos.join(" ");
}

const kbEl = document.getElementById('keyboard');
const codeToEl = {};
ROWS.forEach(row=>{
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(([code,label,w])=>{
        const k = document.createElement('button');
        k.type = 'button';
        // fuera del orden de Tab: con teclado se escribe directo, no hace falta recorrer 50 teclas
        k.tabIndex = -1;
        k.className = 'key';
        k.style.flexGrow = w;
        k.dataset.code = code;
        k.dataset.label = label;

        let letra = null;
        if(/^Key[A-Z]$/.test(code)) letra = code.slice(3).toLowerCase();
        if(code === 'Semicolon') letra = 'ñ';

        if(letra){
            k.dataset.type = 'letter';
            k.dataset.char = letra;
            k.innerHTML = celdaHTML(BRAILLE[letra]) + '<span class="capt">' + letra.toUpperCase() + '</span>';
            k.setAttribute('aria-label', letra.toUpperCase() + ', ' + describirPuntos(BRAILLE[letra]));
        } else if(/^Digit[0-9]$/.test(code)){
            const digito = code.replace('Digit','');
            k.dataset.type = 'digit';
            k.dataset.char = digito;
            k.innerHTML = celdaHTML(BRAILLE[DIGIT_TO_LETTER[digito]]) + '<span class="capt">' + digito + '</span>';
            k.setAttribute('aria-label', digito + ', ' + describirPuntos(BRAILLE[DIGIT_TO_LETTER[digito]]));
        } else {
            k.dataset.type = 'other';
            k.classList.add('key-funcion');
            k.innerHTML = '<span class="capt-funcion">' + label + '</span>';
        }
        rowEl.appendChild(k);
        codeToEl[code] = k;
    });
    kbEl.appendChild(rowEl);
});

let phrase = '';
let soundEnabled = true, autoVoice = true;
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const phraseOut = document.getElementById('phraseOut');
const phraseBraille = document.getElementById('phraseBraille');
const kbcontainer = document.getElementById('kbcontainer');
const ultima = document.getElementById('ultimaLetra');

function renderPhrase(){
    phraseOut.textContent = phrase || ' ';
    phraseBraille.innerHTML = Array.from(phrase).map(function(c){
        if(c === ' ') return '<span class="tb-espacio"></span>';
        const puntos = BRAILLE[c] || BRAILLE[DIGIT_TO_LETTER[c]];
        return puntos ? celdaHTML(puntos) : '';
    }).join('');
    phraseBraille.scrollLeft = phraseBraille.scrollWidth;
}
function appendChar(c){
    phrase += c;
    renderPhrase();
}
function borrarUno(){
    phrase = phrase.slice(0,-1);
    renderPhrase();
}

// la celda grande muestra la última letra escrita
function mostrarUltima(caracter){
    const puntos = BRAILLE[caracter] || BRAILLE[DIGIT_TO_LETTER[caracter]];
    if(!puntos) return;
    ultima.querySelectorAll('.tb-celda-grande .punto').forEach(function(p, i){
        p.classList.toggle('lleno', puntos.includes(i + 1));
    });
    document.getElementById('ultimaNombre').textContent = caracter.toUpperCase();
    document.getElementById('ultimaPuntos').textContent = describirPuntos(puntos);
    // reinicia la animación de "golpe" de la celda
    ultima.classList.remove('golpe');
    void ultima.offsetWidth;
    ultima.classList.add('golpe');
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
    if(!soundEnabled) return;
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'triangle'; o.frequency.value = 220;
    g.gain.value = .06; // volumen bajito para que no moleste
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime+.05);
    o.stop(actx.currentTime+.07);
}

// puntitos que saltan de la tecla al presionarla
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animando = false;
function resizeCanvas(){
    const r = kbcontainer.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let colorParticulas = '#fde68a';
function spawnParticles(x,y){
    if(reducirMovimiento) return;
    // se lee al tocar (alto contraste cambia el amarillo), no en cada cuadro
    colorParticulas = getComputedStyle(document.body).getPropertyValue('--sl-acento').trim() || colorParticulas;
    for(let i=0;i<8;i++){
        particles.push({x,y,vx:(Math.random()-.5)*3,vy:-Math.random()*3-1,life:1});
    }
    if(!animando){ animando = true; requestAnimationFrame(loop); }
}
function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = colorParticulas;
    particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.08; p.life-=0.03;
        ctx.globalAlpha = Math.max(p.life,0);
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,7);
        ctx.fill();
    });
    ctx.globalAlpha=1;
    particles = particles.filter(p=>p.life>0);
    // el bucle se apaga solo cuando no quedan puntitos
    if(particles.length){ requestAnimationFrame(loop); } else { animando = false; }
}

// lo que pasa al presionar una tecla, venga del teclado físico o de un toque
function presionar(code){
    const el = codeToEl[code];
    if(el){
        el.classList.add('pressed');
        playClick();
        const rect = el.getBoundingClientRect();
        const cRect = kbcontainer.getBoundingClientRect();
        spawnParticles(rect.left-cRect.left+rect.width/2, rect.top-cRect.top+rect.height/2);
        if(el.dataset.type === 'letter' || el.dataset.type === 'digit'){
            appendChar(el.dataset.char);
            mostrarUltima(el.dataset.char);
            speakLetter(el.dataset.char);
        }
    }
    if(code === 'Space') appendChar(' ');
    if(code === 'Backspace') borrarUno();
    if(code === 'Enter') speakPhrase();
}
function soltar(code){
    const el = codeToEl[code];
    if(el) el.classList.remove('pressed');
}

const pressed = new Set();
window.addEventListener('keydown', e=>{
    // no escribir en el teclado cuando se está usando un campo, botón o enlace
    const destino = e.target;
    if(destino.closest && destino.closest('input, textarea, select, a, button:not(.key)')) return;
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    if(pressed.has(e.code)) return;
    if(['Space','Backspace'].includes(e.code)) e.preventDefault();
    pressed.add(e.code);
    presionar(e.code);
});
window.addEventListener('keyup', e=>{
    pressed.delete(e.code);
    soltar(e.code);
});

// toque o clic en las teclas de la pantalla
kbEl.addEventListener('pointerdown', e=>{
    const tecla = e.target.closest('.key');
    if(!tecla) return;
    e.preventDefault();
    presionar(tecla.dataset.code);
    const liberar = ()=>{ soltar(tecla.dataset.code); window.removeEventListener('pointerup', liberar); };
    window.addEventListener('pointerup', liberar);
});
// lectores de pantalla activan los botones con "click", sin pointerdown
kbEl.addEventListener('click', e=>{
    const tecla = e.target.closest('.key');
    if(!tecla || e.detail !== 0) return;
    presionar(tecla.dataset.code);
    setTimeout(()=> soltar(tecla.dataset.code), 120);
});

document.getElementById('readBtn').addEventListener('click', speakPhrase);
document.getElementById('addBtn').addEventListener('click', ()=> appendChar(' '));
document.getElementById('delBtn').addEventListener('click', borrarUno);
document.getElementById('clrBtn').addEventListener('click', ()=>{ phrase=''; renderPhrase(); });
document.getElementById('contrastBtn').addEventListener('click', e=>{
    const activo = document.body.classList.toggle('high-contrast');
    e.currentTarget.setAttribute('aria-pressed', activo ? 'true' : 'false');
});
document.getElementById('autoVoiceChk').addEventListener('change', e=> autoVoice = e.target.checked);
const showLettersChk = document.getElementById('showLettersChk');
kbcontainer.classList.toggle('show-letters', showLettersChk.checked);
showLettersChk.addEventListener('change', e=> kbcontainer.classList.toggle('show-letters', e.target.checked));

renderPhrase();

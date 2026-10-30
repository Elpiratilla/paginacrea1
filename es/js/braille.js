// braille.js
// La tabla de Braille en español, en un solo lugar.
// La usan el inicio (tu nombre), el teclado y los comentarios.
// tests/braille.test.mjs revisa cada letra contra Unicode.

// puntos levantados de cada letra
const BRAILLE_PUNTOS = {
    a:[1], b:[1,2], c:[1,4], d:[1,4,5], e:[1,5], f:[1,2,4], g:[1,2,4,5],
    h:[1,2,5], i:[2,4], j:[2,4,5], k:[1,3], l:[1,2,3], m:[1,3,4], n:[1,3,4,5],
    "ñ":[1,2,4,5,6], o:[1,3,5], p:[1,2,3,4], q:[1,2,3,4,5], r:[1,2,3,5], s:[2,3,4],
    t:[2,3,4,5], u:[1,3,6], v:[1,2,3,6], w:[2,4,5,6], x:[1,3,4,6], y:[1,3,4,5,6],
    z:[1,3,5,6], "á":[1,2,3,5,6], "é":[2,3,4,6], "í":[3,4], "ó":[3,4,6],
    "ú":[2,3,4,5,6], "ü":[1,2,5,6]
};

// los números usan las letras de la a a la j, después del signo de número
const BRAILLE_DIGITO_A_LETRA = {"1":"a","2":"b","3":"c","4":"d","5":"e","6":"f","7":"g","8":"h","9":"i","0":"j"};
const BRAILLE_SIGNO_NUMERO = [3,4,5,6];

const BRAILLE_SIGNOS = {
    ".":[2,5,6], ",":[2], "?":[2,6], "¿":[2,6], "!":[2,3,5], "¡":[2,3,5]
};

// puntos de una letra o dígito (los dígitos sin el signo de número); null si no hay
function puntosDe(caracter){
    const c = caracter.toLowerCase();
    return BRAILLE_PUNTOS[c] || BRAILLE_PUNTOS[BRAILLE_DIGITO_A_LETRA[c]] || BRAILLE_SIGNOS[c] || null;
}

// [1,2,5] -> "⠓": cada punto es un bit del bloque Unicode de Braille
function puntosAUnicode(puntos){
    let n = 0;
    puntos.forEach(function(d){ n |= 1 << (d - 1); });
    return String.fromCodePoint(0x2800 + n);
}

// "Hola 12" -> "⠓⠕⠇⠁ ⠼⠁⠃"
function textoABraille(texto){
    let resultado = "";
    let dentroDeNumero = false;
    for(const c of texto.toLowerCase()){
        const esDigito = c >= "0" && c <= "9";
        if(esDigito && !dentroDeNumero){
            resultado += puntosAUnicode(BRAILLE_SIGNO_NUMERO);
        }
        dentroDeNumero = esDigito;
        const puntos = c === " " ? null : puntosDe(c);
        resultado += puntos ? puntosAUnicode(puntos) : c;
    }
    return resultado;
}

if(typeof module !== "undefined"){
    module.exports = { BRAILLE_PUNTOS, BRAILLE_DIGITO_A_LETRA, puntosDe, puntosAUnicode, textoABraille };
}

// nombre-braille.js
// Inicio: lo que se escribe en el campo se dibuja en celdas Braille de 6 puntos.
// Sin JavaScript se ve la palabra "HOLA" que ya viene en el HTML.

// la tabla de puntos viene de braille.js (se carga antes que este archivo)
const PUNTOS_LETRA = BRAILLE_PUNTOS;

function crearLetra(letra){
    const puntos = PUNTOS_LETRA[letra];
    const caja = document.createElement("div");
    caja.className = "letra-braille";

    const celda = document.createElement("div");
    celda.className = "celda-braille";
    // los spans van en orden 1..6: la cuadrícula los acomoda en dos columnas
    for(let n = 1; n <= 6; n++){
        const punto = document.createElement("span");
        punto.className = puntos.includes(n) ? "punto lleno" : "punto";
        celda.appendChild(punto);
    }

    const nombre = document.createElement("b");
    nombre.textContent = letra.toUpperCase();
    const numeros = document.createElement("small");
    numeros.textContent = puntos.join(" ");

    caja.append(celda, nombre, numeros);
    return caja;
}

// dibuja las celdas y devuelve lo mismo dicho en palabras (para lectores de pantalla)
function dibujarNombre(texto, contenedor){
    const letras = Array.from(texto.toLowerCase())
        .filter(c => c === " " || PUNTOS_LETRA[c]);

    contenedor.textContent = "";
    letras.forEach(function(letra){
        if(letra === " "){
            const espacio = document.createElement("span");
            espacio.className = "espacio-braille";
            contenedor.appendChild(espacio);
        }else{
            contenedor.appendChild(crearLetra(letra));
        }
    });

    // la descripción sigue el idioma de la página (la versión en inglés usa este mismo archivo)
    const ingles = document.documentElement.lang === "en";
    const descripcion = letras.filter(c => c !== " ").map(function(letra){
        const puntos = PUNTOS_LETRA[letra];
        const palabra = ingles ? (puntos.length === 1 ? "dot " : "dots ") : (puntos.length === 1 ? "punto " : "puntos ");
        return letra.toUpperCase() + ", " + palabra + puntos.join(" ");
    });
    if(!descripcion.length){
        return ingles ? "Type letters to see them in Braille." : "Escribe letras para verlas en Braille.";
    }
    return texto.trim() + (ingles ? " in Braille: " : " en Braille: ") + descripcion.join(". ") + ".";
}

document.addEventListener("DOMContentLoaded", function(){
    const campo = document.getElementById("nombreBraille");
    const contenedor = document.getElementById("celdasNombre");
    const lectura = document.getElementById("lecturaNombre");
    if(!campo || !contenedor || !lectura) return;

    let espera;
    campo.addEventListener("input", function(){
        // se dibuja al instante; el aviso al lector espera a que se deje de escribir
        const texto = dibujarNombre(campo.value, contenedor);
        clearTimeout(espera);
        espera = setTimeout(function(){ lectura.textContent = texto; }, 600);
    });
    lectura.textContent = dibujarNombre(campo.value, contenedor);
});

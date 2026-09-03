// Mapa de combinaciones de puntos (1-6) a letras del alfabeto braille español.
// La numeración sigue la celda estándar:
//   1 4
//   2 5
//   3 6
const ALFABETO_BRAILLE = {
    '1': 'a', '1,2': 'b', '1,4': 'c', '1,4,5': 'd', '1,5': 'e',
    '1,2,4': 'f', '1,2,4,5': 'g', '1,2,5': 'h', '2,4': 'i', '2,4,5': 'j',
    '1,3': 'k', '1,2,3': 'l', '1,3,4': 'm', '1,3,4,5': 'n', '1,3,5': 'o',
    '1,2,3,4': 'p', '1,2,3,4,5': 'q', '1,2,3,5': 'r', '2,3,4': 's', '2,3,4,5': 't',
    '1,3,6': 'u', '1,2,3,6': 'v', '2,4,5,6': 'w', '1,3,4,6': 'x',
    '1,3,4,5,6': 'y', '1,3,5,6': 'z'
};

document.addEventListener('DOMContentLoaded', () => {
    const celda = document.getElementById('demoCelda');
    if (!celda) return;

    const puntos = celda.querySelectorAll('.punto');
    const letraEl = document.getElementById('demoLetra');
    const textoEl = document.getElementById('demoTexto');
    const limpiarBtn = document.getElementById('demoLimpiar');

    const activos = new Set();

    function actualizar() {
        if (activos.size === 0) {
            letraEl.textContent = '\u00A0';
            textoEl.textContent = 'Toca los puntos para formar una combinación. Así es como el teclado reconoce cada letra.';
            return;
        }

        const clave = Array.from(activos).sort((a, b) => a - b).join(',');
        const letra = ALFABETO_BRAILLE[clave];

        if (letra) {
            letraEl.textContent = letra.toUpperCase();
            textoEl.textContent = `Puntos ${clave} → letra "${letra}". Así funciona la escritura en braille, un carácter a la vez.`;
        } else {
            letraEl.textContent = '?';
            textoEl.textContent = `Puntos ${clave}: esta combinación no corresponde a una letra en este demo.`;
        }
    }

    puntos.forEach(punto => {
        punto.addEventListener('click', () => {
            const n = punto.dataset.punto;
            punto.classList.toggle('activo');
            if (activos.has(n)) {
                activos.delete(n);
            } else {
                activos.add(n);
            }
            actualizar();
        });
    });

    limpiarBtn.addEventListener('click', () => {
        activos.clear();
        puntos.forEach(p => p.classList.remove('activo'));
        actualizar();
    });
});
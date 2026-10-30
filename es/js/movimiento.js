// movimiento.js
// Entrada de cada sección: el título, después el texto, después la imagen,
// escalonados, una sola vez. Lo que ya está en pantalla al cargar no se toca,
// y con "reducir movimiento" no hace nada.
document.addEventListener("DOMContentLoaded", function(){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if(!("IntersectionObserver" in window)) return;

    const PIEZAS = "h2, h3, p, img, blockquote, dt, dd, li, .contenido-evento, .card, .card-flip, .estadistica, .paso, .beneficio, .letra-braille, .phrase-out, .tb-frase-braille";
    const altoPantalla = window.innerHeight;

    document.querySelectorAll("main section, .comentarios-panel, .phrase-panel").forEach(function(seccion){
        // solo la pieza de más afuera: un párrafo dentro de una tarjeta se mueve con su tarjeta
        const piezas = Array.from(seccion.querySelectorAll(PIEZAS))
            .filter(el => !el.parentElement.closest(PIEZAS) || !seccion.contains(el.parentElement.closest(PIEZAS)))
            .filter(el => el.getBoundingClientRect().top > altoPantalla);
        if(!piezas.length) return;

        piezas.forEach(function(el, i){
            el.classList.add("mov-espera");
            el.style.setProperty("--mov-retraso", Math.min(i, 8) * 0.075 + "s");
        });

        const observador = new IntersectionObserver(function(entradas){
            if(!entradas.some(e => e.isIntersecting)) return;
            piezas.forEach(el => el.classList.add("mov-listo"));
            observador.disconnect();
        }, { rootMargin: "0px 0px -12% 0px" });
        observador.observe(seccion);
    });
});

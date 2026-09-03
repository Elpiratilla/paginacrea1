// animaciones.js - efecto de aparicion suave al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(".reveal");

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
    });

    elementos.forEach((el) => observador.observe(el));
});
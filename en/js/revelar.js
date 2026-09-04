// Revela con una transición suave los elementos marcados con .revelar
// cuando entran en el viewport. No hace nada si el navegador prefiere
// menos movimiento (ya cubierto también por CSS).
document.addEventListener('DOMContentLoaded', () => {
    const elementos = document.querySelectorAll('.revelar');

    if (!('IntersectionObserver' in window) || !elementos.length) {
        elementos.forEach(el => el.classList.add('visible'));
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(el => observador.observe(el));
});
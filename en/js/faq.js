document.addEventListener('DOMContentLoaded', () => {
    const preguntas = document.querySelectorAll('.pregunta');

    preguntas.forEach(pregunta => {
        const boton = pregunta.querySelector('.pregunta-btn');
        const respuesta = pregunta.querySelector('.pregunta-respuesta');

        boton.addEventListener('click', () => {
            const yaAbierta = pregunta.classList.contains('abierta');

            // Cierra las demás para mantener la lista ordenada
            preguntas.forEach(otra => {
                otra.classList.remove('abierta');
                otra.querySelector('.pregunta-respuesta').style.maxHeight = null;
            });

            if (!yaAbierta) {
                pregunta.classList.add('abierta');
                respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
            }
        });
    });
});
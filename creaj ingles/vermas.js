document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".btn-vermas");

    botones.forEach(boton => {
        const idObjetivo = boton.dataset.target;
        const contenido = document.getElementById(idObjetivo);

        if (!contenido) return;

        boton.addEventListener("click", () => {
            const expandido = contenido.classList.toggle("expandido");
            boton.classList.toggle("activo", expandido);

            const texto = boton.querySelector(".texto-boton");
            if (texto) {
                texto.textContent = expandido ? "Ver menos" : "Ver más";
            }
        });
    });
});
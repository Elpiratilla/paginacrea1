document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('menuToggle');
    var nav = document.querySelector('header nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        nav.classList.toggle('abierto');
    });

    // cierra el menú al hacer click en un link (para que no quede abierto al navegar)
    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('abierto');
        });
    });
});
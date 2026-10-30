// comentario.js
// Zona de comentarios del teclado. Los comentarios se guardan en MySQL
// a través de comentarios.php, así todos ven los de todos.
// Necesita braille.js (textoABraille) cargado antes.

function leerEnVozAlta(texto){
    if(!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
}

function formatearFecha(iso){
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day:"2-digit", month:"short", year:"numeric" }) +
        " · " + d.toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
}

// crea un elemento con texto plano: nunca se arma HTML con lo que escribió alguien
function crear(etiqueta, clase, texto){
    const el = document.createElement(etiqueta);
    if(clase) el.className = clase;
    if(texto !== undefined) el.textContent = texto;
    return el;
}

function comentarioEl(c){
    const caja = crear("div", "comentario");

    const avatar = crear("div", "comentario-avatar");
    avatar.innerHTML = '<i class="fas fa-circle-user" aria-hidden="true"></i>';

    const cuerpo = crear("div", "comentario-body");
    const cabecera = crear("div", "comentario-cabecera");
    cabecera.append(crear("span", "comentario-autor", c.autor), crear("span", "comentario-fecha", formatearFecha(c.fecha)));

    const braille = crear("p", "comentario-braille", textoABraille(c.texto));
    braille.setAttribute("aria-hidden", "true");
    const plano = crear("p", "comentario-texto-plano", c.texto);

    const leer = crear("button", "comentario-leer");
    leer.type = "button";
    leer.innerHTML = '<i class="fas fa-volume-high" aria-hidden="true"></i> Leer';
    leer.addEventListener("click", function(){ leerEnVozAlta(c.texto); });

    cuerpo.append(cabecera, braille, plano, leer);
    caja.append(avatar, cuerpo);
    return caja;
}

function mostrarComentarios(lista, comentarios){
    lista.textContent = "";
    if(comentarios.length === 0){
        lista.append(crear("p", "sin-comentarios", "Todavía no hay comentarios. ¡Sé el primero!"));
        return;
    }
    comentarios.forEach(c => lista.append(comentarioEl(c)));
}

async function cargarComentarios(pagina, lista){
    try{
        const r = await fetch("comentarios.php?pagina=" + encodeURIComponent(pagina));
        if(!r.ok) throw new Error("HTTP " + r.status);
        const datos = await r.json();
        mostrarComentarios(lista, datos.comentarios);
    }catch(err){
        console.error("No se pudieron cargar los comentarios:", err);
        lista.textContent = "";
        lista.append(crear("p", "sin-comentarios", "No se pudieron cargar los comentarios. Recargá la página para intentar de nuevo."));
    }
}

function iniciarZonaComentarios(pagina){
    const form = document.getElementById("formComentario");
    const textarea = document.getElementById("textoComentario");
    const preview = document.getElementById("previewBraille");
    const lista = document.getElementById("listaComentarios");
    const aviso = document.getElementById("avisoComentario");
    const toggleTexto = document.getElementById("toggleTextoPlano");
    const csrf = document.querySelector('meta[name="csrf"]').content;
    if(!form || !lista) return;

    cargarComentarios(pagina, lista);

    if(toggleTexto){
        toggleTexto.addEventListener("change", function(){
            lista.classList.toggle("con-texto-plano", toggleTexto.checked);
        });
    }

    textarea.addEventListener("input", function(){
        preview.textContent = textarea.value ? textoABraille(textarea.value) : "";
    });
    // lo que se escribe acá no tiene que llegar al teclado Braille
    ["keydown", "keyup", "keypress"].forEach(function(evento){
        textarea.addEventListener(evento, function(e){ e.stopPropagation(); });
    });

    form.addEventListener("submit", async function(e){
        e.preventDefault();
        const texto = textarea.value.trim();
        if(!texto) return;
        const boton = form.querySelector("button[type=submit]");
        boton.disabled = true;
        aviso.textContent = "";

        const datos = new FormData();
        datos.append("pagina", pagina);
        datos.append("texto", texto);
        datos.append("csrf", csrf);
        try{
            const r = await fetch("comentarios.php", { method:"POST", body:datos });
            const respuesta = await r.json().catch(() => ({}));
            if(!r.ok) throw new Error(respuesta.error || "No se pudo guardar el comentario.");
            textarea.value = "";
            preview.textContent = "";
            await cargarComentarios(pagina, lista);
        }catch(err){
            aviso.textContent = err.message;
        }finally{
            boton.disabled = false;
        }
    });
}

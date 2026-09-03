/* ============================================
   comentarios.js — zona de comentarios (requiere sesión)
   los comentarios se muestran en braille, con opción de
   ver el texto en tinta y de escucharlos en voz alta.
   depende de auth.js (usa usuarioActual())
   ============================================ */

// --- tabla de braille español (grado 1) ---
// cada valor es el caracter unicode del bloque Braille Patterns (U+2800...)
const TABLA_BRAILLE = {
  "a":"⠁","b":"⠃","c":"⠉","d":"⠙","e":"⠑","f":"⠋","g":"⠛","h":"⠓","i":"⠊","j":"⠚",
  "k":"⠅","l":"⠇","m":"⠍","n":"⠝","o":"⠕","p":"⠏","q":"⠟","r":"⠗","s":"⠎","t":"⠞",
  "u":"⠥","v":"⠧","w":"⠺","x":"⠭","y":"⠽","z":"⠵",
  "ñ":"⠻",
  "á":"⠷","é":"⠮","í":"⠌","ó":"⠬","ú":"⠾",
  "1":"⠁","2":"⠃","3":"⠉","4":"⠙","5":"⠑","6":"⠋","7":"⠛","8":"⠓","9":"⠊","0":"⠚",
  ".":"⠲",",":"⠂","?":"⠢","¿":"⠢","!":"⠖","¡":"⠖",
  " ":" "
};

const SIGNO_NUMERO = "⠼";

function textoABraille(texto){
  let resultado = "";
  let dentroDeNumero = false;

  for(const charOriginal of texto.toLowerCase()){
    const esDigito = charOriginal >= "0" && charOriginal <= "9";

    if(esDigito && !dentroDeNumero){
      resultado += SIGNO_NUMERO;
      dentroDeNumero = true;
    }
    if(!esDigito){
      dentroDeNumero = false;
    }

    resultado += TABLA_BRAILLE[charOriginal] || charOriginal;
  }

  return resultado;
}

// --- lectura en voz alta ---
function leerEnVozAlta(texto){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES";
  window.speechSynthesis.speak(utterance);
}

// --- almacenamiento ---
function claveComentarios(pagina){
  return "sinlimites_comentarios_" + pagina;
}

function getComentarios(pagina){
  try{
    return JSON.parse(localStorage.getItem(claveComentarios(pagina))) || [];
  }catch(e){
    return [];
  }
}

function guardarComentarios(pagina, comentarios){
  localStorage.setItem(claveComentarios(pagina), JSON.stringify(comentarios));
}

function formatearFecha(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day:"2-digit", month:"short", year:"numeric" }) +
         " · " + d.toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
}

function escaparHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

let mostrarTextoPlano = false;

function renderComentarios(pagina){
  const lista = document.getElementById("listaComentarios");
  if(!lista) return;

  const comentarios = getComentarios(pagina).slice().reverse();

  if(comentarios.length === 0){
    lista.innerHTML = '<p class="sin-comentarios">Todavía no hay comentarios. ¡Sé el primero!</p>';
    return;
  }

  lista.innerHTML = comentarios.map(function(c){
    return (
      '<div class="comentario">' +
        '<div class="comentario-avatar"><i class="fas fa-circle-user"></i></div>' +
        '<div class="comentario-body">' +
          '<div class="comentario-cabecera">' +
            '<span class="comentario-autor">' + escaparHTML(c.autor) + '</span>' +
            '<span class="comentario-fecha">' + formatearFecha(c.fecha) + '</span>' +
          '</div>' +
          '<p class="comentario-braille" lang="es">' + textoABraille(c.texto) + '</p>' +
          '<p class="comentario-texto-plano' + (mostrarTextoPlano ? ' visible' : '') + '">' + escaparHTML(c.texto) + '</p>' +
          '<button class="comentario-leer" data-texto="' + escaparHTML(c.texto) + '">' +
            '<i class="fas fa-volume-high"></i> Leer' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");

  lista.querySelectorAll(".comentario-leer").forEach(function(btn){
    btn.addEventListener("click", function(){
      leerEnVozAlta(btn.dataset.texto);
    });
  });
}

// pagina: string que identifica en qué página estamos (ej: "teclado")
// para que cada página tenga sus propios comentarios
function iniciarZonaComentarios(pagina){
  const form = document.getElementById("formComentario");
  const textarea = document.getElementById("textoComentario");
  const preview = document.getElementById("previewBraille");
  const bloqueado = document.getElementById("comentariosBloqueado");
  const toggleTexto = document.getElementById("toggleTextoPlano");
  const usuario = usuarioActual();

  renderComentarios(pagina);

  if(toggleTexto){
    toggleTexto.addEventListener("change", function(){
      mostrarTextoPlano = toggleTexto.checked;
      renderComentarios(pagina);
    });
  }

  if(!usuario){
    if(form) form.style.display = "none";
    if(bloqueado) bloqueado.style.display = "flex";
    return;
  }

  if(form) form.style.display = "flex";
  if(bloqueado) bloqueado.style.display = "none";

  if(!form) return;

  if(textarea && preview){
    textarea.addEventListener("input", function(){
      preview.textContent = textarea.value ? textoABraille(textarea.value) : "";
    });

    // evita que teclado.js (que escucha keydown en todo el document
    // para dibujar el teclado braille físico) intercepte lo que se
    // escribe acá y bloquee el tipeo o el envío del formulario
    ["keydown", "keyup", "keypress"].forEach(function(evento){
      textarea.addEventListener(evento, function(e){
        e.stopPropagation();
      });
    });
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    e.stopPropagation();

    try{
      const texto = textarea.value.trim();
      if(!texto) return;

      const comentarios = getComentarios(pagina);
      comentarios.push({
        id: Date.now().toString(36),
        autor: usuario.nombre,
        texto: texto,
        fecha: new Date().toISOString()
      });
      guardarComentarios(pagina, comentarios);
      textarea.value = "";
      if(preview) preview.textContent = "";
      renderComentarios(pagina);
    }catch(err){
      console.error("No se pudo guardar el comentario:", err);
      alert("Hubo un problema al guardar el comentario. Revisá la consola (F12) para más detalle.");
    }
  });
}
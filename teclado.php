<?php
require "proteger_sesion.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf" content="<?= e(token_csrf()) ?>">
<title>Sin Límites</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="es/css/headerfooter.css">
<link rel="stylesheet" href="es/css/newteclado.css">
<link rel="stylesheet" href="es/css/auth.css">
<link rel="stylesheet" href="es/css/comentarios.css">

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap">
<link rel="stylesheet" href="es/css/sistema.css">
</head>
<body>
<a class="saltar" href="#contenido">Saltar al contenido</a>

  <!-- fondo de estrellitas animadas, estrellas.js las genera dentro de este div -->
  <div class="estrellas" id="estrellas"></div>

  <!-- HEADER: logo + menú de navegación, igual en todas las páginas del sitio -->
  <header>
    <div class="logo">
      <img src="es/img/Logo Crea J Sin Limites amarillosinfondo.png" alt="Logo">
      <div><p class="nombre-sitio">Sin Límites</p></div>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false">
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>
    <nav>
      <a href="es/pages/inicio.html">
        <i class="fas fa-house" aria-hidden="true"></i>
        Inicio
      </a>
      <a href="es/pages/descubrebraile.html">
        <i class="fas fa-eye" aria-hidden="true"></i>
        Descubre el Braille
      </a>
      <a href="es/pages/mas-info.html">
        <i class="fas fa-book-open" aria-hidden="true"></i>
        Historia
      </a>
      <a href="es/pages/proyecto.html">
        <i class="fas fa-diagram-project" aria-hidden="true"></i>
        Sobre nosotros
      </a>
      <a href="es/pages/contactos.html">
        <i class="fas fa-envelope" aria-hidden="true"></i>
        Contacto
      </a>
      <!-- class="activo" marca en cuál página estamos parados (le da el fondo azul) -->
      <a href="teclado.php" class="activo" aria-current="page">
        <i class="fas fa-keyboard" aria-hidden="true"></i>
        Teclado
      </a>
    </nav>
    <div id="authHeaderSlot">
      <span class="auth-saludo"><i class="fas fa-circle-user" aria-hidden="true"></i> <?= e($_SESSION["usuario_nombre"]) ?></span>
      <a class="auth-logout-btn" href="logout.php" aria-label="Cerrar sesión" title="Cerrar sesión"><i class="fas fa-right-from-bracket" aria-hidden="true"></i></a>
    </div>
  </header>

  <!-- TECLADO: teclado.js arma cada tecla dentro de #keyboard en tiempo real,
      acá en el HTML solo va la caja vacía -->
  <main id="contenido" class="teclado-pagina">
        <section class="tb-intro">
            <h1>Teclado Braille</h1>
            <p>Escribe con tu teclado o toca las teclas. Cada letra aparece como una celda de seis puntos y se lee en voz alta.</p>
        </section>
        <section class="tb-mesa" aria-label="Teclado">
            <div class="tb-ultima" id="ultimaLetra">
                <div class="tb-celda-grande" aria-hidden="true">
                    <span class="punto lleno"></span><span class="punto"></span><span class="punto"></span><span class="punto"></span><span class="punto"></span><span class="punto"></span>
                </div>
                <p class="tb-ultima-letra"><b id="ultimaNombre">A</b> <span id="ultimaPuntos">punto 1</span></p>
            </div>
            <div id="kbcontainer">
                <canvas id="particles" aria-hidden="true"></canvas>
                <div id="keyboard"></div>
            </div>
        </section>
        <section class="phrase-panel">
            <h2>Tu frase</h2>
            <div class="tb-frase-braille" id="phraseBraille" aria-hidden="true"></div>
            <p class="phrase-out" id="phraseOut" aria-live="polite">&nbsp;</p>
            <div class="phrase-btns">
                <button type="button" class="btn" id="readBtn">Leer frase</button>
                <button type="button" class="tb-boton" id="addBtn">Espacio</button>
                <button type="button" class="tb-boton" id="delBtn">Borrar</button>
                <button type="button" class="tb-boton" id="clrBtn">Limpiar</button>
                <button type="button" class="tb-boton" id="contrastBtn" aria-pressed="false">Alto contraste</button>
            </div>
            <div class="phrase-toggles">
                <label class="chk">
                    <input type="checkbox" id="autoVoiceChk" checked> Leer cada letra al escribirla
                </label>
                <label class="chk">
                    <input type="checkbox" id="showLettersChk" checked> Mostrar la letra en cada tecla
                </label>
            </div>
        </section>

  <!-- ZONA DE COMENTARIOS: requiere estar con una cuenta para poder comentar -->
  <section class="comentarios-panel">
    <h2>Comentarios</h2>
    <p class="sub">Contanos qué te pareció el teclado. Los comentarios los ven todas las personas con cuenta.</p>
    <form class="form-comentario" id="formComentario">
      <label class="solo-lector" for="textoComentario">Tu comentario</label>
      <textarea id="textoComentario" placeholder="Escribí tu comentario..." maxlength="1000" required></textarea>
      <button type="submit"><i class="fas fa-paper-plane" aria-hidden="true"></i> Comentar</button>
    </form>
    <p class="aviso-comentario" id="avisoComentario" role="alert"></p>
    <p class="preview-braille" id="previewBraille"></p>

    <label class="comentarios-toggle">
      <input type="checkbox" id="toggleTextoPlano">
      Mostrar también el texto en tinta debajo de cada comentario
    </label>

    <div class="lista-comentarios" id="listaComentarios"></div>
  </section>
  </main>

  <!-- FOOTER: igual en todas las páginas (Navegación / Recursos / Síguenos + copyright) -->
  <footer class="footer">
    <div class="contenedor">
      <div class="footer-row">
        <div class="footer-links">
          <h4>Navegación</h4>
          <ul>
            <li><a href="es/pages/inicio.html">Inicio</a></li>
            <li><a href="es/pages/descubrebraile.html">Descubre el Braille</a></li>
            <li><a href="es/pages/mas-info.html">Historia</a></li>
            <li><a href="es/pages/proyecto.html">Proyecto</a></li>
            <li><a href="es/pages/contactos.html">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Recursos</h4>
          <ul>
            <li><a href="es/pages/descubrebraile.html">¿Qué es el Braille?</a></li>
            <li><a href="es/pages/alfabeto.html">Alfabeto Braille</a></li>
            <li><a href="es/pages/mas-info.html">Historia</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-copy">
        © 2026 Sin Límites
      </div>
    </div>
  </footer>

  <script src="es/js/braille.js"></script>
  <script src="es/js/teclado.js"></script>
  <script src="es/js/estrellas.js"></script>
  <script src="es/js/menu.js"></script>
  <script src="es/js/comentario.js"></script>
  <script>
    iniciarZonaComentarios("teclado");
  </script>
<script src="es/js/movimiento.js"></script>
</body>
</html>
<?php
// conexion.php
// --- Datos de conexión ---
$host = 'localhost';
$db   = 'login2';
$user = 'root';        // cámbialo si usas otro usuario
$pass = 'root';             // cámbialo si tu MySQL tiene contraseña
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $opciones);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Iniciar sesión — Sin Límites</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="headerfooter.css">
<link rel="stylesheet" href="auth.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="auth-page">
  <div class="auth-card">

    <a href="Inicio.html" class="auth-back"><i class="fas fa-arrow-left"></i> Volver al inicio</a>

    <div class="auth-logo">
      <img src="Logo Crea J Sin Limites amarillosinfondo.png" alt="Logo">
      <h1>Sin Límites</h1>
      <span>Aprendé y practicá Braille</span>
    </div>

    <h2>Iniciar sesión</h2>
    <p class="auth-sub">Ingresá con tu cuenta para acceder al teclado y comentar.</p>

    <div class="auth-error" id="loginError"></div>

    <form class="auth-form" id="loginForm">
      <div class="auth-field">
        <label for="loginEmail">Correo electrónico</label>
        <div class="auth-input-wrap">
          <i class="fas fa-envelope"></i>
          <input type="email" id="loginEmail" placeholder="tu@correo.com" required>
        </div>
      </div>

      <div class="auth-field">
        <label for="loginPassword">Contraseña</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="loginPassword" placeholder="••••••••" required>
          <button type="button" class="toggle-pass" data-target="loginPassword"><i class="fas fa-eye"></i></button>
        </div>
      </div>

      <button type="submit" class="auth-submit">Ingresar</button>
    </form>

    <p class="auth-switch">¿No tenés cuenta? <a href="registro.html">Registrate acá</a></p>
  </div>
</div>

<script src="auth.js"></script>
<script>
  // si ya hay sesión iniciada, no tiene sentido mostrar el login
  if(usuarioActual()){
    window.location.href = "teclado.html";
  }

  document.querySelectorAll(".toggle-pass").forEach(function(btn){
    btn.addEventListener("click", function(){
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector("i");
      const esPassword = input.type === "password";
      input.type = esPassword ? "text" : "password";
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", async function(e){
    e.preventDefault();
    loginError.classList.remove("activo");

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const resultado = await iniciarSesion(email, password);

    if(!resultado.ok){
      loginError.textContent = resultado.error;
      loginError.classList.add("activo");
      return;
    }

    const destino = sessionStorage.getItem("sinlimites_redirect") || "teclado.html";
    sessionStorage.removeItem("sinlimites_redirect");
    window.location.href = destino;
  });
</script>

</body>
</html>
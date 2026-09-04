<?php
session_start();
require "conexion.php";

// si ya hay sesión iniciada, saltar directo al teclado
if (isset($_SESSION["usuario_id"])) {
    header("Location: teclado.php");
    exit;
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $correo = trim($_POST["correo"] ?? "");
    $password = $_POST["password"] ?? "";
    $ip = $_SERVER["REMOTE_ADDR"] ?? "";

    if ($correo === "" || $password === "") {
        $error = "Ingresá tu correo y contraseña.";
    } else {
        $stmt = $pdo->prepare("SELECT id, nombre, contraseña FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);
        $usuario = $stmt->fetch();

        // registrar el intento (éxito o no)
        $log = $pdo->prepare("INSERT INTO intentos_login (correo, ip) VALUES (?, ?)");
        $log->execute([$correo, $ip]);

        if (!$usuario || !password_verify($password, $usuario["contraseña"])) {
            $error = "Correo o contraseña incorrectos.";
        } else {
            $_SESSION["usuario_id"] = $usuario["id"];
            $_SESSION["usuario_nombre"] = $usuario["nombre"];
            header("Location: teclado.php");
            exit;
        }
    }
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
<link rel="stylesheet" href="es/css/headerfooter.css">
<link rel="stylesheet" href="es/css/auth.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="auth-page">
  <div class="auth-card">

    <a href="es/pages/inicio.html" class="auth-back"><i class="fas fa-arrow-left"></i> Volver al inicio</a>

    <div class="auth-logo">
      <img src="es/img/Logo Crea J Sin Limites amarillosinfondo.png" alt="Logo">
      <h1>Sin Límites</h1>
      <span>Aprendé y practicá Braille</span>
    </div>

    <h2>Iniciar sesión</h2>
    <p class="auth-sub">Ingresá con tu cuenta para acceder al teclado y comentar.</p>

    <?php if ($error): ?>
      <div class="auth-error activo"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form class="auth-form" id="loginForm" method="POST" action="Login.php">
      <div class="auth-field">
        <label for="loginCorreo">Correo electrónico</label>
        <div class="auth-input-wrap">
          <i class="fas fa-envelope"></i>
          <input type="email" id="loginCorreo" name="correo" placeholder="tu@correo.com" required>
        </div>
      </div>

      <div class="auth-field">
        <label for="loginPassword">Contraseña</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
          <button type="button" class="toggle-pass" data-target="loginPassword"><i class="fas fa-eye"></i></button>
        </div>
      </div>

      <button type="submit" class="auth-submit">Ingresar</button>
    </form>

    <p class="auth-switch">¿No tenés cuenta? <a href="registro.php">Registrate acá</a></p>
  </div>
</div>

<script>
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
</script>

</body>
</html>

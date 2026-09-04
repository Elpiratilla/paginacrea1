<?php
require "conexion.php";

$error = "";
$success = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["nombre"] ?? "");
    $correo = trim($_POST["correo"] ?? "");
    $password = $_POST["password"] ?? "";
    $password2 = $_POST["password2"] ?? "";

    if ($nombre === "" || $correo === "" || $password === "" || $password2 === "") {
        $error = "Todos los campos son obligatorios.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $error = "Correo electrónico no válido.";
    } elseif (strlen($password) < 6) {
        $error = "La contraseña debe tener al menos 6 caracteres.";
    } elseif ($password !== $password2) {
        $error = "Las contraseñas no coinciden.";
    } else {
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);

        if ($stmt->fetch()) {
            $error = "Ese correo ya está registrado.";
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt2 = $pdo->prepare(
                "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)"
            );

            try {
                $stmt2->execute([$nombre, $correo, $hash]);
                $success = "Cuenta creada. Ya podés iniciar sesión.";
            } catch (PDOException $e) {
                $error = "Ocurrió un error al crear la cuenta. Intentá de nuevo.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crear cuenta — Sin Límites</title>
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

    <h2>Crear cuenta</h2>
    <p class="auth-sub">Registrate para usar el teclado y dejar comentarios.</p>

    <?php if ($error): ?>
      <div class="auth-error activo"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <?php if ($success): ?>
      <div class="auth-success activo"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>

    <form class="auth-form" id="regForm" method="POST" action="registro.php">
      <div class="auth-field">
        <label for="regNombre">Nombre</label>
        <div class="auth-input-wrap">
          <i class="fas fa-user"></i>
          <input type="text" id="regNombre" name="nombre" placeholder="Tu nombre" required maxlength="25">
        </div>
      </div>

      <div class="auth-field">
        <label for="regCorreo">Correo electrónico</label>
        <div class="auth-input-wrap">
          <i class="fas fa-envelope"></i>
          <input type="email" id="regCorreo" name="correo" placeholder="tu@correo.com" required maxlength="45">
        </div>
      </div>

      <div class="auth-field">
        <label for="regPassword">Contraseña</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="regPassword" name="password" placeholder="Mínimo 6 caracteres" required minlength="6">
          <button type="button" class="toggle-pass" data-target="regPassword"><i class="fas fa-eye"></i></button>
        </div>
      </div>

      <div class="auth-field">
        <label for="regPassword2">Confirmar contraseña</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="regPassword2" name="password2" placeholder="Repetí la contraseña" required minlength="6">
          <button type="button" class="toggle-pass" data-target="regPassword2"><i class="fas fa-eye"></i></button>
        </div>
      </div>

      <button type="submit" class="auth-submit">Crear cuenta</button>
    </form>

    <p class="auth-switch">¿Ya tenés cuenta? <a href="Login.php">Iniciá sesión</a></p>
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

  <?php if ($success): ?>
  setTimeout(function(){
    window.location.href = "Login.php";
  }, 1200);
  <?php endif; ?>
</script>

</body>
</html>

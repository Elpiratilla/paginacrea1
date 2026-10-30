<?php
// logout.php
// Borra la sesión del servidor y la cookie del navegador, y vuelve al inicio.
require_once __DIR__ . '/seguridad.php';

$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 3600, $p["path"], $p["domain"], $p["secure"], $p["httponly"]);
}
session_destroy();
header("Location: es/pages/inicio.html");
exit;

<?php
// logout.php
// Destruye la sesión del servidor y manda de vuelta al inicio.
session_start();
$_SESSION = [];
session_destroy();
header("Location: Inicio.html");
exit;

<?php
// proteger_sesion.php
// Ponelo con require AL INICIO de cada página que requiera estar logueado.
require_once __DIR__ . '/seguridad.php';

if (!isset($_SESSION["usuario_id"])) {
    header("Location: Login.php");
    exit;
}

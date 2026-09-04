<?php
// proteger_sesion.php
// Poné esto AL INICIO de teclado.php (y de cualquier página que
// requiera estar logueado), antes de cualquier HTML.
session_start();

if (!isset($_SESSION["usuario_id"])) {
    header("Location: Login.php");
    exit;
}

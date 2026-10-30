<?php
// conexion.php
// Los datos de acceso salen de config.local.php (no se sube a git).
$archivoConfig = __DIR__ . '/config.local.php';
if (!file_exists($archivoConfig)) {
    $archivoConfig = __DIR__ . '/config.example.php';
}
$config = require $archivoConfig;

$dsn = "mysql:host={$config['host']};dbname={$config['db']};charset=utf8mb4";
$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $config['user'], $config['pass'], $opciones);
} catch (PDOException $e) {
    // el detalle va al registro del servidor, nunca a la pantalla del visitante
    error_log("Error de conexión: " . $e->getMessage());
    http_response_code(500);
    die("No se pudo conectar con la base de datos. Intentá más tarde.");
}

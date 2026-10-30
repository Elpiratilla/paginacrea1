<?php
// seguridad.php
// Sesión, token contra formularios falsos (CSRF) y escape de texto.
// Se incluye al principio de cada página PHP, antes de cualquier HTML.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// token secreto por sesión: un formulario que no lo trae no salió de este sitio
function token_csrf(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_valido($token): bool
{
    return is_string($token) && hash_equals(token_csrf(), $token);
}

// texto seguro para poner dentro de HTML (también dentro de atributos)
function e(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
}

<?php
// comentarios.php
// GET  ?pagina=teclado          -> lista de comentarios (JSON)
// POST pagina, texto, csrf      -> guarda un comentario (requiere sesión)
require_once __DIR__ . '/seguridad.php';
require __DIR__ . '/conexion.php';

header('Content-Type: application/json; charset=utf-8');

const PAGINAS = ['teclado'];
const LARGO_MAXIMO = 1000;

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$pagina = $_SERVER['REQUEST_METHOD'] === 'POST' ? ($_POST['pagina'] ?? '') : ($_GET['pagina'] ?? '');
if (!in_array($pagina, PAGINAS, true)) {
    responder(400, ['error' => 'Página desconocida.']);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare(
        "SELECT c.id, u.nombre AS autor, c.texto, c.creado_en
         FROM comentarios c JOIN usuarios u ON u.id = c.usuario_id
         WHERE c.pagina = ?
         ORDER BY c.creado_en DESC, c.id DESC
         LIMIT 100"
    );
    $stmt->execute([$pagina]);
    $lista = array_map(function ($fila) {
        return [
            'id'    => (int) $fila['id'],
            'autor' => $fila['autor'],
            'texto' => $fila['texto'],
            // fecha ISO: JavaScript la entiende igual en todos los navegadores
            'fecha' => date('c', strtotime($fila['creado_en'])),
        ];
    }, $stmt->fetchAll());
    responder(200, ['comentarios' => $lista]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['usuario_id'])) {
        responder(401, ['error' => 'Iniciá sesión para comentar.']);
    }
    if (!csrf_valido($_POST['csrf'] ?? null)) {
        responder(403, ['error' => 'La página venció. Recargala e intentá de nuevo.']);
    }
    $texto = trim($_POST['texto'] ?? '');
    if ($texto === '') {
        responder(422, ['error' => 'El comentario está vacío.']);
    }
    if (mb_strlen($texto) > LARGO_MAXIMO) {
        responder(422, ['error' => 'El comentario puede tener hasta ' . LARGO_MAXIMO . ' caracteres.']);
    }
    $pdo->prepare("INSERT INTO comentarios (usuario_id, pagina, texto) VALUES (?, ?, ?)")
        ->execute([$_SESSION['usuario_id'], $pagina, $texto]);
    responder(201, ['ok' => true]);
}

responder(405, ['error' => 'Método no permitido.']);

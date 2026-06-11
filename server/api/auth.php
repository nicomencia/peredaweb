<?php
// Admin session auth: POST {action: login|logout|check, email?, password?}
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

$body = read_json_body();
$action = $body['action'] ?? '';

start_session();

switch ($action) {
    case 'login':
        $email = trim($body['email'] ?? '');
        $password = $body['password'] ?? '';
        if ($email === '' || $password === '') {
            json_error('Email y contraseña obligatorios', 400);
        }
        // Small fixed delay blunts brute-force attempts on shared hosting
        // where fancier rate limiting isn't available.
        usleep(300000);
        $stmt = db()->prepare('SELECT id, password_hash FROM admin_users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_error('Credenciales incorrectas', 401);
        }
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $user['id'];
        json_out(['success' => true]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        json_out(['success' => true]);

    case 'check':
        json_out(['authenticated' => !empty($_SESSION['admin_id'])]);

    default:
        json_error('Acción no válida', 400);
}

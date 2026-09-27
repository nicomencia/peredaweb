<?php
// Admin session auth: POST {action: login|logout|check|change_password, …}
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
        // 10 failed logins per IP per hour, plus a small fixed delay per attempt.
        if (too_many_failures('login', 10)) {
            json_error('Demasiados intentos fallidos. Vuelve a intentarlo en una hora.', 429);
        }
        usleep(300000);
        $stmt = db()->prepare('SELECT id, password_hash FROM admin_users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            record_failure('login');
            json_error('Credenciales incorrectas', 401);
        }
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $user['id'];
        json_out(['success' => true]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        json_out(['success' => true]);

    case 'change_password': {
        if (empty($_SESSION['admin_id'])) json_error('No autorizado', 401);
        $current = $body['current_password'] ?? '';
        $new = $body['new_password'] ?? '';
        if (mb_strlen($new) < 12) json_error('La nueva contraseña debe tener al menos 12 caracteres', 400);
        // Guessing the current password from a hijacked session counts as failed logins.
        if (too_many_failures('login', 10)) {
            json_error('Demasiados intentos fallidos. Vuelve a intentarlo en una hora.', 429);
        }
        $stmt = db()->prepare('SELECT password_hash FROM admin_users WHERE id = ?');
        $stmt->execute([$_SESSION['admin_id']]);
        $hash = $stmt->fetchColumn();
        if ($hash === false || !password_verify($current, $hash)) {
            record_failure('login');
            json_error('La contraseña actual no es correcta', 401);
        }
        db()->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($new, PASSWORD_BCRYPT), $_SESSION['admin_id']]);
        session_regenerate_id(true);
        json_out(['success' => true]);
    }

    case 'check':
        json_out(['authenticated' => !empty($_SESSION['admin_id'])]);

    default:
        json_error('Acción no válida', 400);
}

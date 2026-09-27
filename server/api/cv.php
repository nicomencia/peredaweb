<?php
// Admin-only CV download. .htaccess rewrites every /media/cvs/<file>.pdf here, so a
// candidate's PDF (personal data) is never served without an admin session; the
// links in older notification emails keep working for a logged-in admin.
require_once __DIR__ . '/db.php';

start_session();
if (empty($_SESSION['admin_id'])) {
    http_response_code(401);
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex');
    echo '<p style="font-family:Arial,sans-serif">Este archivo solo está disponible para administradores. '
        . '<a href="/admin">Inicia sesión</a> y vuelve a abrir el enlace.</p>';
    exit;
}

$name = basename((string) ($_GET['f'] ?? ''));
$path = dirname(__DIR__) . '/media/cvs/' . $name;
if (!preg_match('/^[A-Za-z0-9_]+\.pdf$/', $name) || !is_file($path)) {
    json_error('No encontrado', 404);
}

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $name . '"');
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, no-store');
header('X-Robots-Tag: noindex');
readfile($path);

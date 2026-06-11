<?php
// Admin image upload (session-protected). Files land in ../media/<folder>/
// and the public URL is returned. The frontend resizes to WebP before
// uploading, so this only validates and stores.
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

require_admin();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_error('Fichero no recibido', 400);
}

$folder = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $_POST['folder'] ?? 'uploads');
$folder = trim($folder, '/');
if ($folder === '' || str_contains($folder, '..')) $folder = 'uploads';

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
finfo_close($finfo);
if (!isset($allowed[$mime])) {
    json_error('Tipo de fichero no permitido: ' . $mime, 400);
}
if ($_FILES['file']['size'] > 10 * 1024 * 1024) {
    json_error('Fichero demasiado grande (máx 10MB)', 400);
}

$dir = dirname(__DIR__) . '/media/' . $folder;
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    json_error('No se pudo crear el directorio', 500);
}

$name = time() . '_' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
if (!move_uploaded_file($_FILES['file']['tmp_name'], "$dir/$name")) {
    json_error('No se pudo guardar el fichero', 500);
}

json_out(['success' => true, 'url' => "/media/$folder/$name"]);

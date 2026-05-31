<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Upload-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$UPLOAD_TOKEN = getenv('UPLOAD_TOKEN') ?: 'CHANGE_THIS_TO_A_SECURE_TOKEN';

$token = $_SERVER['HTTP_X_UPLOAD_TOKEN'] ?? '';
if ($token !== $UPLOAD_TOKEN) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

$folder = isset($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $_POST['folder']) : 'uploads';

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $_FILES['file']['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'File type not allowed: ' . $mimeType]);
    exit;
}

$maxSize = 10 * 1024 * 1024;
if ($_FILES['file']['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large (max 10MB)']);
    exit;
}

$uploadDir = dirname(__DIR__) . '/media/' . $folder;
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['error' => 'Extension not allowed']);
    exit;
}

$fileName = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$filePath = $uploadDir . '/' . $fileName;

if (!move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . '://' . $host . '/media/' . $folder . '/' . $fileName;

echo json_encode([
    'success' => true,
    'url' => $publicUrl,
    'path' => '/media/' . $folder . '/' . $fileName,
]);

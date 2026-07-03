<?php
require_once __DIR__ . '/config.php';

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
    return $pdo;
}

function json_out($body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status): never {
    json_out(['error' => $message], $status);
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function uuid4(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

function start_session(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        ]);
        session_name('peredaweb_admin');
        session_start();
    }
}

function require_admin(): void {
    start_session();
    if (empty($_SESSION['admin_id'])) {
        json_error('No autorizado', 401);
    }
}

// Columns the API may read/write per table. Identifiers are never taken from
// user input directly — always validated against this map.
const TABLE_COLUMNS = [
    'brands' => ['id', 'name', 'logo_url', 'category', 'display_order', 'created_at'],
    'ambientes' => ['id', 'title', 'summary', 'description', 'cover_image_url', 'specs', 'display_order', 'created_at'],
    'ambiente_photos' => ['id', 'ambiente_id', 'image_url', 'caption', 'display_order', 'created_at'],
    'tiendas' => ['id', 'name', 'address', 'postal_code', 'phone', 'hours_tienda', 'hours_fontaneria', 'hours_sabados', 'hours_verano', 'emails', 'lat', 'lon', 'cover_image_url', 'display_order', 'created_at'],
    'tienda_photos' => ['id', 'tienda_id', 'image_url', 'display_order', 'created_at'],
    'site_settings' => ['id', 'key', 'value', 'updated_at'],
    'denuncias' => ['id', 'pin', 'hechos', 'seccion_lugar', 'vinculacion', 'personas_involucradas', 'momento', 'documentos_info', 'estado', 'respuesta', 'created_at', 'updated_at'],
    'job_applications' => ['id', 'nombre', 'email', 'telefono', 'mensaje', 'cv_url', 'created_at'],
    'presupuesto_requests' => ['id', 'nombre', 'localidad', 'email', 'asunto', 'mensaje', 'created_at'],
    'cliente_requests' => ['id', 'nombre', 'empresa', 'cif', 'localidad', 'telefono', 'email', 'actividad', 'mensaje', 'created_at'],
    'desistimiento_requests' => ['id', 'nombre', 'pedido', 'email', 'created_at'],
];

// JSON-typed columns that must be decoded when reading / encoded when writing.
const JSON_COLUMNS = [
    'ambientes' => ['specs'],
    'tiendas' => ['emails'],
];

function decode_json_columns(string $table, array $rows): array {
    $cols = JSON_COLUMNS[$table] ?? [];
    if (!$cols) return $rows;
    foreach ($rows as &$row) {
        foreach ($cols as $col) {
            if (isset($row[$col]) && is_string($row[$col])) {
                $row[$col] = json_decode($row[$col], true) ?? [];
            }
        }
    }
    return $rows;
}

<?php
// Public read-only content endpoint: GET content.php?resource=<table>
// Returns every row of the requested table; the frontend filters/sorts.
require_once __DIR__ . '/db.php';

const PUBLIC_TABLES = [
    'products', 'product_photos', 'brands',
    'ambientes', 'ambiente_photos',
    'tiendas', 'tienda_photos', 'site_settings',
];

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Método no permitido', 405);
}

$resource = $_GET['resource'] ?? '';
if (!in_array($resource, PUBLIC_TABLES, true)) {
    json_error('Recurso no válido', 400);
}

try {
    $rows = db()->query("SELECT * FROM `$resource`")->fetchAll();
    // Never expose confidential settings (e.g. form recipient addresses) publicly.
    if ($resource === 'site_settings') {
        $rows = array_values(array_filter($rows, fn($r) => !str_starts_with($r['key'], 'mail_to_')));
    }
    json_out(decode_json_columns($resource, $rows));
} catch (PDOException $e) {
    json_error('Error de base de datos', 500);
}

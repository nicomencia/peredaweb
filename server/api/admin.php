<?php
// Session-protected CRUD: POST {action: insert|update|delete|upsert_setting,
// resource, data?, id?}. Identifiers are validated against TABLE_COLUMNS;
// values always go through prepared statements.
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

require_admin();

$body = read_json_body();
$action = $body['action'] ?? '';
$resource = $body['resource'] ?? '';

if (!isset(TABLE_COLUMNS[$resource])) {
    json_error('Recurso no válido', 400);
}
$allowed = TABLE_COLUMNS[$resource];
$jsonCols = JSON_COLUMNS[$resource] ?? [];

function filter_data(array $data, array $allowed, array $jsonCols): array {
    $out = [];
    foreach ($data as $col => $value) {
        if (!in_array($col, $allowed, true) || $col === 'id' || $col === 'created_at' || $col === 'updated_at') continue;
        if (in_array($col, $jsonCols, true)) {
            $value = json_encode($value ?? [], JSON_UNESCAPED_UNICODE);
        } elseif (is_bool($value)) {
            $value = $value ? 1 : 0;
        }
        $out[$col] = $value;
    }
    return $out;
}

try {
    switch ($action) {
        case 'insert': {
            $data = filter_data($body['data'] ?? [], $allowed, $jsonCols);
            if (!$data) json_error('Sin datos', 400);
            $data['id'] = uuid4();
            $cols = implode(', ', array_map(fn($c) => "`$c`", array_keys($data)));
            $marks = implode(', ', array_fill(0, count($data), '?'));
            db()->prepare("INSERT INTO `$resource` ($cols) VALUES ($marks)")
                ->execute(array_values($data));
            $stmt = db()->prepare("SELECT * FROM `$resource` WHERE id = ?");
            $stmt->execute([$data['id']]);
            json_out(decode_json_columns($resource, [$stmt->fetch()])[0], 201);
        }

        case 'update': {
            $id = $body['id'] ?? '';
            $data = filter_data($body['data'] ?? [], $allowed, $jsonCols);
            if ($id === '' || !$data) json_error('Faltan id o datos', 400);
            $sets = implode(', ', array_map(fn($c) => "`$c` = ?", array_keys($data)));
            $params = array_values($data);
            $params[] = $id;
            db()->prepare("UPDATE `$resource` SET $sets WHERE id = ?")->execute($params);
            $stmt = db()->prepare("SELECT * FROM `$resource` WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) json_error('No encontrado', 404);
            json_out(decode_json_columns($resource, [$row])[0]);
        }

        case 'delete': {
            $id = $body['id'] ?? '';
            if ($id === '') json_error('Falta id', 400);
            db()->prepare("DELETE FROM `$resource` WHERE id = ?")->execute([$id]);
            json_out(['success' => true]);
        }

        case 'upsert_setting': {
            if ($resource !== 'site_settings') json_error('Solo para site_settings', 400);
            $key = $body['data']['key'] ?? '';
            $value = $body['data']['value'] ?? '';
            if ($key === '') json_error('Falta key', 400);
            db()->prepare(
                'INSERT INTO site_settings (id, `key`, value) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE value = VALUES(value)'
            )->execute([uuid4(), $key, $value]);
            json_out(['success' => true]);
        }

        default:
            json_error('Acción no válida', 400);
    }
} catch (PDOException $e) {
    json_error('Error de base de datos', 500);
}

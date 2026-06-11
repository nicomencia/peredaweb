<?php
// ONE-TIME setup: creates tables, imports migration-data JSON, creates the
// admin user. Protected by SETUP_TOKEN (config.php). DELETE THIS FILE (and
// api/import/) from the server after a successful run.
//
// POST setup.php  {token, admin_email, admin_password}
// Expects: ../sql/schema.sql and ./import/<table>.json uploaded via SFTP.
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

$body = read_json_body();
if (!defined('SETUP_TOKEN') || SETUP_TOKEN === '' || ($body['token'] ?? '') !== SETUP_TOKEN) {
    json_error('No autorizado', 403);
}

const SUPABASE_STORAGE_PREFIX = '/storage/v1/object/public/';

function rewrite_storage_urls(?string $value): ?string {
    if (!is_string($value)) return $value;
    return preg_replace(
        '~https?://[a-z0-9]+\.supabase\.co' . preg_quote(SUPABASE_STORAGE_PREFIX, '~') . '~',
        '/media/',
        $value
    );
}

function to_mysql_datetime(?string $iso): ?string {
    if (!$iso) return null;
    try {
        return (new DateTime($iso))->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
    } catch (Exception) {
        return null;
    }
}

$report = [];

try {
    $pdo = db();

    // 1. Schema
    $schema = file_get_contents(dirname(__DIR__) . '/sql/schema.sql');
    if ($schema === false) json_error('No se encuentra schema.sql', 500);
    $pdo->exec($schema);
    $report['schema'] = 'ok';

    // 2. Data (FK parents before children)
    $order = [
        'products', 'product_photos', 'brands', 'ambientes', 'ambiente_photos',
        'tiendas', 'tienda_photos', 'site_settings',
        'denuncias', 'job_applications', 'presupuesto_requests', 'cliente_requests',
    ];
    foreach ($order as $table) {
        $file = __DIR__ . "/import/$table.json";
        if (!is_file($file)) { $report[$table] = 'no file'; continue; }
        $rows = json_decode(file_get_contents($file), true);
        if (!is_array($rows) || !$rows) { $report[$table] = '0 rows'; continue; }

        $jsonCols = JSON_COLUMNS[$table] ?? [];
        $count = 0;
        foreach ($rows as $row) {
            $data = [];
            foreach (TABLE_COLUMNS[$table] as $col) {
                if (!array_key_exists($col, $row)) continue;
                $value = $row[$col];
                if (in_array($col, $jsonCols, true)) {
                    $value = json_encode($value ?? [], JSON_UNESCAPED_UNICODE);
                } elseif (is_bool($value)) {
                    $value = $value ? 1 : 0;
                } elseif (in_array($col, ['created_at', 'updated_at'], true)) {
                    $value = to_mysql_datetime($value);
                } else {
                    $value = rewrite_storage_urls($value);
                }
                $data[$col] = $value;
            }
            if (empty($data['id'])) continue;
            $cols = implode(', ', array_map(fn($c) => "`$c`", array_keys($data)));
            $marks = implode(', ', array_fill(0, count($data), '?'));
            $pdo->prepare("REPLACE INTO `$table` ($cols) VALUES ($marks)")
                ->execute(array_values($data));
            $count++;
        }
        $report[$table] = "$count rows";
    }

    // 3. Admin user
    $email = trim($body['admin_email'] ?? '');
    $password = $body['admin_password'] ?? '';
    if ($email !== '' && $password !== '') {
        $pdo->prepare(
            'INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
        )->execute([uuid4(), $email, password_hash($password, PASSWORD_BCRYPT)]);
        $report['admin_user'] = $email;
    }

    json_out(['success' => true, 'report' => $report]);
} catch (PDOException $e) {
    json_out(['error' => 'DB: ' . $e->getMessage()], 500);
}

<?php
// Public form endpoints, replacing the Supabase Edge Functions.
// POST forms.php?form=candidatura   (multipart: nombre, email, telefono, mensaje, cv[pdf])
// POST forms.php?form=denuncia      (json) -> returns generated PIN
// GET  forms.php?form=denuncia&pin= -> complaint status lookup
// POST forms.php?form=presupuesto   (json)
// POST forms.php?form=cliente       (json)
require_once __DIR__ . '/db.php';

function send_email(string $subject, string $html, ?string $replyTo = null): void {
    if (!defined('RESEND_API_KEY') || RESEND_API_KEY === '' || RESEND_API_KEY === 'CHANGE_ME') return;
    $payload = [
        'from' => MAIL_FROM,
        'to' => [MAIL_TO],
        'subject' => $subject,
        'html' => $html,
    ];
    if ($replyTo) $payload['reply_to'] = $replyTo;
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($status >= 400) {
        error_log("Resend error $status: $res");
    }
}

function field_rows(array $fields): string {
    $rows = '';
    $i = 0;
    foreach ($fields as $label => $value) {
        $bg = ($i++ % 2) ? ' style="background:#f9f9f9;"' : '';
        $v = htmlspecialchars($value !== '' ? $value : '—');
        $rows .= "<tr$bg><td style=\"padding:8px 12px;font-weight:bold;color:#555;width:140px;\">$label:</td><td style=\"padding:8px 12px;\">$v</td></tr>";
    }
    return $rows;
}

function notification_html(string $title, array $fields, string $extra = ''): string {
    return '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">'
        . '<h2 style="color:#333;border-bottom:2px solid #e0e0e0;padding-bottom:10px;">' . htmlspecialchars($title) . '</h2>'
        . '<table style="width:100%;border-collapse:collapse;margin-top:16px;">' . field_rows($fields) . '</table>'
        . $extra
        . '<p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px;">'
        . 'Este email se ha generado automáticamente desde la web.</p></div>';
}

$form = $_GET['form'] ?? '';

try {
    if ($form === 'denuncia' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $pin = trim($_GET['pin'] ?? '');
        if ($pin === '') json_error('Falta el PIN', 400);
        $stmt = db()->prepare('SELECT estado, respuesta, created_at FROM denuncias WHERE pin = ?');
        $stmt->execute([$pin]);
        $row = $stmt->fetch();
        if (!$row) json_error('PIN no encontrado', 404);
        json_out($row);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('Método no permitido', 405);
    }

    switch ($form) {
        case 'candidatura': {
            $nombre = trim($_POST['nombre'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $telefono = trim($_POST['telefono'] ?? '');
            $mensaje = trim($_POST['mensaje'] ?? '');
            if ($nombre === '') json_error('El nombre es obligatorio', 400);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('El formato del email no es válido', 400);

            $cvUrl = '';
            if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK && $_FILES['cv']['size'] > 0) {
                if ($_FILES['cv']['size'] > 5 * 1024 * 1024) json_error('El archivo no puede superar 5 MB', 400);
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($finfo, $_FILES['cv']['tmp_name']);
                finfo_close($finfo);
                if ($mime !== 'application/pdf') json_error('Solo se permiten archivos PDF', 400);
                $dir = dirname(__DIR__) . '/media/cvs';
                if (!is_dir($dir) && !mkdir($dir, 0755, true)) json_error('Error al subir el archivo', 500);
                $safe = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $nombre));
                $name = $safe . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.pdf';
                if (!move_uploaded_file($_FILES['cv']['tmp_name'], "$dir/$name")) json_error('Error al subir el archivo', 500);
                $cvUrl = "/media/cvs/$name";
            }

            db()->prepare('INSERT INTO job_applications (id, nombre, email, telefono, mensaje, cv_url) VALUES (?, ?, ?, ?, ?, ?)')
                ->execute([uuid4(), $nombre, $email, $telefono, $mensaje, $cvUrl]);

            $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $cvLink = $cvUrl
                ? '<p><strong>CV:</strong> <a href="' . $proto . '://' . $_SERVER['HTTP_HOST'] . $cvUrl . '">Descargar PDF</a></p>'
                : '<p><strong>CV:</strong> No adjuntado</p>';
            send_email("Nueva candidatura: $nombre", notification_html('Nueva candidatura recibida', [
                'Nombre' => $nombre, 'Email' => $email, 'Teléfono' => $telefono, 'Mensaje' => $mensaje,
            ], $cvLink), $email);
            json_out(['success' => true], 201);
        }

        case 'denuncia': {
            $b = read_json_body();
            $hechos = trim($b['hechos'] ?? '');
            if ($hechos === '') json_error('La descripción de los hechos es obligatoria', 400);
            $pin = str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
            db()->prepare('INSERT INTO denuncias (id, pin, hechos, seccion_lugar, vinculacion, personas_involucradas, momento, documentos_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([
                    uuid4(), $pin, $hechos,
                    trim($b['seccion_lugar'] ?? ''), trim($b['vinculacion'] ?? ''),
                    trim($b['personas_involucradas'] ?? ''), trim($b['momento'] ?? ''),
                    trim($b['documentos_info'] ?? ''),
                ]);
            send_email('Nueva denuncia recibida', notification_html('Nueva denuncia recibida', [
                'Sección/Lugar' => trim($b['seccion_lugar'] ?? ''),
                'Vinculación' => trim($b['vinculacion'] ?? ''),
            ], '<p>Accede al panel para ver el contenido completo.</p>'));
            json_out(['success' => true, 'pin' => $pin], 201);
        }

        case 'presupuesto': {
            $b = read_json_body();
            $nombre = trim($b['nombre'] ?? '');
            $email = trim($b['email'] ?? '');
            if ($nombre === '') json_error('El nombre es obligatorio', 400);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('El formato del email no es válido', 400);
            db()->prepare('INSERT INTO presupuesto_requests (id, nombre, localidad, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?, ?)')
                ->execute([uuid4(), $nombre, trim($b['localidad'] ?? ''), $email, trim($b['asunto'] ?? ''), trim($b['mensaje'] ?? '')]);
            send_email("Nueva solicitud de presupuesto: $nombre", notification_html('Nueva solicitud de presupuesto', [
                'Nombre' => $nombre, 'Localidad' => trim($b['localidad'] ?? ''), 'Email' => $email,
                'Asunto' => trim($b['asunto'] ?? ''), 'Mensaje' => trim($b['mensaje'] ?? ''),
            ]), $email);
            json_out(['success' => true], 201);
        }

        case 'cliente': {
            $b = read_json_body();
            $nombre = trim($b['nombre'] ?? '');
            $email = trim($b['email'] ?? '');
            if ($nombre === '') json_error('El nombre es obligatorio', 400);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('El formato del email no es válido', 400);
            db()->prepare('INSERT INTO cliente_requests (id, nombre, empresa, cif, localidad, telefono, email, actividad, mensaje) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([
                    uuid4(), $nombre, trim($b['empresa'] ?? ''), trim($b['cif'] ?? ''),
                    trim($b['localidad'] ?? ''), trim($b['telefono'] ?? ''), $email,
                    trim($b['actividad'] ?? ''), trim($b['mensaje'] ?? ''),
                ]);
            send_email("Nueva solicitud de cliente: $nombre", notification_html('Nueva solicitud para hacerse cliente', [
                'Nombre' => $nombre, 'Empresa' => trim($b['empresa'] ?? ''), 'CIF' => trim($b['cif'] ?? ''),
                'Localidad' => trim($b['localidad'] ?? ''), 'Teléfono' => trim($b['telefono'] ?? ''),
                'Email' => $email, 'Actividad' => trim($b['actividad'] ?? ''), 'Mensaje' => trim($b['mensaje'] ?? ''),
            ]), $email);
            json_out(['success' => true], 201);
        }

        default:
            json_error('Formulario no válido', 400);
    }
} catch (PDOException $e) {
    json_error('Error de base de datos', 500);
}

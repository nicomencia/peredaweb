<?php
// Front controller for the SPA. Two jobs, so crawlers/social get real per-page
// metadata even though the app renders client-side:
//   1. /sitemap.xml  -> generated from the route list (using the live host).
//   2. any route     -> serves index.html with <title>/description/og:* swapped
//                       to that route's values. Falls back to the raw shell.
// Static files (assets, media, robots.txt) are served directly by Apache and
// never reach this script (see .htaccess).

$dir = __DIR__;
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = $path === '/' ? '/' : '/' . trim($path, '/');

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'www.saneamientos-pereda.com';
$origin = "$scheme://$host";

// Public, indexable routes.
$ROUTES = [
    '/', '/productos', '/quienes-somos', '/inspirate', '/instalaciones',
    '/area-profesional', '/pide-cita', '/financiacion', '/presupuesto',
    '/hazte-cliente', '/canal-denuncias',
    '/aviso-legal', '/politica-privacidad', '/politica-cookies', '/condiciones-venta',
];

// ---- Dynamic robots.txt (Sitemap line uses the live host) ----
if ($path === '/robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo "User-agent: *\nAllow: /\n\nSitemap: $origin/sitemap.xml\n";
    exit;
}

// ---- Dynamic sitemap ----
if ($path === '/sitemap.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($ROUTES as $r) {
        echo '  <url><loc>' . htmlspecialchars($origin . ($r === '/' ? '/' : $r)) . "</loc></url>\n";
    }
    echo "</urlset>\n";
    exit;
}

// ---- Per-route metadata (title, description) ----
$DEFAULT = ['Saneamientos Pereda', 'Saneamientos Pereda: especialistas en baño, fontanería y materiales de construcción en Oviedo. Productos, ambientes, tiendas y presupuesto sin compromiso.'];
$META = [
    '/' => $DEFAULT,
    '/productos' => ['Productos | Saneamientos Pereda', 'Catálogo de Saneamientos Pereda: sanitarios, grifería, muebles de baño, cerámica, fontanería, climatización y materiales de construcción.'],
    '/quienes-somos' => ['Quiénes somos | Saneamientos Pereda', 'Empresa familiar de Oviedo fundada en 1959. Más de 50 años equipando baños y proyectos con calidad y asesoramiento profesional.'],
    '/inspirate' => ['Inspírate | Saneamientos Pereda', 'Inspírate con nuestros ambientes de baño: cerámica, mobiliario y decoración seleccionados por Saneamientos Pereda.'],
    '/instalaciones' => ['Instalaciones | Saneamientos Pereda', 'Nuestras tiendas en Oviedo, Pruvia y Gijón: direcciones, horarios y contacto de Saneamientos Pereda.'],
    '/area-profesional' => ['Área profesional | Saneamientos Pereda', 'Área profesional de Saneamientos Pereda: ventajas, stock y ecommerce para instaladores y profesionales.'],
    '/pide-cita' => ['Pide cita | Saneamientos Pereda', 'Pide cita previa en Saneamientos Pereda y recibe atención personalizada para tu proyecto de reforma.'],
    '/financiacion' => ['Financiación | Saneamientos Pereda', 'Financiación al 0% de interés en Saneamientos Pereda: fracciona tu compra hasta en 24 meses.'],
    '/presupuesto' => ['Presupuesto | Saneamientos Pereda', 'Solicita presupuesto sin compromiso a Saneamientos Pereda para tu proyecto de baño o reforma.'],
    '/hazte-cliente' => ['Hazte cliente | Saneamientos Pereda', 'Hazte cliente profesional de Saneamientos Pereda y accede a condiciones y ventajas exclusivas.'],
    '/canal-denuncias' => ['Canal de denuncias | Saneamientos Pereda', 'Canal de denuncias de Saneamientos Pereda. Comunica de forma confidencial y consulta el estado con tu PIN.'],
    '/aviso-legal' => ['Aviso legal | Saneamientos Pereda', $DEFAULT[1]],
    '/politica-privacidad' => ['Política de privacidad | Saneamientos Pereda', $DEFAULT[1]],
    '/politica-cookies' => ['Política de cookies | Saneamientos Pereda', $DEFAULT[1]],
    '/condiciones-venta' => ['Condiciones de venta | Saneamientos Pereda', $DEFAULT[1]],
];

// Map dynamic sub-paths to their parent's metadata.
$key = $path;
if (str_starts_with($path, '/productos/')) $key = '/productos';
elseif (str_starts_with($path, '/inspirate/')) $key = '/inspirate';
[$title, $desc] = $META[$key] ?? $DEFAULT;
$url = $origin . $path;
$image = $origin . '/media/base/logo.png';

// ---- Serve index.html with metadata swapped in ----
$html = @file_get_contents($dir . '/index.html');
if ($html === false) {
    http_response_code(500);
    echo 'Error loading the application.';
    exit;
}

$t = htmlspecialchars($title, ENT_QUOTES);
$d = htmlspecialchars($desc, ENT_QUOTES);
$html = preg_replace('#<title>.*?</title>#s', '<title>' . $t . '</title>', $html, 1);
$html = preg_replace('#<meta name="description"[^>]*>#i', '<meta name="description" content="' . $d . '" />', $html, 1);
$html = preg_replace('#<meta property="og:title"[^>]*>#i', '<meta property="og:title" content="' . $t . '" />', $html, 1);
$html = preg_replace('#<meta property="og:description"[^>]*>#i', '<meta property="og:description" content="' . $d . '" />', $html, 1);
$html = preg_replace('#<meta property="og:image"[^>]*>#i', '<meta property="og:image" content="' . htmlspecialchars($image, ENT_QUOTES) . '" />', $html, 1);
// Add og:url + canonical (not present in the static template).
$inject = '<meta property="og:url" content="' . htmlspecialchars($url, ENT_QUOTES) . '" />'
        . '<link rel="canonical" href="' . htmlspecialchars($url, ENT_QUOTES) . '" />';
$html = preg_replace('#</head>#i', $inject . '</head>', $html, 1);

header('Content-Type: text/html; charset=utf-8');
echo $html;

<?php
// Front controller for the SPA. Every request that isn't a real file lands here
// (see .htaccess). It exists so crawlers and social scrapers get a real answer
// even though the app renders client-side:
//   /robots.txt, /sitemap.xml -> generated (live host; ambientes from the DB).
//   any other path            -> index.html with per-route <title>/description/
//                                og:*/canonical injected, and the right status:
//                                200 for real pages, 404 (+ noindex) otherwise,
//                                301 for a few retired paths.
// The metadata map is also inlined as window.__SEO__, so App.jsx sets the same
// titles on client-side navigation instead of keeping its own copy.

$dir = __DIR__;
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = $path === '/' ? '/' : '/' . trim($path, '/');

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = strtolower($_SERVER['HTTP_HOST'] ?? 'www.saneamientos-pereda.com');
$origin = "$scheme://$host";

// Only the production host may be indexed. Allow-listing it (rather than
// block-listing dev) keeps every other host - dev, the apex before its redirect,
// the raw IP - out of search results.
const PRODUCTION_HOST = 'www.saneamientos-pereda.com';
$isProduction = $host === PRODUCTION_HOST;

// Public, indexable static routes. (scripts/check-redirects.mjs reads this array.)
$ROUTES = [
    '/', '/productos', '/quienes-somos', '/inspirate', '/instalaciones',
    '/area-profesional', '/pide-cita', '/financiacion', '/presupuesto',
    '/hazte-cliente', '/canal-denuncias',
    '/preguntas-frecuentes',
    '/aviso-legal', '/politica-privacidad', '/politica-cookies', '/condiciones-venta',
    '/politica-redes-sociales', '/desistimiento',
];

// Product categories: keys must match src/components/Productos.jsx.
$CATEGORIES = [
    'sanitarios'    => ['Sanitarios en Oviedo y Asturias', 'Inodoros, bidés, lavabos y piezas sanitarias de las mejores marcas. Visita nuestras exposiciones de baño en Oviedo, Pruvia y Gijón.'],
    'griferia'      => ['Grifería para baño y cocina en Oviedo y Asturias', 'Grifos, monomandos y termostáticos para baño y cocina. Asesoramiento y las mejores marcas en Saneamientos Pereda.'],
    'muebles-bano'  => ['Muebles de baño y espejos en Oviedo y Asturias', 'Muebles de baño, espejos y complementos. Descubre las colecciones en nuestras exposiciones de Oviedo, Pruvia y Gijón.'],
    'climatizacion' => ['Climatización y aerotermia en Oviedo y Asturias', 'Aire acondicionado, aerotermia y energías renovables para tu hogar o proyecto, con asesoramiento profesional.'],
    'fontaneria'    => ['Fontanería y calefacción en Oviedo y Asturias', 'Sistemas de calefacción, radiadores y material de fontanería para profesionales y particulares.'],
    'ceramica'      => ['Cerámica, azulejos y pavimentos en Oviedo y Asturias', 'Azulejos, revestimientos y pavimentos cerámicos. Ven a ver las colecciones en nuestras exposiciones.'],
    'materiales'    => ['Materiales de construcción en Oviedo y Asturias', 'Materiales y soluciones constructivas para obra nueva y reforma, con stock y servicio profesional.'],
    'mamparas'      => ['Mamparas de ducha y bañera en Oviedo y Asturias', 'Mamparas de ducha y bañera a medida. Asesoramiento, medición e instalación en Saneamientos Pereda.'],
    'herramientas'  => ['Herramientas profesionales en Oviedo y Asturias', 'Herramienta profesional y de bricolaje de las mejores marcas para instaladores y particulares.'],
    'electricidad'  => ['Material eléctrico e iluminación en Oviedo y Asturias', 'Material eléctrico e iluminación para obra, reforma e instalación.'],
];

// Retired paths that still reach the app.
$REDIRECTS = [
    '/productos/bano' => '/productos',
];

$SITE = 'Saneamientos Pereda';
$DEFAULT_DESC = 'Saneamientos Pereda: especialistas en baño, fontanería y materiales de construcción en Oviedo. Productos, ambientes, tiendas y presupuesto sin compromiso.';
$META = [
    '/' => ['Saneamientos Pereda | Baño, fontanería y materiales de construcción en Oviedo', $DEFAULT_DESC],
    '/productos' => ["Productos | $SITE", 'Catálogo de Saneamientos Pereda: sanitarios, grifería, muebles de baño, cerámica, fontanería, climatización y materiales de construcción.'],
    '/quienes-somos' => ["Quiénes somos | $SITE", 'Empresa familiar de Oviedo fundada en 1959. Más de 50 años equipando baños y proyectos con calidad y asesoramiento profesional.'],
    '/inspirate' => ["Inspírate | $SITE", 'Inspírate con nuestros ambientes de baño: cerámica, mobiliario y decoración seleccionados por Saneamientos Pereda.'],
    '/instalaciones' => ["Nuestras tiendas | $SITE", 'Nuestras tiendas en Oviedo, Pruvia y Gijón: direcciones, horarios y contacto de Saneamientos Pereda.'],
    '/area-profesional' => ["Área profesional | $SITE", 'Área profesional de Saneamientos Pereda: ventajas, stock y ecommerce para instaladores y profesionales.'],
    '/pide-cita' => ["Pide cita | $SITE", 'Pide cita previa en Saneamientos Pereda y recibe atención personalizada para tu proyecto de reforma.'],
    '/financiacion' => ["Financiación | $SITE", 'Financiación al 0% de interés en Saneamientos Pereda: fracciona tu compra hasta en 24 meses.'],
    '/presupuesto' => ["Presupuesto | $SITE", 'Solicita presupuesto sin compromiso a Saneamientos Pereda para tu proyecto de baño o reforma.'],
    '/hazte-cliente' => ["Hazte cliente | $SITE", 'Hazte cliente profesional de Saneamientos Pereda y accede a condiciones y ventajas exclusivas.'],
    '/canal-denuncias' => ["Canal de denuncias | $SITE", 'Canal de denuncias de Saneamientos Pereda. Comunica de forma confidencial y consulta el estado con tu PIN.'],
    '/preguntas-frecuentes' => ["Preguntas frecuentes | $SITE", 'Preguntas frecuentes de Saneamientos Pereda: dudas habituales sobre productos, pedidos, entregas, instalación y garantías.'],
    '/aviso-legal' => ["Aviso legal | $SITE", $DEFAULT_DESC],
    '/politica-privacidad' => ["Política de privacidad | $SITE", $DEFAULT_DESC],
    '/politica-cookies' => ["Política de cookies | $SITE", $DEFAULT_DESC],
    '/condiciones-venta' => ["Condiciones de venta | $SITE", $DEFAULT_DESC],
    '/politica-redes-sociales' => ["Política de privacidad en redes sociales | $SITE", $DEFAULT_DESC],
    '/desistimiento' => ["Desistimiento | $SITE", 'Ejerce tu derecho de desistimiento de forma sencilla mediante el formulario en línea de Saneamientos Pereda.'],
    '/admin' => ["Administración | $SITE", $DEFAULT_DESC],
];
$NOT_FOUND = ["Página no encontrada | $SITE", $DEFAULT_DESC];

// Content lives in MySQL. On the server index.php sits next to api/, so the API's
// connection helper is reachable. Any failure yields null and each caller degrades:
// the sitemap omits ambientes, an ambiente URL is served as 200 rather than a false
// 404, and the store JSON-LD / hero preload are simply left out.
function site_query(string $sql, array $params = []): ?array {
    static $ready = null;
    if ($ready === null) {
        $ready = is_file(__DIR__ . '/api/config.php') && is_file(__DIR__ . '/api/db.php');
        if ($ready) require_once __DIR__ . '/api/db.php';
    }
    if (!$ready) return null;
    try {
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (Throwable $e) {
        return null;
    }
}

// ---- robots.txt ----
if ($path === '/robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    if ($isProduction) {
        echo "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: $origin/sitemap.xml\n";
    } else {
        // No Disallow: a crawler that can't fetch a page never sees its noindex.
        echo "User-agent: *\nAllow: /\n";
    }
    exit;
}

// ---- sitemap.xml ----
if ($path === '/sitemap.xml') {
    $urls = $ROUTES;
    foreach (array_keys($CATEGORIES) as $k) $urls[] = "/productos/$k";
    foreach (site_query('SELECT id FROM ambientes ORDER BY display_order') ?? [] as $row) {
        $urls[] = '/inspirate/' . rawurlencode($row['id']);
    }
    header('Content-Type: application/xml; charset=utf-8');
    if (!$isProduction) header('X-Robots-Tag: noindex, nofollow');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as $u) {
        echo '  <url><loc>' . htmlspecialchars($origin . $u) . "</loc></url>\n";
    }
    echo "</urlset>\n";
    exit;
}

// ---- Retired paths ----
if (isset($REDIRECTS[$path])) {
    header('Location: ' . $origin . $REDIRECTS[$path], true, 301);
    exit;
}

// ---- Resolve the route: status + metadata ----
$status = 200;
$noindex = !$isProduction;
$image = $origin . '/media/base/logo.png';

if (isset($META[$path])) {
    [$title, $desc] = $META[$path];
    if ($path === '/admin') $noindex = true;
} elseif (preg_match('#^/productos/([a-z0-9-]+)$#', $path, $m) && isset($CATEGORIES[$m[1]])) {
    [$name, $desc] = $CATEGORIES[$m[1]];
    $title = "$name | $SITE";
} elseif (preg_match('#^/inspirate/([^/]+)$#', $path, $m)) {
    $rows = site_query('SELECT title, summary, cover_image_url FROM ambientes WHERE id = ?', [rawurldecode($m[1])]);
    if ($rows === null) {
        [$title, $desc] = $META['/inspirate'];           // DB unreachable: don't claim 404
    } elseif ($rows) {
        $a = $rows[0];
        $title = trim($a['title']) . " | Inspírate | $SITE";
        $desc = trim($a['summary']) !== '' ? trim($a['summary']) : $META['/inspirate'][1];
        if (!empty($a['cover_image_url'])) $image = $origin . $a['cover_image_url'];
    } else {
        $status = 404;
    }
} else {
    $status = 404;
}

if ($status === 404) {
    [$title, $desc] = $NOT_FOUND;
    $noindex = true;
}

// ---- Store JSON-LD (home + stores page), built from the tiendas table ----
// So a store edited in the admin (hours, phone, address) reaches Google too.
// Hours: "Tienda Exposición" Monday-Friday + Saturdays, read from the free-text
// hours fields; a store whose text yields no time ranges gets no hours at all
// rather than wrong ones. "sábados de julio y agosto cerrado" becomes a seasonal
// Saturday closure (opens = closes = 00:00, Google's convention).
function time_ranges(?string $text): array {
    preg_match_all('/(\d{1,2})[:.](\d{2})\s*[\x{2013}\x{2014}-]\s*(\d{1,2})[:.](\d{2})/u', (string) $text, $m, PREG_SET_ORDER);
    return array_map(fn($r) => [sprintf('%02d:%s', $r[1], $r[2]), sprintf('%02d:%s', $r[3], $r[4])], $m);
}

function store_graph(): array {
    $rows = site_query('SELECT * FROM tiendas ORDER BY display_order') ?? [];
    $base = 'https://' . PRODUCTION_HOST;
    $weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $graph = [];
    foreach ($rows as $s) {
        [$postal, $locality] = preg_match('/^(\d{5})\s*(.*)$/', trim((string) $s['postal_code']), $pc)
            ? [$pc[1], $pc[2] ?: $s['name']] : [trim((string) $s['postal_code']), $s['name']];
        $store = [
            '@type' => 'HardwareStore',
            'name' => "Saneamientos Pereda — {$s['name']} ({$s['address']})",
            'url' => "$base/instalaciones",
            'image' => $base . ($s['cover_image_url'] ?: '/media/base/logo.png'),
            'parentOrganization' => ['@id' => "$base/#org"],
            'priceRange' => '€€',
            'address' => [
                '@type' => 'PostalAddress', 'streetAddress' => $s['address'], 'postalCode' => $postal,
                'addressLocality' => $locality, 'addressRegion' => 'Asturias', 'addressCountry' => 'ES',
            ],
        ];
        $digits = preg_replace('/\D/', '', (string) $s['phone']);
        if (strlen($digits) === 9) $store['telephone'] = "+34$digits";
        $emails = json_decode((string) $s['emails'], true);
        if (is_array($emails) && $emails) $store['email'] = $emails[0];
        if ($s['lat'] !== null && $s['lon'] !== null) {
            $store['geo'] = ['@type' => 'GeoCoordinates', 'latitude' => (float) $s['lat'], 'longitude' => (float) $s['lon']];
        }
        $hours = [];
        foreach (time_ranges($s['hours_tienda']) as [$o, $c]) {
            $hours[] = ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => $weekdays, 'opens' => $o, 'closes' => $c];
        }
        foreach (time_ranges($s['hours_sabados']) as [$o, $c]) {
            $hours[] = ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => 'Saturday', 'opens' => $o, 'closes' => $c];
        }
        if ($hours && preg_match('/s[aá]bados.*julio.*agosto.*cerrad/iu', (string) $s['hours_verano'])) {
            $year = (int) date('Y') + (date('md') > '0831' ? 1 : 0);
            $hours[] = ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => 'Saturday', 'opens' => '00:00', 'closes' => '00:00',
                'validFrom' => "$year-07-01", 'validThrough' => "$year-08-31"];
        }
        if ($hours) $store['openingHoursSpecification'] = $hours;
        $graph[] = $store;
    }
    return $graph;
}

$headExtra = '';
if ($status === 200 && in_array($path, ['/', '/instalaciones'], true)) {
    $stores = store_graph();
    if ($stores) {
        $headExtra .= '<script type="application/ld+json">'
            . json_encode(['@context' => 'https://schema.org', '@graph' => $stores], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG)
            . '</script>';
    }
}

// ---- Home: the hero image is the largest paint. Preload the admin-chosen image
// before any JS runs, and hand its URL to the client (window.__SETTINGS__, read by
// src/lib/settings.js) so the first render uses it: otherwise a first visit
// downloads the bundled /base/hero-bg.webp and then the DB image as well.
$settings = [];
if ($status === 200 && $path === '/') {
    foreach (site_query("SELECT `key`, value FROM site_settings WHERE `key` IN ('hero_background', 'hero_logo')") ?? [] as $row) {
        if ($row['value'] !== '') $settings[$row['key']] = $row['value'];
    }
    if (isset($settings['hero_background'])) {
        $headExtra .= '<link rel="preload" as="image" fetchpriority="high" href="' . htmlspecialchars($settings['hero_background'], ENT_QUOTES) . '" />';
    }
}

// ---- Serve index.html with metadata swapped in ----
$html = @file_get_contents($dir . '/index.html');
if ($html === false) {
    http_response_code(500);
    echo 'Error loading the application.';
    exit;
}

$url = $origin . $path;
$t = htmlspecialchars($title, ENT_QUOTES);
$d = htmlspecialchars($desc, ENT_QUOTES);
$html = preg_replace('#<title>.*?</title>#s', '<title>' . $t . '</title>', $html, 1);
$html = preg_replace('#<meta name="description"[^>]*>#i', '<meta name="description" content="' . $d . '" />', $html, 1);
$html = preg_replace('#<meta property="og:title"[^>]*>#i', '<meta property="og:title" content="' . $t . '" />', $html, 1);
$html = preg_replace('#<meta property="og:description"[^>]*>#i', '<meta property="og:description" content="' . $d . '" />', $html, 1);
$html = preg_replace('#<meta property="og:image"[^>]*>#i', '<meta property="og:image" content="' . htmlspecialchars($image, ENT_QUOTES) . '" />', $html, 1);

$inject = '<meta property="og:url" content="' . htmlspecialchars($url, ENT_QUOTES) . '" />';
if ($status === 200) {
    $inject .= '<link rel="canonical" href="' . htmlspecialchars($url, ENT_QUOTES) . '" />';
}
if ($noindex) {
    $inject .= '<meta name="robots" content="noindex,nofollow" />';
    header('X-Robots-Tag: noindex, nofollow');
}

// One metadata source for the client, too.
$seo = ['routes' => $META, 'notFound' => $NOT_FOUND, 'categories' => []];
foreach ($CATEGORIES as $k => [$name, $cdesc]) $seo['categories'][$k] = ["$name | $SITE", $cdesc];
$inject .= '<script>window.__SEO__=' . json_encode($seo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ';';
if ($settings) {
    $inject .= 'window.__SETTINGS__=' . json_encode($settings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ';';
}
$inject .= '</script>' . $headExtra;

$html = preg_replace('#</head>#i', $inject . '</head>', $html, 1);

http_response_code($status);
header('Content-Type: text/html; charset=utf-8');
echo $html;

<?php
// Copy to config.php on the server (NEVER commit config.php) and fill in.
define('DB_HOST', 'localhost');
define('DB_NAME', 'CHANGE_ME');
define('DB_USER', 'CHANGE_ME');
define('DB_PASS', 'CHANGE_ME');

// Outgoing mail for the public forms — authenticated SMTP via the domain's
// own provider (passes SPF; no third-party API).
define('SMTP_HOST', 'smtp.serviciodecorreo.es');
define('SMTP_PORT', '465');
define('SMTP_SECURE', 'ssl'); // 'ssl' = implicit TLS (465), 'tls' = STARTTLS (587)
define('SMTP_USER', 'web@saneamientos-pereda.com');
define('SMTP_PASS', 'CHANGE_ME');
define('MAIL_FROM', 'Saneamientos Pereda Web <web@saneamientos-pereda.com>');
define('MAIL_TO', 'ines@saneamientos-pereda.com');

// One-time setup/import protection. Clear it (empty string) or delete
// setup.php entirely after the initial import.
define('SETUP_TOKEN', 'CHANGE_ME');

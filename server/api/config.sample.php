<?php
// Copy to config.php on the server (NEVER commit config.php) and fill in.
define('DB_HOST', 'localhost');
define('DB_NAME', 'CHANGE_ME');
define('DB_USER', 'CHANGE_ME');
define('DB_PASS', 'CHANGE_ME');

// Resend (transactional email for the public forms)
define('RESEND_API_KEY', 'CHANGE_ME');
define('MAIL_FROM', 'Web <web@saneamientos-pereda.com>');
define('MAIL_TO', 'ines@saneamientos-pereda.com');

// One-time setup/import protection. Clear it (empty string) or delete
// setup.php entirely after the initial import.
define('SETUP_TOKEN', 'CHANGE_ME');

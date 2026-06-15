<?php
// Minimal authenticated-SMTP sender for the website forms.
// Sends HTML email through the domain's own provider (serviciodecorreo.es),
// which passes SPF — no Resend, no extra DNS. Config comes from config.php:
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE ('ssl' implicit TLS / 'tls' STARTTLS),
//   SMTP_USER, SMTP_PASS, MAIL_FROM ("Name <addr>"), MAIL_TO (comma list).
// Returns true on success; logs and returns false on any failure (forms treat
// email as best-effort and never fail the user submission because of it).

function mail_header_encode(string $s): string {
    return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

function smtp_send(string $subject, string $html, ?string $replyTo = null): bool {
    if (!defined('SMTP_HOST') || SMTP_HOST === '' || SMTP_HOST === 'CHANGE_ME') return false;

    $secure = defined('SMTP_SECURE') ? SMTP_SECURE : 'ssl';
    $fromHeader = MAIL_FROM;
    $fromAddr = preg_match('/<([^>]+)>/', $fromHeader, $m) ? $m[1] : trim($fromHeader);
    $recipients = array_values(array_filter(array_map('trim', explode(',', MAIL_TO))));
    if (!$recipients) return false;

    $transport = ($secure === 'ssl') ? 'ssl://' : 'tcp://';
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $fp = @stream_socket_client($transport . SMTP_HOST . ':' . (int) SMTP_PORT, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { error_log("SMTP connect failed: $errstr ($errno)"); return false; }
    stream_set_timeout($fp, 15);

    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (strlen($line) >= 4 && $line[3] === ' ') break; // final line: "NNN <text>"
        }
        return $data;
    };
    $expect = fn(string $resp, int $code): bool => strncmp($resp, (string) $code, 3) === 0;
    $send = function (string $line) use ($fp) { fwrite($fp, $line . "\r\n"); };
    $fail = function (string $why) use ($fp): bool { error_log("SMTP: $why"); fclose($fp); return false; };

    if (!$expect($read(), 220)) return $fail('no 220 banner');
    $send('EHLO saneamientos-pereda.com');
    if (!$expect($read(), 250)) return $fail('EHLO rejected');

    if ($secure === 'tls') {
        $send('STARTTLS');
        if (!$expect($read(), 220)) return $fail('STARTTLS rejected');
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) return $fail('TLS handshake failed');
        $send('EHLO saneamientos-pereda.com');
        if (!$expect($read(), 250)) return $fail('EHLO (post-TLS) rejected');
    }

    $send('AUTH LOGIN');
    if (!$expect($read(), 334)) return $fail('AUTH LOGIN unsupported');
    $send(base64_encode(SMTP_USER));
    if (!$expect($read(), 334)) return $fail('username rejected');
    $send(base64_encode(SMTP_PASS));
    if (!$expect($read(), 235)) return $fail('authentication failed');

    $send('MAIL FROM:<' . $fromAddr . '>');
    if (!$expect($read(), 250)) return $fail('MAIL FROM rejected');
    foreach ($recipients as $rcpt) {
        $send('RCPT TO:<' . $rcpt . '>');
        if (!$expect($read(), 250)) return $fail("RCPT $rcpt rejected");
    }
    $send('DATA');
    if (!$expect($read(), 354)) return $fail('DATA rejected');

    $headers = [
        'From: ' . $fromHeader,
        'To: ' . implode(', ', $recipients),
    ];
    if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
    $headers[] = 'Subject: ' . mail_header_encode($subject);
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: base64';
    $headers[] = 'Date: ' . date('r');
    // base64 body: fixed short lines, no dot-stuffing or 998-octet concerns.
    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($html));
    fwrite($fp, $message);
    fwrite($fp, "\r\n.\r\n");
    if (!$expect($read(), 250)) return $fail('message body rejected');

    $send('QUIT');
    fclose($fp);
    return true;
}

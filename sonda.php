<?php
// Sonda de usar y tirar (2026-09-07): ¿puede este hosting hacer de proxy con PHP?
// mod_proxy esta cargado pero Hostinger bloquea sus conexiones salientes (503).
// Eso NO dice nada de PHP: cURL saliente es un uso normal en hosting compartido.
// Si esto funciona, PL Expres puede vivir dentro de ahwealthgroup.com de verdad.
header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');

echo "php_version: " . PHP_VERSION . "\n";
echo "curl_cargado: " . (function_exists('curl_init') ? 'SI' : 'NO') . "\n";
echo "allow_url_fopen: " . (ini_get('allow_url_fopen') ? 'SI' : 'NO') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
echo str_repeat('-', 50) . "\n";

if (!function_exists('curl_init')) { echo "sin cURL, no hay nada que probar\n"; exit; }

$t0 = microtime(true);
$ch = curl_init('https://plx-ea5t.onrender.com/healthz');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);
$ms = round((microtime(true) - $t0) * 1000);

echo "GET healthz -> HTTP $code  en {$ms}ms\n";
if ($err) echo "curl_error: $err\n";
echo "cuerpo: " . substr((string)$body, 0, 200) . "\n";
echo str_repeat('-', 50) . "\n";
echo ($code === 200 && strpos((string)$body, 'ok') !== false)
    ? "VEREDICTO: SE PUEDE. PHP alcanza el servicio.\n"
    : "VEREDICTO: NO alcanza (codigo $code).\n";

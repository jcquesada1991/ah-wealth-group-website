<?php
/**
 * Proxy inverso a PL Exprés (2026-09-07).
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE
 * Aníbal: «yo quiero que quede todo dentro de mi dominio». Y tenía razón en
 * insistir: yo había dado el tema por imposible tras UNA sola prueba.
 *   · CNAME a Render → no: el DNS de ahwealthgroup.com lo controla un tercero.
 *   · mod_proxy      → no: está cargado, pero Hostinger bloquea sus conexiones
 *                      salientes (503 medido el 7-sep).
 *   · PHP + cURL     → SÍ. Medido el mismo día: PHP 8.3.33, cURL presente,
 *                      alcanza el servicio en 126 ms, post_max_size 256M.
 * ⇒ El proxy se escribe aquí. Las URLs se quedan en ahwealthgroup.com de verdad:
 *   no hay salto, no hay página puente, la barra de direcciones no cambia.
 *
 * CÓMO
 * .htaccess manda /c/…, /prep…, /healthz y /styles.css a este archivo. Esas
 * rutas están LIBRES en el sitio (verificado), así que la app conserva sus
 * rutas tal cual y no hizo falta tocarle una línea de código.
 */

// Destino FIJO. Nunca sale de una cabecera ni de un parámetro: si la URL
// destino fuera controlable desde fuera, esto sería un proxy abierto y
// cualquiera lo usaría para atacar a terceros desde tu dominio.
const UPSTREAM = 'https://plx-ea5t.onrender.com';

$ruta = $_SERVER['REQUEST_URI'] ?? '/';
$destino = UPSTREAM . $ruta;

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$ch = curl_init($destino);

/* ── cabeceras que se reenvían ────────────────────────────────────────────
   Se pasa una lista corta a propósito. `Host` NO se reenvía (rompería el
   enrutado de Render) y `Accept-Encoding` tampoco: dejamos que cURL
   descomprima, si no habría que re-comprimir para el navegador.            */
$fuera = [];
foreach ([
    'HTTP_COOKIE'          => 'Cookie',
    'CONTENT_TYPE'         => 'Content-Type',
    'HTTP_USER_AGENT'      => 'User-Agent',
    'HTTP_ACCEPT'          => 'Accept',
    'HTTP_ACCEPT_LANGUAGE' => 'Accept-Language',
    'HTTP_REFERER'         => 'Referer',
] as $env => $cab) {
    if (!empty($_SERVER[$env])) $fuera[] = $cab . ': ' . $_SERVER[$env];
}
// Para que la app sepa que la petición llegó por HTTPS y de qué dominio:
// con esto Express (trust proxy) genera enlaces https://ahwealthgroup.com/...
$fuera[] = 'X-Forwarded-Proto: https';
$fuera[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'ahwealthgroup.com');
$fuera[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '');

/* ── cuerpo ───────────────────────────────────────────────────────────────
   Si hay ficheros, PHP ya consumió el multipart y hay que reconstruirlo con
   CURLFile — pasar php://input aquí devolvería vacío. Si no, se reenvía el
   cuerpo crudo tal cual (formularios normales y JSON).                     */
if ($metodo !== 'GET' && $metodo !== 'HEAD') {
    if (!empty($_FILES)) {
        $campos = [];
        foreach ($_POST as $k => $v) {
            if (is_array($v)) { foreach ($v as $i => $vv) $campos["{$k}[{$i}]"] = $vv; }
            else $campos[$k] = $v;
        }
        foreach ($_FILES as $campo => $f) {
            $nombres = is_array($f['name']) ? $f['name'] : [$f['name']];
            $tmps    = is_array($f['tmp_name']) ? $f['tmp_name'] : [$f['tmp_name']];
            $tipos   = is_array($f['type']) ? $f['type'] : [$f['type']];
            foreach ($nombres as $i => $nombre) {
                if (!$tmps[$i] || !is_uploaded_file($tmps[$i])) continue;
                // el nombre del campo se repite: la app espera `pdfs` varias veces
                $campos[$campo . '[' . $i . ']'] = new CURLFile($tmps[$i], $tipos[$i] ?: 'application/pdf', $nombre);
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $campos);
        // cURL pone su propio Content-Type con el boundary nuevo
        $fuera = array_values(array_filter($fuera, fn($h) => stripos($h, 'Content-Type:') !== 0));
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    }
}

curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $metodo,
    CURLOPT_HTTPHEADER     => $fuera,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_FOLLOWLOCATION => false,   // los redirects los reenvía el navegador
    CURLOPT_ENCODING       => '',      // cURL descomprime
    CURLOPT_TIMEOUT        => 180,     // el plan free puede tardar ~60s en despertar
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$resp = curl_exec($ch);
if ($resp === false) {
    $err = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>No disponible</title>'
       . '<div style="font-family:system-ui;max-width:520px;margin:12vh auto;text-align:center;color:#0A1628">'
       . '<h1 style="font-size:22px">No pudimos abrir tu expediente</h1>'
       . '<p>El servicio no respondió. Espera un minuto y vuelve a intentarlo; '
       . 'si sigue igual, escríbenos por el canal de siempre.</p>'
       . '<p style="color:#8a93a0;font-size:12px">' . htmlspecialchars($err) . '</p></div>';
    exit;
}

$corte   = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$codigo  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$cabs    = substr($resp, 0, $corte);
$cuerpo  = substr($resp, $corte);
curl_close($ch);

http_response_code($codigo);

/* ── cabeceras de vuelta ──────────────────────────────────────────────────
   Se reescriben dos cosas:
   · Set-Cookie: se le quita el `Domain` de Render, si no el navegador
     descartaría la cookie por no coincidir con ahwealthgroup.com y el
     preparador no podría mantener la sesión.
   · Location: los redirect absolutos a plx-ea5t se traen a este dominio; si no,
     al primer redirect la barra de direcciones saltaría fuera.               */
foreach (explode("\r\n", $cabs) as $linea) {
    if (stripos($linea, 'Set-Cookie:') === 0) {
        $c = preg_replace('/;\s*Domain=[^;]*/i', '', $linea);
        header($c, false);
    } elseif (stripos($linea, 'Location:') === 0) {
        header(str_ireplace(UPSTREAM, '', $linea), true, $codigo);
    } elseif (preg_match('/^(Content-Type|Cache-Control|Expires|Pragma|X-Robots-Tag|ETag|Last-Modified):/i', $linea)) {
        header($linea);
    }
    // Content-Length / Transfer-Encoding / Content-Encoding se omiten a
    // propósito: cURL ya descomprimió y el tamaño real es otro.
}
header('X-Robots-Tag: noindex, nofollow');

// Por si alguna URL absoluta se coló en el HTML (la app usa rutas relativas,
// pero esto lo hace inmune a un descuido futuro).
if (stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'text/html') !== false || stripos(implode(' ', headers_list()), 'text/html') !== false) {
    $cuerpo = str_replace(UPSTREAM, '', $cuerpo);
}

echo $cuerpo;

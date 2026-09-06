<?php
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
$basePath = htmlspecialchars(rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/', ENT_QUOTES, 'UTF-8');
echo str_replace('<head>', '<head><base href="' . $basePath . '">', file_get_contents(__DIR__ . '/index.html'));

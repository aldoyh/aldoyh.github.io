<?php
// show_post.php: Serve and render dehydrated post HTML files
// Usage: show_post.php?slug=post-slug

$dehydratedDir = __DIR__ . '/dehydrated-posts';
$slug = isset($_GET['slug']) ? preg_replace('/[^a-zA-Z0-9\-_]/', '', $_GET['slug']) : '';

if (!$slug) {
    http_response_code(400);
    echo '<h1>400 Bad Request</h1><p>Missing or invalid post slug.</p>';
    exit;
}

$htmlFile = $dehydratedDir . '/' . $slug . '.html';
if (!file_exists($htmlFile)) {
    http_response_code(404);
    echo '<h1>404 Not Found</h1><p>Post not found.</p>';
    exit;
}

// Output the dehydrated HTML
header('Content-Type: text/html; charset=UTF-8');
echo file_get_contents($htmlFile);

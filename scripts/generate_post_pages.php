<?php
// Auto-generate HTML pages for each markdown post using the post template (PHP CLI)
// Usage: php scripts/generate_post_pages.php

$postsJsonPath = __DIR__ . '/../posts.json';
$postsDir = __DIR__ . '/../posts';
$templatePath = __DIR__ . '/../posts/post-template.html';
$outputDir = __DIR__ . '/../dehydrated-posts';

if (!file_exists($outputDir)) {
    mkdir($outputDir, 0777, true);
}

$posts = json_decode(file_get_contents($postsJsonPath), true);
$template = file_get_contents($templatePath);

foreach ($posts as $post) {
    $htmlFile = $outputDir . '/' . $post['slug'] . '.html';
    file_put_contents($htmlFile, $template);
    echo "Generated: $htmlFile\n";
}

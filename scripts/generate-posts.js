const fs = require('fs');
const path = require('path');

// Directory containing markdown posts
const postsDir = path.join(__dirname, '../posts');

// Read all markdown files
const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''));

// Generate a simple title from filename (replace hyphens with spaces and capitalize words)
const posts = files.map(slug => {
  const title = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { slug, title };
});

// Sort by newest first assuming filenames are time-ordered or alphabetical
posts.reverse();

// Write JSON file
const outPath = path.join(__dirname, '../posts.json');
fs.writeFileSync(outPath, JSON.stringify(posts, null, 2));
console.log(`Generated posts.json with ${posts.length} entries`);

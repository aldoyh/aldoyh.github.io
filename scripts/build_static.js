const fs = require('fs');
const path = require('path');
// Check if marked is available
let marked;
try {
  marked = require('./marked.js');
} catch (e) {
  console.error('marked.js not found');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');
const publicDir = path.join(rootDir, 'public');
const publicPostsDir = path.join(publicDir, 'posts');
const staticDir = path.join(rootDir, 'static');

// Create directories
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(publicPostsDir)) fs.mkdirSync(publicPostsDir);
const publicStaticDir = path.join(publicDir, 'static');
if (!fs.existsSync(publicStaticDir)) fs.mkdirSync(publicStaticDir);

// Copy static assets
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(staticDir, publicStaticDir);
console.log('Copied static assets.');

// Process Posts
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const parts = content.split('---');
  let body = content;
  let metadata = {};

  if (parts.length >= 3) {
    const rawMeta = parts[1];
    body = parts.slice(2).join('---').trim();
    rawMeta.split('\n').forEach(line => {
      const colIdx = line.indexOf(':');
      if (colIdx > 0) {
        const key = line.slice(0, colIdx).trim();
        const val = line.slice(colIdx + 1).trim();
        metadata[key] = val;
      }
    });
  }

  const slug = file.replace('.md', '');
  metadata.slug = slug;
  if (!metadata.title) metadata.title = slug;

  // Format date if available
  if (metadata.date) {
      try {
          const date = new Date(metadata.date);
          metadata.date = date.toISOString().split('T')[0];
      } catch (e) {
          metadata.date = 'Unknown Date';
      }
  } else {
      metadata.date = 'Unknown Date';
  }

  posts.push({ ...metadata, body, slug });
});

posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

console.log(`Found ${posts.length} posts.`);

// Generate individual post pages
const postTemplateFile = fs.readFileSync(path.join(postsDir, 'post-template.html'), 'utf8');

posts.forEach(post => {
  const htmlBody = marked.parse(post.body);
  let html = postTemplateFile;

  html = html.replace(/Loading.../g, post.title);
  html = html.replace('<div id="post-meta" class="post-meta"></div>', `<div id="post-meta" class="post-meta">Posted on ${post.date}</div>`);
  html = html.replace('<div id="post-content" class="markdown-body"></div>', `<div id="post-content" class="markdown-body">${htmlBody}</div>`);

  // Clean up template garbage
  if (html.includes('<!-- JavaScript removed. PHP now handles post rendering. -->')) {
    html = html.split('<!-- JavaScript removed. PHP now handles post rendering. -->')[0] + '\n</body></html>';
  } else {
      // If template doesn't have comment, assume it's good or check for body close
      if (!html.includes('</body>')) {
          html += '</body></html>';
      }
  }

  fs.writeFileSync(path.join(publicPostsDir, `${post.slug}.html`), html);
});

// Helper for list item
function createListItem(p) {
    return `<li>
    <article class="post-preview">
      <a href="posts/${p.slug}.html">
        <h3 class="post-title">${p.title}</h3>
      </a>
      <div class="post-meta"><time>${p.date}</time></div>
    </article>
  </li>`;
}

// Generate index.html (Limit 5)
const recentPosts = posts.slice(0, 5);
const recentListHtml = recentPosts.map(createListItem).join('\n');

let indexHtmlRaw = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
let indexHtml = indexHtmlRaw.replace('<ul id="posts-list" class="posts-list" role="list"></ul>', `<ul id="posts-list" class="posts-list" role="list">${recentListHtml}</ul>`);

// Clean JS garbage in index.html
if (indexHtml.includes('<!-- JavaScript removed. PHP now handles post rendering. -->')) {
    indexHtml = indexHtml.split('<!-- JavaScript removed. PHP now handles post rendering. -->')[0] + '</body></html>';
}
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

// Generate posts.html using index.html as base (All Posts)
let postsHtml = indexHtmlRaw;

// Change Title in Head
postsHtml = postsHtml.replace(/<title>.*?<\/title>/, '<title>All Posts - Hasan Al Doy</title>');

// Change Section Header "Latest Posts" -> "All Posts"
postsHtml = postsHtml.replace('>Latest Posts<', '>All Posts<');

// Remove "View all" link
postsHtml = postsHtml.replace(/<a[^>]*href="posts\.html"[^>]*>View all.*?<\/a>/i, '');

// Inject All Posts
const allPostsListHtml = posts.map(createListItem).join('\n');

postsHtml = postsHtml.replace('<ul id="posts-list" class="posts-list" role="list"></ul>', `<ul id="posts-list" class="posts-list" role="list">${allPostsListHtml}</ul>`);

// Clean JS garbage
if (postsHtml.includes('<!-- JavaScript removed. PHP now handles post rendering. -->')) {
    postsHtml = postsHtml.split('<!-- JavaScript removed. PHP now handles post rendering. -->')[0] + '</body></html>';
}

fs.writeFileSync(path.join(publicDir, 'posts.html'), postsHtml);
console.log('Build complete.');

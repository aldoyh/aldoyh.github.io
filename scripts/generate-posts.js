const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Directory containing markdown posts
const postsDir = path.join(__dirname, '../posts');

// Configure marked for better HTML output
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

// Read all markdown files
const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md'));

// Generate posts data and HTML files
const posts = files.map(filename => {
  const slug = filename.replace('.md', '');
  const filePath = path.join(postsDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse frontmatter and content
  const { data: frontmatter, content } = matter(fileContent);

  // Generate title from frontmatter or filename
  const title = frontmatter.title || slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Convert markdown to HTML
  const htmlContent = marked(content);

  // Create HTML file for the post
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Hasan Al Doy</title>
  <link rel="stylesheet" href="../static/style.css">
  <style>
    article {
      max-width: 800px;
      margin: 2rem auto;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
      padding: 3rem 2rem;
      line-height: 1.6;
    }
    article h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #222;
    }
    article h2 {
      font-size: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #333;
    }
    article h3 {
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #444;
    }
    article p {
      margin-bottom: 1.25rem;
      font-size: 1.1rem;
      color: #444;
    }
    article code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    article pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    article pre code {
      background: none;
      padding: 0;
    }
    article blockquote {
      border-left: 4px solid #0070f3;
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: #666;
      font-style: italic;
    }
    article a {
      color: #0070f3;
      text-decoration: none;
    }
    article a:hover {
      text-decoration: underline;
    }
    article img {
      max-width: 100%;
      height: auto;
      border-radius: 5px;
      margin: 1.5rem 0;
    }
    article ul, article ol {
      margin: 1rem 0 1.5rem 2rem;
    }
    article li {
      margin-bottom: 0.5rem;
    }
    .post-meta {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    @media (max-width: 600px) {
      article {
        padding: 1.5rem 1rem;
      }
      article h1 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1><a href="../index.html" style="color: inherit; text-decoration: none;">Hasan Al Doy</a></h1>
    <p>Software Engineer Guru</p>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../posts.html">All Posts</a>
    </nav>
  </header>
  <article>
    <h1>${title}</h1>
    ${frontmatter.date ? `<div class="post-meta">Published on ${new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>` : ''}
    ${htmlContent}
  </article>
</body>
</html>`;

  // Write HTML file
  const htmlFilePath = path.join(postsDir, `${slug}.html`);
  fs.writeFileSync(htmlFilePath, htmlTemplate);

  return {
    slug,
    title,
    date: frontmatter.date || null
  };
});

// Sort by date (newest first) or reverse alphabetically
posts.sort((a, b) => {
  if (a.date && b.date) {
    return new Date(b.date) - new Date(a.date);
  }
  return b.slug.localeCompare(a.slug);
});

// Write JSON file
const outPath = path.join(__dirname, '../posts.json');
fs.writeFileSync(outPath, JSON.stringify(posts, null, 2));
console.log(`✅ Generated posts.json with ${posts.length} entries`);
console.log(`✅ Generated ${posts.length} HTML files from markdown`);

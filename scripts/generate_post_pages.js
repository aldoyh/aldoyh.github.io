// Auto-generate HTML pages for each markdown post using the post template
const fs = require('fs');
const path = require('path');

const postsJsonPath = path.join(__dirname, '../posts.json');
const postsDir = path.join(__dirname, '../posts');
const templatePath = path.join(__dirname, '../posts/post-template.html');

const outputDir = path.join(__dirname, '../dehydrated');

function main() {
  const posts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
  const template = fs.readFileSync(templatePath, 'utf8');

  posts.forEach(post => {
    const htmlFile = path.join(outputDir, `${post.slug}.html`);
    fs.writeFileSync(htmlFile, template);
    console.log(`Generated: ${htmlFile}`);
  });
}

main();

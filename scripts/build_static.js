const fs = require('fs');
const path = require('path');
const marked = require('./marked');

// Use current working directory + posts
const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const POST_TEMPLATE_PATH = path.join(POSTS_DIR, 'post-template.html');

console.log('Building static site...');

if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

// Ensure public has static assets if needed, but we are using inline styles/scripts or CDN mostly now.
// For now, let's copy style.css if it exists just in case, but the new template relies on Tailwind CDN.

// Read templates
const indexTemplate = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const postTemplate = fs.existsSync(POST_TEMPLATE_PATH)
    ? fs.readFileSync(POST_TEMPLATE_PATH, 'utf8')
    : null;

// Clean PHP garbage from templates if present (legacy)
function cleanTemplate(template) {
    if(!template) return "";
    return template.replace(/<\?php.*?\?>/gs, '')
                   .replace(/{{ date }}/g, '{{{date}}}')
                   .replace(/{{ title }}/g, '{{{title}}}')
                   .replace(/{{ content }}/g, '{{{content}}}');
}

const cleanIndexTemplate = cleanTemplate(indexTemplate);
const cleanPostTemplate = cleanTemplate(postTemplate);

// Read all markdown files
const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
console.log(`Found ${files.length} posts.`);

// Store post metadata for the index
const posts = [];

files.forEach(file => {
    const rawContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');

    // Simple frontmatter parsing (assuming line based)
    const lines = rawContent.split('\n');
    let title = 'Untitled';
    let date = 'Unknown Date';
    let contentStartIndex = 0;

    // Heuristic: Check for title/date in first few lines
    // Or just grab the first # header as title

    // Removing the PHP style comments if any
    const content = rawContent.replace(/<\?php.*?\?>/gs, '');

    // Find Title (first H1)
    const titleMatch = content.match(/^# (.*$)/m);
    if (titleMatch) {
         title = titleMatch[1];
    } else {
        // Fallback to filename
        title = file.replace('.md', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Attempt to extract date from filename or content?
    // Let's use file creation time if no date found, or just a placeholder.
    // Kamran's repo seems to have dates in filenames? No, just slugs.
    // Let's just use "Oct 2024" style placeholder or current date for now as we don't have real metadata.
    date = "Oct 2024";

    const htmlContent = marked.parse(content);

    const slug = file.replace('.md', '');
    const permalink = `/${slug}.html`;

    posts.push({
        title,
        date,
        slug,
        permalink,
        summary: content.substring(0, 150).replace(/#|\[|\]|\(|\)/g, '') + '...' // plain text summary roughly
    });

    // Generate individual post HTML
    if (cleanPostTemplate) {
        let postHtml = cleanPostTemplate
            .replace(/{{{title}}}/g, title)
            .replace(/{{{date}}}/g, date)
            .replace(/{{{content}}}/g, htmlContent);

        fs.writeFileSync(path.join(PUBLIC_DIR, `${slug}.html`), postHtml);
    }
});

// Generate Index HTML with Bento Grid
// Logic: First post is "Large Card", others are "Small Card"

let postsHtml = '';

// Default fallback image
const genericImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBTY0fTrOlUa2KWmh41KsBdaxZFSc359x06uXKzWPUVKJqa1uyzErAQquBHKfG8wIEFDegtjp2TJEFqc5hU3sdLJROxcuAk8DEWihpLdMeDYKmL6FYw8XTwjAP3xLx4x0fRO5qi-B2IRjyP8FZ5h17aQ3_DYSf1_roZKkMkYw28kNaztklECODM6QSwyjfxjip7nCrQEk8N0cms8oG7psVFkKuo-Aks9psR66HaqATHG0ccUV5-3aIR80TI_gO6RP9Vf7vi8ZO_A0en";

// Helper for Large Card
function createLargeCard(post, index) {
    return `
    <div onclick="window.location.href='${post.permalink}'" class="md:col-span-2 md:row-span-2 group cursor-pointer relative overflow-hidden rounded-xl border border-outline-variant/10 surface-container-low transition-all duration-500 hover:border-primary/30">
        <div class="aspect-video w-full overflow-hidden">
            <img alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${genericImage}"/>
        </div>
        <div class="p-8 relative">
            <div class="flex gap-4 mb-4">
                <span class="font-headline text-[10px] text-primary px-3 py-1 rounded-full border border-primary/20 bg-primary/5 uppercase tracking-widest">Engineering</span>
                <span class="font-headline text-[10px] text-on-surface/40 uppercase tracking-widest">${post.date}</span>
            </div>
            <h3 class="text-3xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">${post.title}</h3>
            <p class="text-on-surface/60 font-light line-clamp-2">${post.summary}</p>
            <div class="mt-8 flex justify-between items-center">
                <span class="font-headline text-[10px] text-on-surface/30 uppercase tracking-[0.2em]">Read Article</span>
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest transition-all group-hover:bg-primary group-hover:text-on-primary">
                    <span class="material-symbols-outlined" data-icon="north_east">north_east</span>
                </div>
            </div>
        </div>
    </div>`;
}

// Helper for Small Card
function createSmallCard(post, index) {
    // Alternate category colors or styles just for variety if we wanted
    const category = "Logic";
    return `
    <div onclick="window.location.href='${post.permalink}'" class="group cursor-pointer glass-panel p-8 rounded-xl border border-outline-variant/10 flex flex-col transition-all duration-300 hover:bg-surface-bright">
        <span class="font-headline text-[10px] text-tertiary mb-6 uppercase tracking-widest">${category}</span>
        <h3 class="text-xl font-headline font-bold mb-4">${post.title}</h3>
        <p class="text-on-surface/60 text-sm font-light mb-auto line-clamp-3">${post.summary}</p>
        <div class="mt-8 flex items-center gap-3">
             <div class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
             <span class="font-headline text-[10px] uppercase tracking-widest opacity-40">Read</span>
        </div>
    </div>`;
}

// Limit the number of posts on the homepage Bento Grid to avoid layout breakage or huge page
// The grid has 3 columns.
// Large card takes 2x2 (4 cells).
// Slots remaining in that 2-row height: 2 cells (col 3 row 1, col 3 row 2).
// So first 3 posts fit perfectly in a 2-row block.
// 1 [Large 2x2]
// 2 [Small]
// 3 [Small]
// ... subsequent posts?
// To keep the bento grid nice, let's just render the first 7 posts perhaps, or loop through all but formatted as small cards after the first one.

posts.forEach((post, index) => {
    if (index === 0) {
        postsHtml += createLargeCard(post, index);
    } else {
        postsHtml += createSmallCard(post, index);
    }
});

let finalIndexHtml = cleanIndexTemplate;
finalIndexHtml = finalIndexHtml.replace(
    /<!-- POSTS_GRID_START -->[\s\S]*<!-- POSTS_GRID_END -->/,
    postsHtml
);

fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), finalIndexHtml);

console.log('Build complete.');

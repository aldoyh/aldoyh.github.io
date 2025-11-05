# 🚀 Deployment Guide for GitHub Pages

This guide explains how the blog is deployed to GitHub Pages using GitHub Actions.

## 📋 Overview

The blog uses a modern CI/CD pipeline that automatically:
1. Converts Markdown posts to HTML
2. Generates a posts index (posts.json)
3. Deploys the site to GitHub Pages

## 🔧 How It Works

### Build Process

1. **Markdown Posts** → Located in `/posts/*.md`
2. **Build Script** → `scripts/generate-posts.js` converts markdown to HTML
3. **Generated Files** → HTML files created in `/posts/*.html`
4. **Index File** → `posts.json` lists all posts with metadata

### GitHub Actions Workflow

The deployment happens automatically when you push to `main` or `master` branch:

```yaml
Trigger: Push to main/master
  ↓
1. Checkout code
  ↓
2. Setup Node.js 20
  ↓
3. Install dependencies (npm ci)
  ↓
4. Generate posts (npm run build)
  ↓
5. Upload to GitHub Pages
  ↓
6. Deploy to GitHub Pages
```

## 📝 Adding New Posts

1. Create a new Markdown file in `/posts/` directory:
   ```bash
   touch posts/my-new-post.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: My Awesome Post
   date: 2025-01-15
   ---

   Your post content here...
   ```

3. Commit and push:
   ```bash
   git add posts/my-new-post.md
   git commit -m "Add new post: My Awesome Post"
   git push origin main
   ```

4. GitHub Actions will automatically build and deploy!

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Install dependencies
npm install

# Build posts
npm run build

# The script will:
# - Generate posts.json
# - Create HTML files from markdown posts
```

### Testing Locally

You can use any local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then visit http://localhost:8000
```

## 📦 Dependencies

- **marked** (v11.1.1) - Markdown to HTML converter
- **gray-matter** (v4.0.3) - Frontmatter parser

## 🔍 GitHub Pages Configuration

### Repository Settings

1. Go to **Settings** → **Pages**
2. Source should be set to **GitHub Actions**
3. The workflow will handle deployment automatically

### Custom Domain (Optional)

If using a custom domain:
1. Add your domain to **Settings** → **Pages** → **Custom domain**
2. Update `site.json` → `cname` field
3. Create a `CNAME` file in the root with your domain

## 🚨 Troubleshooting

### Build Fails

1. Check the Actions tab for error logs
2. Verify all markdown files have valid frontmatter
3. Ensure package.json dependencies are correct

### Posts Not Showing

1. Verify markdown files are in `/posts/` directory
2. Check that posts have `.md` extension
3. Run `npm run build` locally to test

### Deployment Fails

1. Check repository permissions
2. Verify GitHub Pages is enabled
3. Ensure workflow has proper permissions

## 🔐 Workflow Permissions

The workflow needs these permissions:
- `contents: read` - Read repository files
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - Authentication

These are set in `.github/workflows/deploy.yml`

## 📊 Workflow Status

You can monitor deployments:
- **Actions tab** → View workflow runs
- **Environments** → See deployment history
- **Settings → Pages** → View live URL

## ✅ Best Practices

1. **Always test locally** before pushing
2. **Use meaningful commit messages**
3. **Don't commit generated HTML files** (they're in .gitignore)
4. **Keep markdown posts clean and well-formatted**
5. **Use frontmatter for metadata** (title, date, etc.)

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Build posts
npm run build

# Check generated files
ls posts/*.html

# View posts.json
cat posts.json

# Force redeploy (empty commit)
git commit --allow-empty -m "Trigger redeploy"
git push
```

## 📚 File Structure

```
aldoyh.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── posts/
│   ├── *.md                    # Markdown posts (source)
│   └── *.html                  # Generated HTML (not committed)
├── scripts/
│   └── generate-posts.js       # Build script
├── static/
│   ├── style.css              # Styles
│   └── libs/                  # JavaScript libraries
├── index.html                 # Homepage
├── posts.html                 # All posts page
├── posts.json                 # Generated posts index
├── site.json                  # Site configuration
├── package.json               # Dependencies
└── .gitignore                 # Excludes node_modules, generated files

```

## 🌐 Live Site

After successful deployment, your site will be available at:
- **Default**: `https://aldoyh.github.io`
- **Custom domain**: As configured in GitHub Pages settings

---

**Note**: This deployment system was set up to automatically convert markdown to HTML and deploy to GitHub Pages. No manual steps required after the initial setup!

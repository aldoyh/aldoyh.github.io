# Deployment instructions for GitHub Pages

1. Ensure your repository is named as `aldoyh.github.io` (which matches your CNAME and GitHub Pages requirements).
2. The `CNAME` file should contain only your custom domain (aldoyh.github.io) and is already set in site.json.
3. All site assets (HTML, CSS, JS, posts, etc.) should be in the root or appropriate folders.
4. In your repository settings on GitHub, set the Pages source to the `main` branch (or `master`) and root directory.
5. After pushing changes, GitHub Pages will automatically deploy your site.
6. To force a redeploy, you can push an empty commit:
   ```sh
   git commit --allow-empty -m "Trigger GitHub Pages deploy"
   git push
   ```

# Modernization summary
- Modern CSS added in `static/style.css`.
- Homepage and posts page use dynamic content from `site.json` and `posts.json`.
- Latest 3 posts shown on homepage, all posts on posts page.
- Responsive, clean design.
- Toast notifications for user feedback.

# No further manual deployment steps are needed if you push to GitHub.

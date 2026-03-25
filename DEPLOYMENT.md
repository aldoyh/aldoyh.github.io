# GitHub Pages Deployment

This repository deploys via GitHub Actions using `.github/workflows/generate-post-pages.yml`.

## How deployment works

1. Push to `master` (or run the workflow manually).
2. Workflow installs dependencies and runs `node scripts/build_static.js`.
3. Build output is generated into `public/`.
4. A `CNAME` file is written from `site.json` (if `cname` exists).
5. `public/` is uploaded and deployed through `actions/deploy-pages`.

## One-time GitHub settings

1. Open repository Settings -> Pages.
2. Set Source to `GitHub Actions`.

## Local verification before pushing

```sh
npm ci
npm run build:static
```

Then preview files in `public/` (especially `public/index.html`) before you push.

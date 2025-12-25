# GitHub Pages Deployment Guide

This guide explains how to deploy the Dhun music streaming application to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and pnpm installed

## Configuration Overview

The application has been configured for GitHub Pages deployment with the following changes:

### 1. Vite Configuration (`vite.config.ts`)
- Added `base` path configuration for GitHub Pages
- Set to use `/melody-stream/` when `GITHUB_PAGES=true`
- Configured build output directory

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automated deployment on push to `main` branch
- Builds the application with pnpm
- Deploys to GitHub Pages automatically

### 3. Static Files
- Added `.nojekyll` file in `public/` directory to prevent Jekyll processing

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Create a GitHub Repository**
   ```bash
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add remote repository (replace with your repo URL)
   git remote add origin https://github.com/YOUR_USERNAME/melody-stream.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on the next push

3. **Access Your Application**
   - After deployment completes, your app will be available at:
   - `https://YOUR_USERNAME.github.io/melody-stream/`

### Option 2: Manual Deployment

1. **Build the Application**
   ```bash
   # Set environment variable for GitHub Pages
   export GITHUB_PAGES=true
   
   # Install dependencies
   pnpm install
   
   # Build the application
   pnpm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Install gh-pages package
   pnpm add -D gh-pages
   
   # Deploy dist folder
   npx gh-pages -d dist
   ```

## Important Notes

### Base Path Configuration

The application uses `/melody-stream/` as the base path when deployed to GitHub Pages. If you want to use a different repository name:

1. Update `vite.config.ts`:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/YOUR_REPO_NAME/' : '/',
   ```

2. Update `.github/workflows/deploy.yml` if needed

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public/` directory with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. Enable custom domain in GitHub Pages settings

### Environment Variables

For production deployment, you'll need to configure environment variables:

1. **Supabase Configuration**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `VITE_APP_ID`: Your application ID

2. **Update Workflow**
   Modify `.github/workflows/deploy.yml` to include environment variables:
   ```yaml
   - name: Build
     env:
       GITHUB_PAGES: 'true'
       VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
       VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
       VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
     run: pnpm run build
   ```

## Troubleshooting

### 404 Errors on Page Refresh

GitHub Pages doesn't support client-side routing by default. Solutions:

1. **Use Hash Router** (Recommended for GitHub Pages)
   - Update `src/App.tsx` to use `HashRouter` instead of `BrowserRouter`
   - URLs will have `#` in them (e.g., `/#/music`)

2. **Add 404.html Redirect**
   - Create `public/404.html` that redirects to `index.html`

### Build Fails

- Check that all dependencies are installed: `pnpm install`
- Verify Node.js version is 18 or higher
- Check for TypeScript errors: `pnpm run lint`

### Assets Not Loading

- Verify the `base` path in `vite.config.ts` matches your repository name
- Check that `.nojekyll` file exists in `public/` directory
- Clear browser cache and hard refresh

### Workflow Permissions

If deployment fails with permission errors:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Save changes and re-run the workflow

## Local Testing

To test the GitHub Pages build locally:

```bash
# Build with GitHub Pages configuration
GITHUB_PAGES=true pnpm run build

# Serve the dist folder
npx serve dist

# Or use Python
cd dist
python -m http.server 8000
```

Then open `http://localhost:8000/melody-stream/` in your browser.

## Updating the Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and redeploy

## Alternative Hosting Options

While this guide focuses on GitHub Pages, you can also deploy to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder or use Netlify CLI
- **Cloudflare Pages**: Connect your GitHub repository
- **Firebase Hosting**: `firebase deploy`

## Repository Structure

```
melody-stream/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── .nojekyll              # Prevents Jekyll processing
├── src/
│   └── ...                    # Application source code
├── vite.config.ts             # Vite configuration with base path
└── package.json               # Project dependencies
```

## Support

For issues related to:
- **GitHub Pages**: Check [GitHub Pages documentation](https://docs.github.com/pages)
- **Vite**: Check [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
- **Application**: Open an issue in the repository

## Security Considerations

⚠️ **Important**: Never commit sensitive information to the repository:
- API keys
- Database credentials
- Authentication secrets

Always use GitHub Secrets for sensitive environment variables.

---

**Last Updated**: December 25, 2025
**Version**: 2.1.0

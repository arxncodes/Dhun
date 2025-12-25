# Quick Setup Guide for GitHub Pages

## 🚀 Deploy in 3 Steps

### Step 1: Update Repository Name (if different)

If your repository name is **NOT** `melody-stream`, update `vite.config.ts`:

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/YOUR_REPO_NAME/' : '/',
```

Replace `YOUR_REPO_NAME` with your actual repository name.

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with GitHub Pages support"

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Wait for the deployment to complete (check **Actions** tab)

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## ✅ What's Already Configured

- ✅ Vite config with base path
- ✅ GitHub Actions workflow
- ✅ 404.html for client-side routing
- ✅ .nojekyll file
- ✅ SPA redirect scripts

## 🔧 Environment Variables (Optional)

If you need Supabase or other environment variables:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add your secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_ID`

3. Update `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    GITHUB_PAGES: 'true'
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
  run: pnpm run build
```

## 🧪 Test Locally

```bash
# Build with GitHub Pages config
GITHUB_PAGES=true pnpm run build

# Serve locally
npx serve dist

# Open: http://localhost:3000/melody-stream/
```

## 📚 Full Documentation

See `GITHUB_PAGES_DEPLOYMENT.md` for complete documentation.

## ⚠️ Important Notes

- The app uses `/melody-stream/` as base path when deployed
- Client-side routing is handled via 404.html redirect
- Never commit sensitive API keys or secrets
- Use GitHub Secrets for environment variables

## 🆘 Troubleshooting

**404 on refresh?**
- The 404.html redirect should handle this
- Check that `.nojekyll` exists in `public/`

**Assets not loading?**
- Verify `base` path in `vite.config.ts`
- Clear browser cache

**Build fails?**
- Check **Actions** tab for error logs
- Verify all dependencies in `package.json`
- Ensure Node.js version is 18+

---

Need help? Check the full deployment guide or open an issue!

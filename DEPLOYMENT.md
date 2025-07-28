# Netlify Deployment Guide

This guide will help you deploy your Nuxt 3 project to Netlify.

## 🚀 Quick Setup

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign up/log in
2. **Click "Add new site"** → "Import an existing project"
3. **Connect your Git provider** (GitHub/GitLab/Bitbucket)
4. **Select your repository**

### 3. Configure Build Settings

Netlify should auto-detect your settings, but verify:

- **Build command**: `pnpm generate`
- **Publish directory**: `.output/public`
- **Node version**: `22` (set in netlify.toml)

### 4. Set Environment Variables

In your Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```
KIRBY_BASE_URL=https://your-kirby-backend.com
KIRBY_API_TOKEN=your-bearer-token
NUXT_PUBLIC_SITE_URL=https://your-netlify-domain.netlify.app
```

### 5. Deploy!

Click **"Deploy site"** and Netlify will:

- Install dependencies with pnpm
- Run `pnpm generate`
- Deploy your static site
- Provide you with a URL

## 🔧 Configuration Files

### `netlify.toml`

- ✅ Build configuration
- ✅ Node.js version (22)
- ✅ pnpm support
- ✅ Security headers
- ✅ Caching rules
- ✅ Redirect rules

### `.env.example`

- ✅ Template for required environment variables
- Copy to `.env` for local development

## 🌐 Custom Domain Setup

1. **In Netlify dashboard**: Site settings → Domain management
2. **Add custom domain**: your-domain.com
3. **Configure DNS**: Point your domain to Netlify
4. **SSL certificate**: Automatically provisioned

## 🔄 Automatic Deployments

- **Main branch**: Deploys to production
- **Other branches**: Creates deploy previews
- **Pull requests**: Creates preview deployments

## 📊 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Images from Kirby CMS display properly
- [ ] Navigation works
- [ ] Forms work (if any)
- [ ] Performance check with Lighthouse
- [ ] Test on mobile devices

## 🐛 Troubleshooting

### Build Fails

- Check build logs in Netlify dashboard
- Verify environment variables are set
- Test `pnpm generate` locally

### Images Not Loading

- Verify `KIRBY_BASE_URL` is correct
- Check CORS settings on Kirby backend
- Ensure API token has proper permissions

### 404 Errors

- Check redirect rules in `netlify.toml`
- Verify all pages are generated correctly

## 🚀 Performance Optimization

Your site is already optimized with:

- ✅ Static site generation (SSG)
- ✅ Image optimization with Nuxt Image
- ✅ CDN delivery via Netlify
- ✅ Proper caching headers
- ✅ Security headers

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **Nuxt 3 Deployment**: https://nuxt.com/docs/getting-started/deployment#static-hosting

## 🔧 Troubleshooting netlify.toml Issues

If you encounter TOML parsing errors:

### Option 1: Use the Simple Configuration

Rename `netlify-simple.toml` to `netlify.toml`:

```bash
mv netlify.toml netlify-backup.toml
mv netlify-simple.toml netlify.toml
```

### Option 2: Manual Configuration in Netlify UI

If TOML issues persist, delete `netlify.toml` and configure manually in Netlify:

**Build Settings:**

- Build command: `pnpm generate`
- Publish directory: `.output/public`
- Node version: 22 (in Environment variables)

**Environment Variables:**

- `NODE_VERSION`: `22`
- `PNPM_VERSION`: `10.13.1`

### Option 3: Validate TOML Syntax

Test your TOML file locally:

```bash
python3 -c "import tomllib; f=open('netlify.toml','rb'); tomllib.load(f); print('✅ Valid')"
```

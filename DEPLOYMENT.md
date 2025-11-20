# 🚀 Deployment Commands Cheatsheet

Quick reference for deploying your portfolio to different platforms.

---

## 📦 GitHub Pages Deployment

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Portfolio website"
```

### Step 2: Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `portfolio` (or any name you like)
3. Keep it public
4. Don't initialize with README (you already have one)
5. Click "Create repository"

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/Tejo0507/portfolio.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" (left sidebar)
3. Under "Source", select branch: `main`
4. Select folder: `/ (root)`
5. Click "Save"
6. Wait 1-2 minutes
7. Your site will be live at: `https://tejo0507.github.io/portfolio/`

---

## 🌐 Netlify Deployment

### Method 1: Drag & Drop (Easiest)
1. Go to: https://app.netlify.com/drop
2. Drag your entire Portfolio folder onto the page
3. Wait 10-30 seconds
4. Your site is live! URL will be shown
5. (Optional) Click "Site settings" → "Change site name" to customize URL

### Method 2: GitHub (Automatic Updates)
1. Push your code to GitHub first (see above)
2. Go to: https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub"
5. Select your portfolio repository
6. Click "Deploy site"
7. Your site is live!

### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd "e:\Projects-Program files\Portfolio"
netlify deploy --prod

# Follow the prompts:
# - Create & configure a new site
# - Choose a site name
# - Publish directory: . (current directory)
```

### Custom Domain on Netlify
```bash
netlify domains:add yourdomain.com
```

---

## ▲ Vercel Deployment

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd "e:\Projects-Program files\Portfolio"
vercel --prod

# Follow the prompts
```

### Method 2: GitHub (Automatic)
1. Push code to GitHub first
2. Go to: https://vercel.com/new
3. Import your GitHub repository
4. Click "Deploy"
5. Done!

---

## 🌍 Custom Domain Setup

### For GitHub Pages:
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In repository settings → Pages
3. Add your custom domain
4. Update DNS records at your domain provider:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   
   Type: CNAME
   Host: www
   Value: tejo0507.github.io
   ```

### For Netlify:
1. Domains → Add custom domain
2. Follow DNS configuration instructions
3. SSL certificate automatically added

### For Vercel:
1. Project Settings → Domains
2. Add your domain
3. Update nameservers or DNS records
4. SSL automatically configured

---

## 🔄 Update Your Deployed Site

### GitHub Pages:
```bash
# Make your changes, then:
git add .
git commit -m "Update: describe your changes"
git push origin main

# Site updates in 1-2 minutes
```

### Netlify (with GitHub):
```bash
# Same as above - pushes to GitHub automatically trigger Netlify deployment
git add .
git commit -m "Update: describe your changes"
git push origin main

# Site updates in 30-60 seconds
```

### Netlify (Drag & Drop):
- Just drag and drop the updated folder again
- Or use: `netlify deploy --prod`

### Vercel:
```bash
# Changes automatically deploy when you push to GitHub
git add .
git commit -m "Update: describe your changes"
git push origin main
```

---

## 🧪 Local Testing Commands

### Simple HTTP Server (Python):
```bash
# Python 3
cd "e:\Projects-Program files\Portfolio"
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then visit: http://localhost:8000
```

### Node.js HTTP Server:
```bash
# Install globally (once)
npm install -g http-server

# Run server
cd "e:\Projects-Program files\Portfolio"
http-server -p 8000

# Then visit: http://localhost:8000
```

### PHP Built-in Server:
```bash
cd "e:\Projects-Program files\Portfolio"
php -S localhost:8000

# Then visit: http://localhost:8000
```

### VS Code Live Server Extension:
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically

---

## 📊 Check Deployment Status

### GitHub Pages:
```bash
# Check deployment status
git log --oneline

# View your site
start https://tejo0507.github.io/portfolio/
```

### Netlify:
```bash
# List your sites
netlify sites:list

# Open your site
netlify open:site
```

### Vercel:
```bash
# List deployments
vercel ls

# Open your site
vercel open
```

---

## 🔍 Troubleshooting Deployments

### Site not updating?
```bash
# Clear cache and force refresh
# Windows: Ctrl + F5
# Mac: Cmd + Shift + R

# Or clear Git cache:
git rm -rf --cached .
git add .
git commit -m "Clear cache"
git push
```

### 404 Error?
- Check repository is public (for GitHub Pages)
- Verify file paths are correct
- Ensure index.html is in root directory
- Check deployment logs for errors

### CSS/JS not loading?
- Check file paths (use relative paths: `./style.css`)
- Verify all files are committed and pushed
- Check browser console for errors (F12)
- Clear browser cache

### Images not showing?
- Check image paths are relative: `./images/profile.jpg`
- Verify images are committed to Git
- Check file extensions match exactly (case-sensitive)
- Ensure images are in the deployed folder

---

## 🎯 Quick Deploy Script

Save this as `deploy.bat` (Windows) or `deploy.sh` (Mac/Linux):

### Windows (deploy.bat):
```batch
@echo off
echo Deploying portfolio...
git add .
git commit -m "Update: %date% %time%"
git push origin main
echo Done! Site will update in 1-2 minutes.
pause
```

### Mac/Linux (deploy.sh):
```bash
#!/bin/bash
echo "Deploying portfolio..."
git add .
git commit -m "Update: $(date)"
git push origin main
echo "Done! Site will update in 1-2 minutes."
```

Make it executable (Mac/Linux):
```bash
chmod +x deploy.sh
```

Run it:
```bash
# Windows
deploy.bat

# Mac/Linux
./deploy.sh

---

## 📱 PWA & Offline (Optional)

This portfolio now includes a lightweight PWA manifest and a service worker to enable offline viewing and an "Install to home screen" prompt on supported browsers.

- Files added: `manifest.json`, `sw.js`
- The service worker caches core assets so the site remains available even when offline.

Notes:
- For testing locally, use a simple HTTP server (GitHub Pages / Netlify / Vercel will serve the SW correctly).
- To see the install prompt, open the site in Chrome/Edge and look for "Install" in the address bar or browser menu.

```

---

## 📈 Analytics Setup

### Google Analytics:
1. Go to: https://analytics.google.com/
2. Create account and property
3. Get tracking ID
4. Add before `</head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_TRACKING_ID');
</script>
```

### Netlify Analytics:
- Built-in, just enable in site settings
- Shows visitors, page views, etc.

---

## 🔒 Environment Variables (if needed later)

### Netlify:
```bash
netlify env:set KEY value
```

### Vercel:
```bash
vercel env add KEY
```

### GitHub Pages:
- Use GitHub Secrets in repository settings
- Access via GitHub Actions

---

## ✅ Post-Deployment Checklist

After deploying:
- [ ] Visit your live site
- [ ] Test all links
- [ ] Check on mobile device
- [ ] Verify images load
- [ ] Test CV download
- [ ] Check page turning works
- [ ] Test on different browsers
- [ ] Share with friends for feedback
- [ ] Add URL to GitHub profile
- [ ] Update LinkedIn with portfolio link
- [ ] Share on social media

---

## 🎉 Your Site is Live!

Remember your URLs:
- **GitHub Pages**: https://tejo0507.github.io/portfolio/
- **Netlify**: https://[your-site-name].netlify.app
- **Vercel**: https://[your-project].vercel.app

**Share it everywhere!** 🌍

---

*Need more help? Check README.md for detailed instructions!*

# 🚀 Tejo Sridhar M V S - Portfolio

A modern, interactive 3D flip-book style portfolio showcasing my journey as an AIML enthusiast, built with pure HTML, CSS, and JavaScript.

## ✨ Features

- **3D Flip Book Design**: Interactive page-turning animation
- **Modern Red & White Theme**: Professional and eye-catching design
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging transitions and hover effects
- **PWA Ready**: Installable on supported browsers (manifest and service worker included)
- **Keyboard Navigation**: Use arrow keys, Home, and End keys to navigate
- **Performance Optimized**: Fast loading and smooth interactions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader friendly
- **SEO Optimized**: Meta tags and semantic HTML structure

## 📁 Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── style.css           # Main stylesheet (Red & White theme)
├── js/
│   └── script.js       # Enhanced JavaScript with animations
├── css/                # Additional stylesheets (if needed)
├── images/             # Your images go here
│   ├── profile.jpg     # Your profile picture
│   ├── favicon.png     # Website icon
│   └── projects/       # Project screenshots
└── assets/
    └── Tejo_Sridhar_CV.pdf  # Your CV/Resume
```

## 🎨 Sections

1. **Profile Page**: Introduction, bio, and social links
2. **Leadership & Experience**: Your club memberships and roles
3. **Education**: Academic background and achievements
4. **What I Do**: Your expertise and services
5. **Skills**: Technical skills organized by category
6. **Projects**: Featured projects with descriptions
7. **Contact**: Additional projects and contact information

## 🛠️ Setup Instructions

### 1. Add Your Profile Picture
- Place your profile photo in the `/images` folder
- Name it `profile.jpg` (or update the path in `index.html`)
- Recommended size: 500x500px, square format

### 2. Add Your CV
- Place your CV PDF in the `/assets` folder
- Name it `Tejo_Sridhar_CV.pdf` (or update the path in `index.html`)

### 3. Add Project Images (Optional)
- Place project screenshots in `/images/projects/`
- Update image paths in `index.html` if you want to add visual previews

### 4. Update Project Links
- Replace placeholder GitHub links with actual project URLs
- Add live demo links where available
- Update project descriptions with specific details from your project folders

### 5. Customize Colors (Optional)
If you want to change the color scheme, edit the CSS variables in `style.css`:

```css
:root {
    --main-color: #dc2626;      /* Primary red */
    --secondary-color: #ef4444;  /* Lighter red */
    --accent-color: #fca5a5;     /* Soft red accent */
}
```

## 🚀 Deployment Guide

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Personal Portfolio"
   git branch -M main
   git remote add origin https://github.com/Tejo0507/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click "Save"
   - Your site will be live at: `https://tejo0507.github.io/portfolio/`

### Option 2: Netlify

1. **Using Netlify Drop**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop your entire portfolio folder
   - Your site will be live instantly with a random URL
   - You can customize the URL in settings

2. **Using Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --dir=. --prod
   ```

### Option 3: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

### Option 4: Local Testing

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🎯 Customization Tips

### Adding More Projects
1. Copy an existing project card structure in `index.html`
2. Update the project details (name, description, tech, links)
3. The layout will automatically adjust

### Changing the Font
1. Find new fonts at [Google Fonts](https://fonts.google.com/)
2. Add the import link in the HTML `<head>`
3. Update the `font-family` in CSS

### Adding New Sections
1. Create a new page pair in HTML (front and back)
2. Add navigation buttons with proper `data-page` attributes
3. Style it using existing CSS classes as reference

## 🐛 Troubleshooting

### Images Not Loading?
- Check file paths are correct (case-sensitive)
- Ensure images are in the `/images` folder
- Use relative paths: `./images/profile.jpg`

### Pages Not Turning?
- Check JavaScript console for errors (F12)
- Ensure `script.js` is loaded correctly
- Verify `data-page` attributes match element IDs

### CV Download Not Working?
- Ensure the CV file exists in `/assets/` folder
- Check the file name matches exactly
- File must be a `.pdf` format

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (limited support)

## 🔧 Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- BoxIcons for icons
- Google Fonts (Inter & Poppins)

## 📈 Performance Tips

- Compress images before uploading (use TinyPNG)
- Keep image sizes under 500KB each
- Use WebP format for better compression
- Minify CSS and JS for production (optional)

## 🤝 Contributing

This is a personal portfolio, but feel free to:
- Report bugs
- Suggest improvements
- Fork and customize for your own use

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: tejosridhar.mvs@gmail.com
- **LinkedIn**: [linkedin.com/in/tejosridhar](https://www.linkedin.com/in/tejosridhar)
- **GitHub**: [github.com/Tejo0507](https://github.com/Tejo0507)

---

**Made with ❤️ by Tejo Sridhar M V S**

*Last Updated: October 2025*

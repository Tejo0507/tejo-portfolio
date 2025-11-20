# ⚡ Quick Start Guide

Get your portfolio up and running in 5 minutes!

## Step 1: Add Your Profile Picture (2 minutes)

1. Find a professional photo of yourself
2. Rename it to `profile.jpg`
3. Place it in the `images` folder
4. Done! ✅

**Don't have a photo ready?** The portfolio will still work, but you'll see a broken image icon.

## Step 2: Add Your CV (1 minute)

1. Save your CV as PDF
2. Rename it to `Tejo_Sridhar_CV.pdf`
3. Place it in the `assets` folder
4. Done! ✅

**Note:** If you don't add a CV, clicking "Download CV" will show an alert.

## Step 3: Test Locally (1 minute)

**Option A: Simple (Just open the file)**
- Double-click `index.html`
- It will open in your default browser

**Option B: Using a local server (Better)**

If you have Python installed:
```bash
# Open terminal in the Portfolio folder
python -m http.server 8000
```

Then visit: http://localhost:8000

If you have Node.js installed:
```bash
npx http-server -p 8000
```

## Step 4: Deploy Online (1 minute)

### Fastest Method: Netlify Drop

1. Go to: https://app.netlify.com/drop
2. Drag your entire `Portfolio` folder onto the page
3. Wait 10 seconds
4. Your site is live! 🎉

You'll get a URL like: `https://random-name-12345.netlify.app`

You can customize this URL in Netlify settings.

## That's It! 🚀

Your portfolio is now live and ready to share!

---

## Next Steps (Do these when you have time):

### Update Project Links:
1. Open `index.html` in a text editor
2. Find each project section
3. Replace `#` with your actual GitHub URLs
4. Add live demo links if you have them

### Customize Project Details:
1. Update project descriptions with more specific information
2. Add technology tags that match what you actually used
3. Add any screenshots you want to include

### Add More Content:
1. Check the `TODO.md` file for a complete checklist
2. Update any placeholder information
3. Add more projects as you build them

---

## Common Issues & Quick Fixes

### Profile picture not showing?
- Make sure the file is named exactly `profile.jpg` (case-sensitive)
- Check it's in the `images` folder
- Try refreshing the browser (Ctrl+F5)

### Pages not turning?
- Make sure JavaScript is enabled in your browser
- Check the browser console for errors (F12 → Console tab)
- Try refreshing the page

### CV not downloading?
- Make sure the PDF is in the `assets` folder
- Check the filename matches exactly: `Tejo_Sridhar_CV.pdf`
- Clear browser cache and try again

### Styling looks broken?
- Make sure `style.css` is in the same folder as `index.html`
- Make sure `script.js` is in the `js` folder
- Clear browser cache (Ctrl+Shift+Delete)

---

## Keyboard Shortcuts

Once your portfolio is open, try these:

- **→ (Right Arrow)**: Next page
- **← (Left Arrow)**: Previous page
- **Home**: Back to profile
- **End**: Jump to contact page

---

## Quick Customization

### Change Colors:
Open `style.css` and find this section at the top:

```css
:root {
    --main-color: #dc2626;      /* Change this for different primary color */
    --secondary-color: #ef4444;  /* Lighter shade */
}
```

### Popular Color Schemes:
```css
/* Blue Theme */
--main-color: #0ea5e9;
--secondary-color: #38bdf8;

/* Purple Theme */
--main-color: #8b5cf6;
--secondary-color: #a78bfa;

/* Green Theme */
--main-color: #10b981;
--secondary-color: #34d399;

/* Orange Theme */
--main-color: #f97316;
--secondary-color: #fb923c;
```

---

## Need More Help?

- Read the full `README.md` for detailed instructions
- Check `TODO.md` for a complete setup checklist
- Review the code comments for understanding how things work

---

**You're all set! Now go share your portfolio with the world! 🌟**

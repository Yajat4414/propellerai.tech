# 📸 Screenshot Setup Guide for Coming Soon Page

## What Changed?

I've modified the sneak peek section to display **actual screenshots** instead of placeholder boxes, while keeping the beautiful browser dots and phone outline!

### Modified Files:
1. **`coming-soon/index.html`** - Updated to use `<img>` tags for screenshots
2. **`coming-soon/styles.css`** - Added styling for screenshot images
3. **`coming-soon/screenshot-helper.html`** - NEW! Helper tool for taking screenshots

---

## 🎯 How to Add Your Screenshots

### Method 1: Using Screenshot Helper (Recommended)

1. **Start your local server** (if not already running):
   ```bash
   cd /home/yajat4414/propellerai.com
   python3 server.js
   # or
   node server.js
   ```

2. **Open the screenshot helper**:
   ```
   http://localhost:3000/coming-soon/screenshot-helper.html
   ```

3. **Follow the on-screen instructions** to capture both desktop and mobile screenshots

4. **Save the screenshots** in the `coming-soon` folder:
   - `desktop-screenshot.png` (Desktop chat interface)
   - `mobile-screenshot.png` (Mobile chat interface)

---

### Method 2: Manual Screenshot (Using Browser DevTools)

#### For Desktop Screenshot:
1. Open `http://localhost:3000/chat.html` in your browser
2. Resize browser to approximately **1200x600px** or wider
3. Take a screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
4. Save as `desktop-screenshot.png` in `/coming-soon/` folder

#### For Mobile Screenshot:
1. Open `http://localhost:3000/chat.html`
2. Press **F12** to open DevTools
3. Click **Toggle Device Toolbar** (or Ctrl+Shift+M)
4. Select device: **iPhone SE** (375x667) or **iPhone X** (414x896)
5. Take a screenshot of just the phone frame
6. Save as `mobile-screenshot.png` in `/coming-soon/` folder

---

## 📐 Recommended Dimensions

| Type | Dimensions | Aspect Ratio | Notes |
|------|-----------|--------------|-------|
| **Desktop** | 1200x600px+ | 2:1 | Will be cropped to fit browser mockup |
| **Mobile** | 375x667px (iPhone SE) | 9:16 | Perfect fit for phone mockup |
| **Mobile Alt** | 414x896px (iPhone X) | ~9:19.5 | Also works well |

---

## 🎨 Tips for Great Screenshots

### Do's ✅
- ✅ Show the **emerald theme** (#10b981) clearly
- ✅ Include some **chat messages** to show functionality
- ✅ Make sure **sidebar is visible** (desktop)
- ✅ Use **clean, professional content** (no test gibberish)
- ✅ Ensure **good contrast** and readability
- ✅ Save as **PNG format** for best quality

### Don'ts ❌
- ❌ Don't include real personal information
- ❌ Avoid cluttered or messy UI
- ❌ Don't use low-resolution images
- ❌ Avoid screenshots with errors or bugs visible
- ❌ Don't use copyrighted content in messages

---

## 🖼️ What You'll See

After adding screenshots, the coming soon page will show:

### Desktop Preview:
```
┌─────────────────────────────────────┐
│ ⚫ ⚫ ⚫    propellerai.com           │ ← Browser header (unchanged)
├─────────────────────────────────────┤
│                                     │
│     [Your Desktop Screenshot]       │ ← Your actual chat UI!
│                                     │
└─────────────────────────────────────┘
         Chat Interface
```

### Mobile Preview:
```
    ┌─────────────┐
    │    ╔═══╗    │ ← Phone notch (unchanged)
    │    ║   ║    │
    ├─────────────┤
    │             │
    │   [Your]    │ ← Your actual mobile UI!
    │   [Mobile]  │
    │   [Screen]  │
    │   [shot]    │
    │             │
    └─────────────┘
      Mobile App
```

---

## 🚀 Quick Start Commands

```bash
# Navigate to your project
cd /home/yajat4414/propellerai.com

# Option 1: View the coming-soon page
open http://localhost:3000/coming-soon/index.html

# Option 2: Open screenshot helper
open http://localhost:3000/coming-soon/screenshot-helper.html

# Option 3: Take screenshots of your chat page
open http://localhost:3000/chat.html
```

---

## 📝 Checklist

Before uploading to production:

- [ ] Desktop screenshot taken and saved as `desktop-screenshot.png`
- [ ] Mobile screenshot taken and saved as `mobile-screenshot.png`
- [ ] Both images are in `/coming-soon/` folder
- [ ] Images are PNG format
- [ ] Images show clean, professional UI
- [ ] Emerald theme (#10b981) is visible
- [ ] No personal/sensitive information in screenshots
- [ ] Coming-soon page tested and looks good

---

## 🆘 Troubleshooting

**Q: Images don't show up?**
- A: Make sure the filenames are exactly `desktop-screenshot.png` and `mobile-screenshot.png`
- A: Verify they're in the `/coming-soon/` folder (same folder as `index.html`)

**Q: Images look stretched or cropped weird?**
- A: Try using the recommended dimensions above
- A: Make sure screenshots are high resolution (at least 1200px wide for desktop)

**Q: Screenshot helper doesn't work?**
- A: Make sure your local server is running
- A: Check the console for errors (F12)
- A: Manually take screenshots using Method 2 instead

**Q: Want to use different image names?**
- A: Update the `src` attributes in `coming-soon/index.html`:
  ```html
  <img src="your-desktop-image.png" ...>
  <img src="your-mobile-image.png" ...>
  ```

---

## 🎉 You're All Set!

Once you've added your screenshots, the coming-soon page will look **amazing** with your actual app previews! The browser dots and phone outline provide a professional mockup frame for your UI.

Need help? Let me know! 🚀

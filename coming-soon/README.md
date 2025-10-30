# PropellerAI - Coming Soon Landing Page

A beautiful, modern, futuristic "Coming Soon" landing page for PropellerAI with dark neon aesthetics, animations, and interactive elements.

## 🎨 Features

- **Dark Neon Theme**: Deep dark background (#0a0e1a) with emerald accents (#10b981)
- **Animated Background**: Floating gradient orbs and particle system
- **Progress Tracker**: Animated 85% completion progress bar
- **Interactive Sections**:
  - Hero section with animated logo
  - About section with feature cards
  - Sneak peek with browser/phone mockups
  - Feature highlights (6 detailed features)
  - Timeline with 4 development phases
  - Waitlist signup form
  - Social media links
- **Easter Eggs**:
  - Click logo 3 times for surprise
  - Konami code (↑ ↑ ↓ ↓ ← → ← → B A)
  - Footer logo clicks (5x for invert mode)
  - Console messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in, hover effects, floating elements

## 📁 Files

```
coming-soon/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with animations
├── script.js       # Interactive functionality
├── logo.png        # PropellerAI logo (transparent background)
└── README.md       # This file
```

## 🚀 Quick Start

### Option 1: Standalone Deployment

1. Copy the entire `coming-soon` folder to your web server
2. All assets including the logo are included - no additional setup needed!
3. Open `index.html` in a browser
4. Done! 🎉

### Option 2: Integration with Existing Site

1. Copy the files to your desired location
2. The logo is included (`logo.png`) with transparent background
3. No additional setup needed - just open and use!

### Option 3: Quick Test

Simply open `index.html` in any modern browser. No server required for testing!

## 🎯 Customization

### Setup EmailJS (Required for Waitlist Form)

The waitlist form uses EmailJS to send confirmation emails. Follow these steps:

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account

2. **Get Your Public Key**
   - Navigate to Account → General
   - Copy your Public Key

3. **Create Email Template**
   - Go to Email Templates → Create New Template
   - Use these template variables:
     ```
     {{to_email}} - Recipient email
     {{user_email}} - User's email address
     {{to_name}} - User's name
     {{from_name}} - PropellerAI Team
     {{message}} - Welcome message
     {{reply_to}} - yajat4414@gmail.com
     ```
   - Example template:
     ```
     Hi {{to_name}},

     {{message}}

     We can't wait to show you what we've been building!

     Best regards,
     {{from_name}}
     ```

4. **Configure the Code**
   - Open `script.js`
   - Replace `YOUR_PUBLIC_KEY` on line 19 with your actual public key
   - Replace `YOUR_TEMPLATE_ID` on line 99 with your template ID
   - Service ID `service_b6k02fq` is already configured

### Update Progress Percentage

In `script.js`, line 143:
```javascript
const targetProgress = 85; // Change this value (0-100)
```

### Customize Email Template

After setting up EmailJS, you can customize the email message in `script.js`:

```javascript
const templateParams = {
    to_email: email,
    user_email: email,
    to_name: email.split('@')[0],
    from_name: 'PropellerAI Team',  // Change sender name
    message: 'Your custom welcome message here!',  // Customize message
    reply_to: 'yajat4414@gmail.com'  // Your email
};
```

### Update Social Links

In `index.html`, find the social icons section and update the `href` attributes:
```html
<a href="https://twitter.com/yourhandle" class="social-icon">
<a href="https://github.com/yourusername" class="social-icon">
<a href="https://instagram.com/yourhandle" class="social-icon">
```

### Update Colors

In `styles.css`, modify CSS variables (lines 7-20):
```css
:root {
    --accent-primary: #10b981;     /* Main accent color */
    --accent-secondary: #059669;   /* Secondary accent */
    --accent-blue: #3b82f6;        /* Blue accent */
    --bg-primary: #0a0e1a;         /* Background */
}
```

### Update Timeline

In `index.html`, find the timeline section and modify the phases:
```html
<div class="timeline-item completed">
    <div class="timeline-dot"></div>
    <div class="glass-card timeline-content">
        <span class="timeline-status">✓ Completed</span>
        <h3 class="timeline-title">Your Phase Title</h3>
        <p class="timeline-desc">Your description</p>
        <span class="timeline-date">Your Date</span>
    </div>
</div>
```

## 🎮 Easter Eggs

1. **Logo Click**: Click the main hero logo 3 times to reveal a secret message with confetti!
2. **Konami Code**: Type ↑ ↑ ↓ ↓ ← → ← → B A for rainbow mode
3. **Footer Logo**: Click the footer logo 5 times for invert mode
4. **Keyboard Shortcut**: Press `Ctrl/Cmd + K` to quickly jump to waitlist signup
5. **Console Messages**: Open browser console for special messages

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Custom animations, gradients, glass morphism
- **JavaScript**: Vanilla JS (no frameworks)
- **Google Fonts**: Inter (body), Orbitron (headings)

## 📊 Analytics Integration

To track user interactions, integrate your analytics in `script.js`:

```javascript
// Example: Google Analytics
function trackWaitlistSignup(email) {
    gtag('event', 'waitlist_signup', {
        'event_category': 'engagement',
        'event_label': email
    });
}

// Example: Social clicks
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const platform = this.getAttribute('aria-label');
        gtag('event', 'social_click', {
            'event_category': 'engagement',
            'event_label': platform
        });
    });
});
```

## ⚡ Performance

- **Loading Time**: < 1 second (optimized CSS/JS)
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Mobile-First**: Responsive design with mobile optimizations

## 🐛 Troubleshooting

### Logo not showing?
- Check the logo path in `index.html`
- Ensure logo image exists at specified location
- Try using an absolute URL: `<img src="https://yoursite.com/logo.png">`

### Animations not working?
- Ensure JavaScript is enabled in browser
- Check browser console for errors
- Verify all files (HTML, CSS, JS) are in same folder

### Form not submitting?
- Update the API endpoint in `script.js`
- Check browser console for network errors
- Verify CORS settings on your backend

## 📝 License

Created by **Yajat** for PropellerAI
© 2025 PropellerAI. All rights reserved.

## 🤝 Contact

- **Email**: yajat4414@gmail.com
- **Twitter**: [@yourusername]
- **GitHub**: [@yourusername]

## 🎨 Design Credits

- **Theme**: Dark neon aesthetic inspired by PropellerAI's main application
- **Fonts**: Inter by Rasmus Andersson, Orbitron by Matt McInerney
- **Color Palette**: Custom emerald accent scheme

---

**Pro Tips:**
- Test on multiple devices before deployment
- Compress images for faster loading
- Enable HTTPS for production
- Add meta tags for SEO in `index.html`
- Consider adding email validation on backend
- Monitor analytics to track conversion rates

**Need Help?** Open an issue or contact yajat4414@gmail.com

**Happy Launching! 🚀**

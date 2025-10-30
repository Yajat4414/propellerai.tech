# EmailJS Setup - PropellerAI Waitlist

## Current Status
✅ Waitlist form working - emails stored in browser localStorage  
❌ EmailJS not sending emails yet - needs configuration

## What You Have
- **Service ID:** `service_b6k02fq` ✓

## What You Need to Get

### Step 1: Get Public Key
1. Go to https://dashboard.emailjs.com/admin/account
2. Find **Public Key** section
3. Copy your public key (format: `abc123xyz`)

### Step 2: Create Email Template
1. Go to https://dashboard.emailjs.com/admin/templates
2. Click **"Create New Template"**
3. Use these variables in your template:

**Example Template:**
```
Subject: Welcome to PropellerAI! 🚀

Hi {{to_name}},

{{message}}

We're excited to have you on board for the PropellerAI launch!

Best regards,
The {{from_name}}

---
This email was sent to {{to_email}}
Reply to: {{reply_to}}
```

4. Save and copy the **Template ID** (format: `template_abc123`)

### Step 3: Update Configuration

Edit `/coming-soon/script.js`:

**Line 31** - Add your Public Key:
```javascript
emailjs.init('YOUR_PUBLIC_KEY_HERE'); // Replace with your actual key
```

**Line 335** - Add your Template ID:
```javascript
'YOUR_TEMPLATE_ID',  // Replace: service_b6k02fq, template_abc123
```

### Step 4: Test

1. Save the file
2. Refresh http://localhost:3000/coming-soon/
3. Enter your email and click "Notify Me"
4. Check:
   - Browser shows success message
   - EmailJS dashboard shows request
   - Your inbox receives email

## Check Stored Emails

**Browser Console (F12):**
```javascript
// View all collected emails
JSON.parse(localStorage.getItem('propellerai_waitlist'))

// Count signups
JSON.parse(localStorage.getItem('propellerai_waitlist')).length

// Clear list (if needed)
localStorage.removeItem('propellerai_waitlist')
```

## Why No Emails Yet?

The script checks if EmailJS is initialized on line 307:
```javascript
if (typeof emailjs === 'undefined' || !emailjs.send) {
    // EmailJS not ready - store locally instead
}
```

Since line 31 is commented out, EmailJS never initializes, so emails are only stored locally.

## Quick Fix

1. Get Public Key + Template ID from EmailJS dashboard
2. Uncomment line 31 and add Public Key
3. Update line 335 with Template ID
4. Test again - emails will send! ✨

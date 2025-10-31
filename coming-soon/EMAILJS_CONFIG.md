# EmailJS Configuration Guide

## Current Status
✅ Form is working - emails stored locally in browser
❌ EmailJS not configured - no emails being sent

## What You Have
- Service ID: `service_b6k02fq`

## What You Need

### 1. Get Your Public Key
1. Go to https://dashboard.emailjs.com/admin
2. Click on "Account" in the left sidebar
3. Click on "General" 
4. Copy your **Public Key** (looks like: `abc123xyz456`)

### 2. Create Email Template
1. Go to https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Set up your template with these variables:

**Template Example:**
```
Subject: Welcome to PropellerAI Waitlist!

Hi {{to_name}},

{{message}}

Thanks for joining PropellerAI!

Best regards,
{{from_name}}
```

4. Save and copy the **Template ID** (looks like: `template_abc123`)

### 3. Update script.js

Find these two lines and update them:

**Line 31:** Uncomment and add your Public Key
```javascript
emailjs.init('YOUR_PUBLIC_KEY_HERE'); // Replace with actual key
```

**Line 335:** Replace with your Template ID
```javascript
'YOUR_TEMPLATE_ID',  // Replace with actual template ID
```

### 4. Test
1. Save changes
2. Refresh localhost:3000/coming-soon/
3. Enter email and submit
4. Check EmailJS dashboard for activity

## Viewing Stored Emails (Current)

Open browser console (F12) and run:
```javascript
JSON.parse(localStorage.getItem('propellerai_waitlist'))
```

This shows all emails collected so far!

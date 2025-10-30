# EmailJS Setup Guide for PropellerAI Coming Soon Page

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (free plan available)
3. Verify your email

### Step 2: Get Your Public Key
1. Log in to EmailJS dashboard
2. Go to **Account** → **General**
3. Find your **Public Key** (looks like: `abc123xyz`)
4. Copy it

### Step 3: Create Email Service (if not already done)
1. Go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection steps
5. Note: Your Service ID is already set to `service_b6k02fq`

### Step 4: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Give it a name (e.g., "PropellerAI Waitlist Welcome")
4. Copy your **Template ID** (looks like: `template_abc123`)

#### Template Content Example:

**Subject:**
```
Welcome to PropellerAI Waitlist! 🚀
```

**Body:**
```
Hi {{to_name}},

Thank you for joining the PropellerAI waitlist!

{{message}}

We're building something amazing and can't wait to share it with you. You'll be among the first to know when we launch!

Stay tuned for updates.

Best regards,
{{from_name}}

---
Questions? Reply to this email at {{reply_to}}
```

**Template Variables (these are automatically filled):**
- `{{to_email}}` - User's email address
- `{{user_email}}` - User's email (duplicate for flexibility)
- `{{to_name}}` - Generated from email (before @)
- `{{from_name}}` - "PropellerAI Team"
- `{{message}}` - Welcome message
- `{{reply_to}}` - yajat4414@gmail.com

### Step 5: Update the Code

Open `script.js` and make these two changes:

**Change 1 - Line 19:**
```javascript
// Replace this:
emailjs.init('YOUR_PUBLIC_KEY');

// With your actual public key:
emailjs.init('abc123xyz'); // Your public key from Step 2
```

**Change 2 - Line 99:**
```javascript
// Replace this:
'YOUR_TEMPLATE_ID',

// With your template ID:
'template_abc123', // Your template ID from Step 4
```

### Step 6: Test It!
1. Open `index.html` in a browser
2. Scroll to the waitlist section
3. Enter your email
4. Click "Join the Waitlist"
5. Check your email inbox!

## Troubleshooting

### Email not sending?
- Check browser console (F12) for errors
- Verify your Public Key is correct
- Verify your Template ID is correct
- Check EmailJS dashboard for usage limits (free plan: 200 emails/month)
- Make sure your email service is connected and active

### "EmailJS is not defined" error?
- Make sure the EmailJS script is loaded in `index.html` (line 13)
- Check your internet connection

### Receiving emails but user isn't?
- Check spam folder
- Verify the template has correct variables
- Check the email service is properly configured

## Advanced Configuration

### Send to Multiple Emails
Modify the `sendEmailJSNotification` function:

```javascript
// Send to user
await emailjs.send('service_b6k02fq', 'YOUR_TEMPLATE_ID', templateParams);

// Send notification to yourself
await emailjs.send('service_b6k02fq', 'YOUR_ADMIN_TEMPLATE_ID', {
    to_email: 'yajat4414@gmail.com',
    user_email: email,
    message: `New waitlist signup: ${email}`
});
```

### Custom Success Message
Edit line 136 in `script.js`:

```javascript
showMessage('🎉 Your custom success message here!', 'success');
```

### Add More Fields
1. Add input fields to the form in `index.html`
2. Capture values in `script.js`
3. Add them to `templateParams`
4. Use them in your email template

## Support

- **EmailJS Docs:** [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **Need help?** Contact yajat4414@gmail.com

---

**Your Configuration:**
- ✅ Service ID: `service_b6k02fq` (already set)
- ⏳ Public Key: `YOUR_PUBLIC_KEY` (needs to be updated)
- ⏳ Template ID: `YOUR_TEMPLATE_ID` (needs to be updated)

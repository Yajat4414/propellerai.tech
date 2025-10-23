# 🚀 Deployment Guide for propellerai.tech

## Pre-Deployment Checklist

### 1. **Domain Setup**
- [ ] Domain: `propellerai.tech` purchased and DNS configured
- [ ] Point A record to your server IP
- [ ] Configure SSL certificate (Let's Encrypt recommended)

### 2. **Google OAuth Setup**
Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
- [ ] Add authorized JavaScript origins:
  - `https://propellerai.tech`
  - `https://www.propellerai.tech`
- [ ] Add authorized redirect URIs:
  - `https://propellerai.tech/api/auth/google/callback`
  - `https://www.propellerai.tech/api/auth/google/callback`

### 3. **Environment Variables**
- [ ] Copy `.env.production` to `.env`
- [ ] Generate SESSION_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add your Google Client ID and Secret
- [ ] Add your OpenRouter API key
- [ ] Verify ALLOWED_ORIGINS includes your domain

### 4. **Server Setup**
```bash
# Install dependencies
npm install

# Install PM2 globally
npm install -g pm2

# Create necessary directories
mkdir -p data uploads

# Set proper permissions
chmod 700 data uploads
```

### 5. **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d propellerai.tech -d www.propellerai.tech
```

### 6. **Nginx Configuration**
Create `/etc/nginx/sites-available/propellerai.tech`:

```nginx
server {
    listen 80;
    server_name propellerai.tech www.propellerai.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name propellerai.tech www.propellerai.tech;

    ssl_certificate /etc/letsencrypt/live/propellerai.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/propellerai.tech/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for image uploads)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/propellerai.tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Deployment Steps

### 1. **Start the Application**
```bash
# Using PM2 (recommended)
pm2 start server.js --name propellerai
pm2 save
pm2 startup
```

### 2. **Verify Deployment**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs propellerai

# Monitor
pm2 monit
```

### 3. **Test Your Site**
- [ ] Visit https://propellerai.tech
- [ ] Test Google OAuth login
- [ ] Test AI chat functionality
- [ ] Test avatar questionnaires
- [ ] Test image upload (vision feature)
- [ ] Check all pages (Settings, Terms, Privacy)

## Post-Deployment

### Monitoring
```bash
# View application logs
pm2 logs propellerai

# View error logs
tail -f data/error.log

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Maintenance

**Restart application:**
```bash
pm2 restart propellerai
```

**Update code:**
```bash
git pull origin main
npm install
pm2 restart propellerai
```

**Backup data:**
```bash
# Backup user data
tar -czf backup-$(date +%Y%m%d).tar.gz data/ uploads/

# Schedule automatic backups (add to crontab)
0 2 * * * cd /path/to/propellerai.com && tar -czf /backups/backup-$(date +\%Y\%m\%d).tar.gz data/ uploads/
```

### SSL Certificate Renewal
```bash
# Renew certificate (do this every 90 days)
sudo certbot renew

# Or set up auto-renewal (add to crontab)
0 0 1 * * sudo certbot renew --quiet && sudo systemctl reload nginx
```

## Scaling Considerations

When you outgrow JSON storage (~100+ users):

1. **Migrate to Database**
   - MongoDB (recommended for quick migration)
   - PostgreSQL (recommended for production)
   - See README.md for migration guide

2. **Add Redis for Sessions**
   - Replace express-session with connect-redis
   - Improves performance and enables horizontal scaling

3. **Use Cloud Storage for Uploads**
   - AWS S3 or DigitalOcean Spaces
   - Replace local uploads/ folder

4. **Add Load Balancing**
   - Run multiple Node.js instances
   - Use PM2 cluster mode or Nginx load balancing

## Troubleshooting

**OAuth not working:**
- Check GOOGLE_CALLBACK_URL matches Google Console settings
- Verify domain is using HTTPS
- Check ALLOWED_ORIGINS includes your domain

**500 errors:**
- Check `data/error.log`
- Verify all environment variables are set
- Check file permissions on data/ and uploads/

**Cannot upload images:**
- Check uploads/ directory exists and is writable
- Verify client_max_body_size in Nginx config
- Check available disk space

## Security Checklist

- [ ] Strong SESSION_SECRET generated
- [ ] NODE_ENV=production
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured with specific origins
- [ ] Rate limiting active
- [ ] File upload restrictions in place
- [ ] Regular backups scheduled
- [ ] Server firewall configured (only ports 80, 443, 22)
- [ ] Keep dependencies updated: `npm audit fix`

## Support

For issues or questions:
- Email: support@propellerai.tech
- GitHub: https://github.com/Yajat4414/propellerai.tech

---

**Your app is now ready to launch on propellerai.tech! 🚀**

# 🚀 Propeller AI# Propeller AI



A modern AI-powered conversational platform with specialized avatars, vision capabilities, and multi-language support.Your AI-Powered Assistant - A modern chat interface with authentication and AI integration.



## ✨ Features## Features



- **General AI Chat** - Powered by GPT-4o and DeepSeek- 🎨 Beautiful, modern UI with dark theme

- **5 Specialized AI Avatars** - Fitness Coach, Personal Tutor, Career Coach, Finance Advisor, Personal Chef- 🔐 User authentication (Email/Password & Google OAuth)

- **Vision AI** - Upload images for analysis (2 images/day free)- 💬 Real-time chat interface

- **Chat History** - Auto-save every 30 seconds- 📱 Responsive design for mobile and desktop

- **Multi-Language** - Support for 50+ languages- 🎯 Chat history management

- **Light/Dark Mode** - Customizable themes- 🔒 Session-based authentication

- **Secure Authentication** - Google OAuth

- **Rate Limited** - Protected API endpoints## Getting Started



## 🛠️ Tech Stack### Prerequisites



- **Backend:** Node.js, Express.js- Node.js (v14 or higher)

- **Authentication:** Passport.js (Google OAuth)- npm or yarn

- **AI Models:** OpenRouter API (GPT-4o, DeepSeek)

- **Frontend:** Vanilla JavaScript, Tailwind CSS### Installation

- **Storage:** JSON files (easily migrateable to database)

1. Clone the repository or download the files

## 📋 Prerequisites

2. Install dependencies:

- Node.js 16+ and npm```bash

- Google OAuth credentialsnpm install

- OpenRouter API key```



## 🚀 Quick Start3. Create a `.env` file from the example:

```bash

### 1. Clone the repositorycp .env.example .env

```

```bash

git clone <your-repo-url>4. Edit `.env` and add your configuration:

cd propellerai.com   - Change `SESSION_SECRET` to a random string

```   - Add Google OAuth credentials (optional, for Google login)



### 2. Install dependencies### Running the Application



```bash**Development mode** (with auto-reload):

npm install```bash

```npm run dev

```

### 3. Set up environment variables

**Production mode**:

```bash```bash

cp .env.example .envnpm start

``````



Edit `.env` and fill in your credentials:The application will be available at: `http://localhost:3000`



```env## Project Structure

# Get from https://console.cloud.google.com/apis/credentials

GOOGLE_CLIENT_ID=your_google_client_id```

GOOGLE_CLIENT_SECRET=your_google_client_secretpropellerai.com/

GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback├── server.js           # Express server and API endpoints

├── index.html          # Landing page with login/signup

# Get from https://openrouter.ai/keys├── app.html           # Main chat interface

OPENROUTER_API_KEY=your_openrouter_api_key├── assets/

│   └── images/

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"│       └── logo.png   # Application logo

SESSION_SECRET=your_random_secret_here├── package.json       # Dependencies and scripts

├── .env.example       # Environment variables template

NODE_ENV=development└── README.md          # This file

PORT=3000```

```

## API Endpoints

### 4. Set up Google OAuth

### Authentication

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)- `POST /api/auth/signup` - Create new account

2. Create a new project or select existing- `POST /api/auth/login` - Login with email/password

3. Enable Google+ API- `POST /api/auth/logout` - Logout

4. Create OAuth 2.0 credentials- `GET /api/auth/google` - Google OAuth login

5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`- `GET /api/auth/user` - Get current user

6. Copy Client ID and Client Secret to `.env`

### Chat

### 5. Get OpenRouter API Key- `GET /api/chats` - Get user's chat history

- `POST /api/chats` - Create new chat

1. Visit [OpenRouter](https://openrouter.ai/)- `POST /api/chats/:chatId/messages` - Send message

2. Sign up and navigate to [API Keys](https://openrouter.ai/keys)- `PATCH /api/chats/:chatId` - Update chat (rename)

3. Create a new API key- `DELETE /api/chats/:chatId` - Delete chat

4. Add credits to your account

5. Copy API key to `.env`### Other

- `GET /api/health` - Health check endpoint

### 6. Run the application

## Google OAuth Setup (Optional)

```bash

# Development mode1. Go to [Google Cloud Console](https://console.cloud.google.com/)

npm start2. Create a new project or select existing one

3. Enable Google+ API

# Production mode4. Create OAuth 2.0 credentials

NODE_ENV=production npm start5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

```6. Copy Client ID and Client Secret to `.env`



Visit `http://localhost:3000`## Integrating AI



## 📁 Project StructureTo connect a real AI service (OpenAI, Claude, etc.), modify the `/api/chats/:chatId/messages` endpoint in `server.js`:



``````javascript

propellerai.com/// Example with OpenAI

├── server.js              # Main server fileconst OpenAI = require('openai');

├── index.html             # Landing pageconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

├── auth.html              # Authentication page

├── chat.html              # Main chat interfaceapp.post('/api/chats/:chatId/messages', async (req, res) => {

├── avatar-chat.html       # Avatar-specific chat    const { message } = req.body;

├── avatars.html           # Avatar selection    

├── questionnaire.html     # Avatar questionnaires    const completion = await openai.chat.completions.create({

├── avatar-setup.html      # Avatar setup page        model: "gpt-3.5-turbo",

├── settings.html          # User settings        messages: [{ role: "user", content: message }],

├── terms.html             # Terms of Service    });

├── privacy.html           # Privacy Policy    

├── 404.html               # 404 error page    const aiResponse = completion.choices[0].message.content;

├── assets/    // ... handle response

│   └── images/            # Images and logos});

├── data/                  # JSON data storage```

│   ├── users.json

│   ├── chats.json## Security Notes

│   ├── user_chats.json

│   ├── usage.json⚠️ **Important for Production:**

│   └── questionnaires.json

├── uploads/               # User uploaded files1. **Password Hashing**: Currently passwords are stored in plain text. Use bcrypt:

└── .env                   # Environment variables (not in git)   ```javascript

```   const bcrypt = require('bcrypt');

   const hashedPassword = await bcrypt.hash(password, 10);

## 🔐 Security Features   ```



- ✅ Google OAuth authentication2. **Database**: Replace in-memory storage with a real database (MongoDB, PostgreSQL, etc.)

- ✅ Secure session management with httpOnly cookies

- ✅ CORS protection (configurable for production)3. **Environment Variables**: Never commit `.env` file to version control

- ✅ Rate limiting on API endpoints

- ✅ File upload validation and size limits4. **HTTPS**: Use HTTPS in production (set `cookie.secure = true`)

- ✅ Environment-based configuration

- ✅ Error logging in production5. **Rate Limiting**: Add rate limiting to prevent abuse



## 📊 Usage Limits6. **Input Validation**: Add proper input validation and sanitization



**Free Tier:**## Deployment

- 2 image uploads per day (24-hour rolling window)

- 100 API requests per 15 minutes per IP### Heroku

- 20 chat messages per minute per IP```bash

- 10 file uploads per hour per IPheroku create your-app-name

git push heroku main

## 🚀 Deployment```



### Environment Variables for Production### Vercel/Netlify

Configure as a Node.js application with `npm start` as the build command.

```env

NODE_ENV=production## License

PORT=3000

SESSION_SECRET=<strong-random-secret>MIT License - feel free to use for your projects!

GOOGLE_CLIENT_ID=<your-client-id>

GOOGLE_CLIENT_SECRET=<your-client-secret>## Support

GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

OPENROUTER_API_KEY=<your-api-key>For issues or questions, please open an issue on GitHub.

ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `SESSION_SECRET`
- [ ] Update `GOOGLE_CALLBACK_URL` to production URL
- [ ] Set `ALLOWED_ORIGINS` for CORS
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificate
- [ ] Configure backups for `data/` folder
- [ ] Set up monitoring and logging

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name propeller-ai

# Enable startup on boot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs propeller-ai
```

## 🗄️ Database Migration (Recommended for Production)

Current JSON file storage is suitable for development and small-scale deployment. For production, consider migrating to:

- **MongoDB** - Document-based, easy migration from JSON
- **PostgreSQL** - Relational database with JSONB support
- **MySQL** - Traditional relational database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Email: support@propellerai.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/propellerai/issues)

## 🙏 Acknowledgments

- OpenAI for GPT-4o
- DeepSeek for fast AI responses
- Tailwind CSS for styling
- Google OAuth for authentication

---

**Built with ❤️ by the Propeller AI team**

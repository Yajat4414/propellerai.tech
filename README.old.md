# Propeller AI

Your AI-Powered Assistant - A modern chat interface with authentication and AI integration.

## Features

- 🎨 Beautiful, modern UI with dark theme
- 🔐 User authentication (Email/Password & Google OAuth)
- 💬 Real-time chat interface
- 📱 Responsive design for mobile and desktop
- 🎯 Chat history management
- 🔒 Session-based authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the files

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your configuration:
   - Change `SESSION_SECRET` to a random string
   - Add Google OAuth credentials (optional, for Google login)

### Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Project Structure

```
propellerai.com/
├── server.js           # Express server and API endpoints
├── index.html          # Landing page with login/signup
├── app.html           # Main chat interface
├── assets/
│   └── images/
│       └── logo.png   # Application logo
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
└── README.md          # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/user` - Get current user

### Chat
- `GET /api/chats` - Get user's chat history
- `POST /api/chats` - Create new chat
- `POST /api/chats/:chatId/messages` - Send message
- `PATCH /api/chats/:chatId` - Update chat (rename)
- `DELETE /api/chats/:chatId` - Delete chat

### Other
- `GET /api/health` - Health check endpoint

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Integrating AI

To connect a real AI service (OpenAI, Claude, etc.), modify the `/api/chats/:chatId/messages` endpoint in `server.js`:

```javascript
// Example with OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chats/:chatId/messages', async (req, res) => {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
    });
    
    const aiResponse = completion.choices[0].message.content;
    // ... handle response
});
```

## Security Notes

⚠️ **Important for Production:**

1. **Password Hashing**: Currently passwords are stored in plain text. Use bcrypt:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Database**: Replace in-memory storage with a real database (MongoDB, PostgreSQL, etc.)

3. **Environment Variables**: Never commit `.env` file to version control

4. **HTTPS**: Use HTTPS in production (set `cookie.secure = true`)

5. **Rate Limiting**: Add rate limiting to prevent abuse

6. **Input Validation**: Add proper input validation and sanitization

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel/Netlify
Configure as a Node.js application with `npm start` as the build command.

## License

MIT License - feel free to use for your projects!

## Support

For issues or questions, please open an issue on GitHub.

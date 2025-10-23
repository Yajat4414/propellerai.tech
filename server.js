const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and common document types
        const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|txt|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
});

// Middleware
// CORS configuration - restrict in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : false)
        : true,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(uploadsDir));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 chat requests per minute
    message: 'Too many messages, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);
app.use('/api/chat', chatLimiter);
app.use('/api/upload', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour per IP
    message: 'Upload limit exceeded, please try again later.'
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'propeller-ai-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Helper function for logging (only in development)
const log = (...args) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args);
    }
};

// In-memory user storage (replace with database in production)
const users = new Map();
// In-memory chat storage (replace with database in production)
const chats = new Map(); // Map<chatId, chat>
const userChats = new Map(); // Map<userId, Set<chatId>>
// In-memory usage tracking for image uploads
const userImageUploads = new Map(); // Map<userId, { count: number, lastUpload: timestamp, cooldownUntil: timestamp }>
// In-memory avatar questionnaires storage
const avatarQuestionnaires = new Map(); // Map<userId, Map<avatarType, answers>>

// Data persistence file paths
const DATA_DIR = path.join(__dirname, 'data');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');
const USER_CHATS_FILE = path.join(DATA_DIR, 'user_chats.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');
const QUESTIONNAIRES_FILE = path.join(DATA_DIR, 'questionnaires.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from disk on startup
function loadData() {
    try {
        // Load users
        if (fs.existsSync(USERS_FILE)) {
            const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
            Object.entries(usersData).forEach(([id, user]) => users.set(id, user));
            log('Loaded', users.size, 'users from disk');
        }
        
        // Load chats
        if (fs.existsSync(CHATS_FILE)) {
            const chatsData = JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8'));
            Object.entries(chatsData).forEach(([id, chat]) => chats.set(id, chat));
            log('Loaded', chats.size, 'chats from disk');
        }
        
        // Load user chats mapping
        if (fs.existsSync(USER_CHATS_FILE)) {
            const userChatsData = JSON.parse(fs.readFileSync(USER_CHATS_FILE, 'utf8'));
            Object.entries(userChatsData).forEach(([userId, chatIds]) => {
                userChats.set(userId, new Set(chatIds));
            });
            log('Loaded user-chat mappings for', userChats.size, 'users');
        }
        
        // Load usage data
        if (fs.existsSync(USAGE_FILE)) {
            const usageData = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
            Object.entries(usageData).forEach(([userId, usage]) => {
                userImageUploads.set(userId, usage);
            });
            log('Loaded usage data for', userImageUploads.size, 'users');
        }
        
        // Load questionnaires data
        if (fs.existsSync(QUESTIONNAIRES_FILE)) {
            const questionnairesData = JSON.parse(fs.readFileSync(QUESTIONNAIRES_FILE, 'utf8'));
            Object.entries(questionnairesData).forEach(([userId, avatarAnswers]) => {
                avatarQuestionnaires.set(userId, new Map(Object.entries(avatarAnswers)));
            });
            log('Loaded questionnaires for', avatarQuestionnaires.size, 'users');
        }
    } catch (error) {
        console.error('Error loading data from disk:', error);
    }
}

// Save data to disk
function saveData() {
    try {
        // Save users
        const usersObj = Object.fromEntries(users);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersObj, null, 2));
        
        // Save chats
        const chatsObj = Object.fromEntries(chats);
        fs.writeFileSync(CHATS_FILE, JSON.stringify(chatsObj, null, 2));
        
        // Save user chats mapping (convert Sets to Arrays)
        const userChatsObj = {};
        userChats.forEach((chatIds, userId) => {
            userChatsObj[userId] = Array.from(chatIds);
        });
        fs.writeFileSync(USER_CHATS_FILE, JSON.stringify(userChatsObj, null, 2));
        
        // Save usage data
        const usageObj = Object.fromEntries(userImageUploads);
        fs.writeFileSync(USAGE_FILE, JSON.stringify(usageObj, null, 2));
        
        // Save questionnaires (convert nested Maps to Objects)
        const questionnairesObj = {};
        avatarQuestionnaires.forEach((avatarAnswers, userId) => {
            questionnairesObj[userId] = Object.fromEntries(avatarAnswers);
        });
        fs.writeFileSync(QUESTIONNAIRES_FILE, JSON.stringify(questionnairesObj, null, 2));
        
        log('Data saved to disk');
    } catch (error) {
        console.error('Error saving data to disk:', error);
    }
}

// Load data on startup
loadData();

// Auto-save every 30 seconds
setInterval(saveData, 30000);

// Save on process exit
process.on('SIGINT', () => {
    console.log('\nSaving data before exit...');
    saveData();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nSaving data before exit...');
    saveData();
    process.exit(0);
});

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user);
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Check if user exists
        let user = Array.from(users.values()).find(u => u.email === profile.emails[0].value);
        
        if (!user) {
            // Create new user
            user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0]?.value,
                provider: 'google',
                createdAt: new Date().toISOString()
            };
            users.set(user.id, user);
            log('Created new user:', user.id, user.email);
        } else {
            log('User logged in:', user.id, user.email);
        }
        
        return done(null, user);
    }));
}

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Routes

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve auth.html for auth page
app.get('/auth', (req, res) => {
    // If user is already authenticated, redirect to chat
    if (req.isAuthenticated()) {
        return res.redirect('/chat');
    }
    res.sendFile(path.join(__dirname, 'auth.html'));
});

// Serve app.html for chat interface
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.html'));
});

// Serve chat.html for chat interface
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Serve settings.html for settings page
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'));
});

// Serve terms.html for Terms of Service
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

// Serve privacy.html for Privacy Policy
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});

// Serve avatars.html for avatars page
app.get('/avatars', (req, res) => {
    res.sendFile(path.join(__dirname, 'avatars.html'));
});

// Serve questionnaire.html
app.get('/questionnaire', (req, res) => {
    res.sendFile(path.join(__dirname, 'questionnaire.html'));
});

// Serve avatar-setup.html
app.get('/avatar-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'avatar-setup.html'));
});

// Serve avatar-chat.html
app.get('/avatar-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'avatar-chat.html'));
});

// Check if user has completed questionnaire for an avatar
app.get('/api/avatar/:avatarType/status', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { avatarType } = req.params;
    const userId = req.user.id;
    
    const userQuestionnaires = avatarQuestionnaires.get(userId);
    const hasQuestionnaire = userQuestionnaires && userQuestionnaires.has(avatarType);
    
    res.json({ 
        hasQuestionnaire,
        answers: hasQuestionnaire ? userQuestionnaires.get(avatarType) : null
    });
});

// Save avatar questionnaire
app.post('/api/avatar/:avatarType/questionnaire', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { avatarType } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    if (!avatarQuestionnaires.has(userId)) {
        avatarQuestionnaires.set(userId, new Map());
    }

    const userQuestionnaires = avatarQuestionnaires.get(userId);
    userQuestionnaires.set(avatarType, answers);
    
    // Save to disk
    saveData();
    
    res.json({ success: true });
});

// Serve avatar-questionnaire.html
app.get('/avatar-questionnaire', (req, res) => {
    res.sendFile(path.join(__dirname, 'avatar-questionnaire.html'));
});

// Check if user has completed questionnaire for an avatar
app.get('/api/avatar-questionnaire/:avatarType', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { avatarType } = req.params;
    const userId = req.user.id;
    
    const userQuestionnaires = avatarQuestionnaires.get(userId);
    const hasQuestionnaire = userQuestionnaires && userQuestionnaires.has(avatarType);
    
    res.json({ 
        hasQuestionnaire,
        answers: hasQuestionnaire ? userQuestionnaires.get(avatarType) : null
    });
});

// Save avatar questionnaire
app.post('/api/avatar-questionnaire', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { avatarType, answers } = req.body;
    const userId = req.user.id;
    
    if (!avatarType || !answers) {
        return res.status(400).json({ error: 'Avatar type and answers are required' });
    }
    
    // Get or create user's questionnaires map
    if (!avatarQuestionnaires.has(userId)) {
        avatarQuestionnaires.set(userId, new Map());
    }
    
    const userQuestionnaires = avatarQuestionnaires.get(userId);
    userQuestionnaires.set(avatarType, answers);
    
    // Save to disk
    saveData();
    
    res.json({ success: true, message: 'Questionnaire saved successfully' });
});

// Google OAuth routes
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth' }),
    (req, res) => {
        // Successful authentication, redirect to chat
        res.redirect('/chat');
    }
);

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/auth/user', isAuthenticated, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
});

// Chat API endpoints

// Get chat history
app.get('/api/chats', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    log('Loading chats for user:', userId);
    const userChatIds = userChats.get(userId) || new Set();
    log('User chat IDs:', Array.from(userChatIds));
    
    const userChatsList = Array.from(userChatIds)
        .map(chatId => chats.get(chatId))
        .filter(chat => chat) // Filter out any undefined
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by most recent
    
    log('Returning chats count:', userChatsList.length);
    res.json({ chats: userChatsList });
});

// Get specific chat
app.get('/api/chats/:chatId', isAuthenticated, (req, res) => {
    const { chatId } = req.params;
    const chat = chats.get(chatId);
    
    if (!chat || chat.userId !== req.user.id) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json({ chat });
});

// Create new chat
app.post('/api/chats', isAuthenticated, (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    
    const newChat = {
        id: Date.now().toString(),
        userId: userId,
        title: title || 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Store chat
    chats.set(newChat.id, newChat);
    
    // Add to user's chat list
    if (!userChats.has(userId)) {
        userChats.set(userId, new Set());
    }
    userChats.get(userId).add(newChat.id);
    
    // Save data
    saveData();
    
    res.json({ success: true, chat: newChat });
});

// Send message and get AI response
app.post('/api/chats/:chatId/messages', isAuthenticated, async (req, res) => {
    const { chatId } = req.params;
    const { message, conversationHistory, language, attachments, personalityPrompt, personality } = req.body;
    
    if (!message && (!attachments || attachments.length === 0)) {
        return res.status(400).json({ error: 'Message or attachment is required' });
    }
    
    try {
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            attachments: attachments || [],
            timestamp: new Date().toISOString()
        };
        
        // Language-specific system prompts
        const languagePrompts = {
            'en': 'You are Propeller, an intelligent and helpful AI assistant. Be concise, accurate, and friendly in your responses. When analyzing images, describe what you see in detail.',
            'es': 'Eres Propeller, un asistente de IA inteligente y servicial. Sé conciso, preciso y amigable en tus respuestas. Responde siempre en español. Cuando analices imágenes, describe lo que ves en detalle.',
            'fr': 'Vous êtes Propeller, un assistant IA intelligent et serviable. Soyez concis, précis et amical dans vos réponses. Répondez toujours en français. Lorsque vous analysez des images, décrivez ce que vous voyez en détail.',
            'de': 'Du bist Propeller, ein intelligenter und hilfreicher KI-Assistent. Sei präzise, genau und freundlich in deinen Antworten. Antworte immer auf Deutsch. Beschreibe beim Analysieren von Bildern detailliert, was du siehst.',
            'zh': '你是Propeller，一个智能且乐于助人的AI助手。在回答中要简洁、准确和友好。始终用中文回答。分析图像时，详细描述你看到的内容。',
            'ja': 'あなたはPropellerという知的で役立つAIアシスタントです。簡潔で正確、親しみやすい回答を心がけてください。常に日本語で回答してください。画像を分析する際は、見えるものを詳しく説明してください。',
            'hi': 'आप Propeller हैं, एक बुद्धिमान और सहायक AI सहायक। अपने उत्तरों में संक्षिप्त, सटीक और मिलनसार रहें। हमेशा हिंदी में जवाब दें। छवियों का विश्लेषण करते समय, आप जो देखते हैं उसका विस्तार से वर्णन करें।'
        };
        
        // Use personality prompt if provided, otherwise use language-specific prompt
        let systemPrompt;
        if (personalityPrompt) {
            systemPrompt = personalityPrompt;
        } else {
            systemPrompt = languagePrompts[language || 'en'] || languagePrompts['en'];
        }
        
        // Build user content - handle text and images
        let userContent = [];
        
        // Add text if present
        if (message && message.trim()) {
            userContent.push({
                type: 'text',
                text: message
            });
        }
        
        // Add images if present
        if (attachments && attachments.length > 0) {
            log('Processing attachments:', attachments.length);
            for (const attachment of attachments) {
                log('Attachment type:', attachment.mimetype);
                if (attachment.mimetype.startsWith('image/')) {
                    // Read image and convert to base64
                    try {
                        const imagePath = path.join(__dirname, attachment.path);
                        log('Reading image from:', imagePath);
                        const imageBuffer = fs.readFileSync(imagePath);
                        const base64Image = imageBuffer.toString('base64');
                        log('Image converted to base64, length:', base64Image.length);
                        
                        userContent.push({
                            type: 'image_url',
                            image_url: {
                                url: `data:${attachment.mimetype};base64,${base64Image}`
                            }
                        });
                    } catch (error) {
                        console.error('Error reading image:', error);
                    }
                }
            }
        }
        
        log('User content structure:', JSON.stringify(userContent, null, 2).substring(0, 500));
        
        // Prepare messages for OpenRouter API
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...(conversationHistory || []).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: userContent.length === 1 && userContent[0].text ? userContent[0].text : userContent
            }
        ];
        
        // Choose model based on whether we have images
        const hasImages = attachments && attachments.some(a => a.mimetype.startsWith('image/'));
        const modelToUse = hasImages 
            ? 'openai/gpt-4o'  // Use GPT-4o for images (vision-capable)
            : 'deepseek/deepseek-chat';  // Use free DeepSeek model for text-only
        
        log(`Using model: ${modelToUse} (hasImages: ${hasImages})`);
        
        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Propeller AI'
            },
            body: JSON.stringify({
                model: modelToUse,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenRouter API error:', errorData);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        const aiMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        };
        
        // Get or create chat
        let chat = chats.get(chatId);
        let isNewChat = false;
        if (!chat) {
            // Create new chat if it doesn't exist
            isNewChat = true;
            chat = {
                id: chatId,
                userId: req.user.id,
                title: 'New Chat',
                personality: personality || null,
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            chats.set(chatId, chat);
            
            // Add to user's chat list
            if (!userChats.has(req.user.id)) {
                userChats.set(req.user.id, new Set());
            }
            userChats.get(req.user.id).add(chatId);
        }
        
        // Add messages to chat
        chat.messages.push(userMessage, aiMessage);
        chat.updatedAt = new Date().toISOString();
        
        // Generate title for new chat using AI
        if (isNewChat) {
            try {
                const titleResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'Propeller AI'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'Generate a short, concise title (2-5 words) for this conversation. Only return the title, nothing else.'
                            },
                            {
                                role: 'user',
                                content: `First message: "${message}"`
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 20
                    })
                });
                
                if (titleResponse.ok) {
                    const titleData = await titleResponse.json();
                    let generatedTitle = titleData.choices[0].message.content.trim();
                    // Remove quotes if present
                    generatedTitle = generatedTitle.replace(/^["']|["']$/g, '');
                    chat.title = generatedTitle;
                }
            } catch (error) {
                console.error('Error generating title:', error);
                // Fallback to using first message
                chat.title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
            }
        }
        
        // Save data after chat update
        saveData();
        
        res.json({ 
            success: true, 
            messages: [userMessage, aiMessage],
            chat: chat
        });
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI response',
            message: error.message 
        });
    }
});

// Update chat (rename)
app.patch('/api/chats/:chatId', isAuthenticated, (req, res) => {
    const { chatId } = req.params;
    const { title } = req.body;
    
    const chat = chats.get(chatId);
    if (!chat || chat.userId !== req.user.id) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    
    // Save data
    saveData();
    
    res.json({ 
        success: true, 
        chat: chat
    });
});

// Delete chat
app.delete('/api/chats/:chatId', isAuthenticated, (req, res) => {
    const { chatId } = req.params;
    
    const chat = chats.get(chatId);
    if (!chat || chat.userId !== req.user.id) {
        return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Remove from storage
    chats.delete(chatId);
    
    // Remove from user's chat list
    const userChatIds = userChats.get(req.user.id);
    if (userChatIds) {
        userChatIds.delete(chatId);
    }
    
    // Save data
    saveData();
    
    res.json({ success: true, message: 'Chat deleted' });
});

// File upload endpoint (for chat attachments)
app.post('/api/upload', isAuthenticated, upload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const userId = req.user.id;
        const now = Date.now();
        
        // Count image files
        const imageFiles = req.files.filter(file => file.mimetype.startsWith('image/'));
        
        if (imageFiles.length > 0) {
            // Get or initialize user's upload tracking
            let userUsage = userImageUploads.get(userId);
            
            if (!userUsage) {
                userUsage = { count: 0, lastUpload: null, cooldownUntil: null };
                userImageUploads.set(userId, userUsage);
            }
            
            // Check if user is in cooldown
            if (userUsage.cooldownUntil && now < userUsage.cooldownUntil) {
                const remainingTime = Math.ceil((userUsage.cooldownUntil - now) / 1000 / 60); // minutes
                return res.status(429).json({ 
                    error: 'Upload limit reached', 
                    message: `You've reached your daily limit. Please wait ${remainingTime} minutes.`,
                    cooldownUntil: userUsage.cooldownUntil,
                    remainingMinutes: remainingTime
                });
            }
            
            // Reset count if it's been more than 24 hours since last upload
            if (userUsage.lastUpload && (now - userUsage.lastUpload) > 24 * 60 * 60 * 1000) {
                userUsage.count = 0;
                userUsage.cooldownUntil = null;
            }
            
            // Check if adding these images would exceed the limit
            if (userUsage.count + imageFiles.length > 2) {
                const allowedCount = Math.max(0, 2 - userUsage.count);
                return res.status(429).json({ 
                    error: 'Upload limit reached', 
                    message: `You can only upload 2 images per day. You have ${allowedCount} upload(s) remaining.`,
                    limit: 2,
                    used: userUsage.count,
                    remaining: allowedCount
                });
            }
            
            // Update usage tracking
            userUsage.count += imageFiles.length;
            
            // Set lastUpload only on first upload (for 24h reset calculation)
            if (!userUsage.lastUpload) {
                userUsage.lastUpload = now;
            }
            
            // If user has reached the limit, set cooldown to 24 hours from first upload
            if (userUsage.count >= 2) {
                userUsage.cooldownUntil = userUsage.lastUpload + (24 * 60 * 60 * 1000); // 24 hours from first upload
            }
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        }));

        res.json({ success: true, files });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed', message: error.message });
    }
});

// Get user usage statistics
app.get('/api/usage', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const userUsage = userImageUploads.get(userId);
    const now = Date.now();
    
    if (!userUsage) {
        return res.json({
            imageUploads: {
                limit: 2,
                used: 0,
                remaining: 2,
                cooldownActive: false,
                cooldownUntil: null,
                resetIn: null
            }
        });
    }
    
    // Check if cooldown has expired
    const cooldownActive = userUsage.cooldownUntil && now < userUsage.cooldownUntil;
    const cooldownUntil = cooldownActive ? userUsage.cooldownUntil : null;
    const cooldownMinutes = cooldownActive ? Math.ceil((userUsage.cooldownUntil - now) / 1000 / 60) : null;
    
    // Check if 24 hours have passed since last upload
    const resetIn = userUsage.lastUpload ? Math.max(0, Math.ceil((userUsage.lastUpload + 24 * 60 * 60 * 1000 - now) / 1000 / 60)) : null;
    
    res.json({
        imageUploads: {
            limit: 2,
            used: userUsage.count,
            remaining: Math.max(0, 2 - userUsage.count),
            cooldownActive,
            cooldownUntil,
            cooldownMinutes,
            resetIn,
            lastUpload: userUsage.lastUpload
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Log error to console (always)
    console.error('Error:', err);
    
    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };
        
        const errorLogPath = path.join(__dirname, 'data', 'error.log');
        fs.appendFileSync(errorLogPath, JSON.stringify(errorLog) + '\n');
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler - serve custom 404 page for browser requests, JSON for API
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     🚀 Propeller AI Server Running                   ║
║                                                       ║
║     Local:    http://localhost:${PORT}                  ║
║     Network:  http://0.0.0.0:${PORT}                    ║
║                                                       ║
║     Environment: ${process.env.NODE_ENV || 'development'.padEnd(35)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
    
    if (!process.env.GOOGLE_CLIENT_ID) {
        console.log('\n⚠️  Warning: GOOGLE_CLIENT_ID not set. Google OAuth will not work.');
        console.log('   Create a .env file with your Google OAuth credentials.\n');
    }
});

module.exports = app;

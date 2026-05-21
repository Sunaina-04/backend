
const express = require('express');
const http = require('http');           
const { Server } = require('socket.io'); 
const cors = require('cors');
const cookieParser = require("cookie-parser"); 
const session = require('express-session');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const prisma = require('./config/prisma');

// 2. Load Configs
dotenv.config();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

const corsOptions = {
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204
};

// 3. Initialize App & Connect DB
const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => callback(null, isAllowedOrigin(origin)), 
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true 
    }
});

app.set('socketio', io);
app.set('io', io);

// 5. Global Middleware
app.use(cors(corsOptions));
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return cors(corsOptions)(req, res, () => res.sendStatus(204));
    }

    return next();
});

app.use(express.json()); 
app.use(cookieParser()); 
app.use(session({
    secret: process.env.SESSION_SECRET || 'incident-reporting-dev-secret',
    name: 'incident.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('Unauthorized socket connection'));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'incident-reporting-jwt-secret'
        );

        socket.data.user = {
            id: String(decoded.id),
            username: decoded.username,
            role: decoded.role
        };

        return next();
    } catch (error) {
        return next(new Error('Unauthorized socket connection'));
    }
});

io.on('connection', (socket) => {
    console.log(`New Client Connected: ${socket.id}`);

    if (socket.data.user?.role === 'Admin') {
        socket.join('admin');
    }

    socket.join(`user:${socket.data.user?.id}`);

    socket.on('disconnect', () => {
        console.log(' Client Disconnected');
    });
});
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const verifiedRoutes = require('./routes/verifiedRoutes');

app.use('/api', authRoutes);           
app.use('/api/incidents', incidentRoutes); 
app.use('/api/verified-incidents', verifiedRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

const startServer = async () => {
    try {
        await prisma.$connect();
        server.listen(PORT, HOST, () => {
            console.log(`✅ Server running on ${publicUrl}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to PostgreSQL:', error.message);
        process.exit(1);
    }
};

startServer();

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
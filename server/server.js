// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');

// const app = express();

// // Middleware
// app.use(cors()); 
// app.use(express.json()); 

// // mounting
// app.use('/api', authRoutes);
// app.use('/api/incidents', incidentRoutes);

// // self made middleware 
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     next();
// });


// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
// });


// 1. Core Modules & Environment Setup
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // NEW: From new syllabus
const connectDB = require('./config/db'); // NEW: The file we created earlier

// 2. Load Configs
dotenv.config(); // Must be at the very top to provide MONGO_URI to other files

// 3. Initialize App & Connect DB
const app = express();
connectDB(); // NEW: Connecting to MongoDB Atlas

// 4. Global Middleware (Application-level)
app.use(cors()); 
app.use(express.json()); // Built-in Middleware: Body parser for JSON

// 5. Your Logging Middleware (Self-made)
// Moving this UP so it logs EVERY request, including the ones that hit routes below
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 6. Routes (Mounting)
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

app.use('/api', authRoutes);
app.use('/api/incidents', incidentRoutes);

// 7. Error-Handling Middleware (NEW: From new syllabus)
// This MUST be the last middleware in the stack
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

// 8. Server Start
const PORT = process.env.PORT || 5000; // Use .env port if available
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.url}`);
  next();
});

// Health check / Base route
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    message: 'TaskFlow Multi-User API is running',
    version: '2.0.0',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TaskFlow Server running on http://0.0.0.0:${PORT}`);
});

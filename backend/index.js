require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');
const achievementRoutes = require('./routes/achievements');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with DNS fallback
const dns = require('dns');

// Use Google's DNS servers for SRV lookup (fixes ISP DNS issues)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);
app.use('/progress', progressRoutes);
app.use('/admin', adminRoutes);
app.use('/achievements', achievementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 DailyXP Backend running on port ${PORT}`);
  });
});

module.exports = app;

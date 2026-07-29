const dns = require('dns');

dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);
require('dotenv').config();
console.log("ENV CHECK");
console.log("PORT:", process.env.PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("MONGO EXISTS:", !!process.env.MONGODB_URI);
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

// Try to connect to database (non-blocking)
connectDB().catch(err => {
  console.error('Database connection failed (server still running):', err.message);
});

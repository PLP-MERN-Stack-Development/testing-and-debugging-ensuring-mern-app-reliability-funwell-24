const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const debugLogger = require('./middleware/debugLogger'); // Add this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(debugLogger); // Add debug logging middleware

// Routes
app.use('/api/users', userRoutes);

// Health check with debug info
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    debug: {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      memoryUsage: process.memoryUsage()
    }
  });
});

// Error handling
app.use(errorHandler);

// Database connection with debug
mongoose.connect('mongodb://localhost:27017/mern_testing_simple')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
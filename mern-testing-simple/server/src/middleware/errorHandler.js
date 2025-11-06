const errorHandler = (err, req, res, next) => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    body: req.body
  };

  // Log full error details for debugging
  console.error('🚨 Server Error:', errorDetails);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: `Validation error: ${errors.join(', ')}`,
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
    debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
  });
};

module.exports = errorHandler;
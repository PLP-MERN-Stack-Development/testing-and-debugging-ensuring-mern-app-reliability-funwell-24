const debugLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log('🔍 Incoming Request:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Debug: Log request body for non-GET requests
  if (req.method !== 'GET' && req.body) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }

  // Store original send method
  const originalSend = res.send;

  // Override send method to capture response
  res.send = function(data) {
    const duration = Date.now() - start;
    
    console.log('📤 Response Sent:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    // Log response data for errors
    if (res.statusCode >= 400) {
      console.log('❌ Error Response:', data);
    }

    originalSend.call(this, data);
  };

  next();
};

module.exports = debugLogger;
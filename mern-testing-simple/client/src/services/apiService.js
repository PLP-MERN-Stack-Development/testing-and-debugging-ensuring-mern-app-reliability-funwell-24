import debugLogger from '../utils/debugLogger';

class ApiService {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = Date.now();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      debugLogger.debug('API Request Started', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body
      });

      const response = await fetch(url, config);
      const duration = Date.now() - startTime;

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        debugLogger.error('API Response Parse Error', {
          url,
          status: response.status,
          statusText: response.statusText,
          parseError: parseError.message
        });
        throw new Error('Invalid JSON response from server');
      }

      debugLogger.info('API Request Completed', {
        url,
        method: config.method || 'GET',
        status: response.status,
        duration: `${duration}ms`,
        response: data
      });

      if (!response.ok) {
        debugLogger.warn('API Request Failed', {
          url,
          status: response.status,
          response: data
        });
        
        throw new Error(data.message || `API error: ${response.status}`);
      }

      return data;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      debugLogger.error('API Request Error', {
        url,
        method: config.method || 'GET',
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default ApiService;
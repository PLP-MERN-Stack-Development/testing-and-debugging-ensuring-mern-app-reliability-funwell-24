import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      setIsLoading(true);
      await onLogin(username.trim());
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💬 Chat Application</h1>
          <p>Join the conversation in real-time</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Choose a username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={!username.trim() || isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Chat'}
          </button>
        </form>

        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Real-time messaging</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <span>Multiple rooms</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Private chats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
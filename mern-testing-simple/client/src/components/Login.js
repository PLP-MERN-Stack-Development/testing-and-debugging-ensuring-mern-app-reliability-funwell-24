import React, { useState } from 'react';

const Login = ({ onLogin, validateEmail, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" data-testid="login-form">
      <h2>Login</h2>
      <p>Enter your credentials to login</p>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          data-testid="email-input"
        />
        {errors.email && <span className="error" data-testid="email-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          data-testid="password-input"
        />
        {errors.password && <span className="error" data-testid="password-error">{errors.password}</span>}
      </div>

      <button type="submit" className="btn btn-primary" data-testid="login-btn">
        Login
      </button>

      <div className="auth-switch">
        <p>Don't have an account? <button type="button" onClick={switchToRegister} className="link-btn">Register here</button></p>
      </div>
    </form>
  );
};

export default Login;
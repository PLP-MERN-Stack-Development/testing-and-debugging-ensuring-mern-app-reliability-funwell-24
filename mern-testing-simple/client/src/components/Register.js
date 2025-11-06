import React, { useState } from 'react';

const Register = ({ onRegister, validateEmail, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegister(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" data-testid="register-form">
      <h2>Create Account</h2>
      <p>Register to get started</p>

      <div className="form-group">
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          data-testid="name-input"
        />
        {errors.name && <span className="error" data-testid="name-error">{errors.name}</span>}
      </div>

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
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          data-testid="password-input"
        />
        {errors.password && <span className="error" data-testid="password-error">{errors.password}</span>}
      </div>

      <button type="submit" className="btn btn-primary" data-testid="register-btn">
        Register
      </button>

      <div className="auth-switch">
        <p>Already have an account? <button type="button" onClick={switchToLogin} className="link-btn">Login here</button></p>
      </div>
    </form>
  );
};

export default Register;
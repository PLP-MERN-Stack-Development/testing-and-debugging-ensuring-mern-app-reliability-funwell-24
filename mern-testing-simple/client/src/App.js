import React, { useState } from 'react';
import User from './components/User';
import Login from './components/Login';
import Register from './components/Register';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPanel from './components/DebugPanel'; // Add this import
import { formatName, validateEmail } from './utils/helpers';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123' }
  ]);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);

  const handleRegister = (userData) => {
    const existingUser = registeredUsers.find(u => u.email === userData.email);
    if (existingUser) {
      alert('User with this email already exists!');
      return;
    }

    const newUser = {
      ...userData,
      id: registeredUsers.length + 1,
      name: formatName(userData.name)
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    
    const userForDisplay = { ...newUser };
    delete userForDisplay.password;
    setUsers([...users, userForDisplay]);

    alert('Registration successful! Please login with your credentials.');
    setIsLogin(true);
  };

  const handleLogin = (loginData) => {
    const foundUser = registeredUsers.find(
      u => u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      const userForSession = { ...foundUser };
      delete userForSession.password;
      setUser(userForSession);
    } else {
      alert('Invalid email or password!');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <DebugPanel /> {/* Add DebugPanel here */}
        <header className="App-header">
          <h1>Simple MERN Testing App</h1>
          {user && (
            <button onClick={handleLogout} className="logout-btn">
              Logout ({user.name})
            </button>
          )}
        </header>

        <div className="container">
          {!user ? (
            isLogin ? (
              <Login 
                onLogin={handleLogin} 
                validateEmail={validateEmail}
                switchToRegister={switchToRegister}
              />
            ) : (
              <Register 
                onRegister={handleRegister} 
                validateEmail={validateEmail}
                switchToLogin={switchToLogin}
              />
            )
          ) : (
            <div>
              <h2>Welcome back, {user.name}!</h2>
              <div className="users-section">
                <h3>Users List</h3>
                {users.map(user => (
                  <User key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
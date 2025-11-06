import React from 'react';

const User = ({ user }) => {
  return (
    <div className="user-card" data-testid="user-card">
      <h3 data-testid="user-name">{user.name}</h3>
      <p data-testid="user-email">{user.email}</p>
    </div>
  );
};

export default User;
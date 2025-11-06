import React from 'react';
import { render, screen } from '@testing-library/react';
import User from '../User';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

describe('User Component', () => {
  test('renders user information correctly', () => {
    render(<User user={mockUser} />);
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
  });

  test('has correct test IDs for testing', () => {
    render(<User user={mockUser} />);
    
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toBeInTheDocument();
    expect(screen.getByTestId('user-email')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

const mockOnLogin = jest.fn();
const mockValidateEmail = jest.fn().mockReturnValue(true);

describe('Login Component', () => {
  beforeEach(() => {
    mockOnLogin.mockClear();
    mockValidateEmail.mockClear();
  });

  test('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} validateEmail={mockValidateEmail} />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  test('validates form inputs', () => {
    render(<Login onLogin={mockOnLogin} validateEmail={mockValidateEmail} />);
    
    fireEvent.click(screen.getByTestId('login-btn'));

    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
    expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
  });

  test('calls onLogin with valid data', () => {
    mockValidateEmail.mockReturnValue(true);
    render(<Login onLogin={mockOnLogin} validateEmail={mockValidateEmail} />);
    
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByTestId('login-btn'));

    expect(mockOnLogin).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });
});
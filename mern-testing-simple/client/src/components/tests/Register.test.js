import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../Register';

const mockOnRegister = jest.fn();
const mockValidateEmail = jest.fn().mockReturnValue(true);
const mockSwitchToLogin = jest.fn();

describe('Register Component', () => {
  beforeEach(() => {
    mockOnRegister.mockClear();
    mockValidateEmail.mockClear();
    mockSwitchToLogin.mockClear();
  });

  test('renders register form correctly', () => {
    render(
      <Register 
        onRegister={mockOnRegister} 
        validateEmail={mockValidateEmail}
        switchToLogin={mockSwitchToLogin}
      />
    );
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-btn')).toBeInTheDocument();
  });

  test('calls onRegister with valid data', () => {
    mockValidateEmail.mockReturnValue(true);
    render(
      <Register 
        onRegister={mockOnRegister} 
        validateEmail={mockValidateEmail}
        switchToLogin={mockSwitchToLogin}
      />
    );
    
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByTestId('register-btn'));

    expect(mockOnRegister).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });
});
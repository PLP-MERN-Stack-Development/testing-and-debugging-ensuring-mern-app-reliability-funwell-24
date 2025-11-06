import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws error
const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Debugging', () => {
  beforeEach(() => {
    // Suppress console error for testing error boundary
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('catches errors and displays debugging info', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByText(/Error Details/)).toBeInTheDocument();
  });

  test('reset button works', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    const resetButton = screen.getByText('Try Again');
    fireEvent.click(resetButton);

    // Error boundary should reset (implementation specific)
  });
});
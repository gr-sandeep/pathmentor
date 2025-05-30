import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/components/Login';

describe('Login Component', () => {
  it('renders input fields and login button', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('disables login button for empty input', () => {
    render(<Login />);
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeDisabled();
  });

  it('enables login button for valid input', () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/username or email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).not.toBeDisabled();
  });

  it('shows error for invalid input', () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/username or email/i), { target: { value: '   ' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '' } });
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeDisabled();
  });
}); 
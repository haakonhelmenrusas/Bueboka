import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AuthForm from '../AuthForm';

const baseProps = {
  email: '',
  password: '',
  isLoading: false,
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
};

describe('AuthForm', () => {
  it('renders exactly two input fields (email and password)', () => {
    render(<AuthForm {...baseProps} />);
    expect(screen.getAllByTestId('input')).toHaveLength(2);
  });

  it('does not render a name field', () => {
    render(<AuthForm {...baseProps} />);
    expect(screen.queryByText('Navn')).toBeNull();
  });

  it('calls onEmailChange when the email input changes', () => {
    const onEmailChange = jest.fn();
    render(<AuthForm {...baseProps} onEmailChange={onEmailChange} />);
    const [emailInput] = screen.getAllByTestId('input');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(onEmailChange).toHaveBeenCalledWith('test@example.com');
  });

  it('calls onPasswordChange when the password input changes', () => {
    const onPasswordChange = jest.fn();
    render(<AuthForm {...baseProps} onPasswordChange={onPasswordChange} />);
    const [, passwordInput] = screen.getAllByTestId('input');
    fireEvent.changeText(passwordInput, 'secret123');
    expect(onPasswordChange).toHaveBeenCalledWith('secret123');
  });

  it('disables both inputs when isLoading is true', () => {
    render(<AuthForm {...baseProps} isLoading={true} />);
    const inputs = screen.getAllByTestId('input');
    inputs.forEach((input) => expect(input.props.editable).toBe(false));
  });

  it('keeps inputs enabled when isLoading is false', () => {
    render(<AuthForm {...baseProps} isLoading={false} />);
    const inputs = screen.getAllByTestId('input');
    inputs.forEach((input) => expect(input.props.editable).toBe(true));
  });
});

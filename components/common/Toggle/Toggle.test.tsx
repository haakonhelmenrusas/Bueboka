import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Toggle from './Toggle';

describe('Toggle', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders label when provided', () => {
    const { getByText } = render(<Toggle value={false} onToggle={jest.fn()} label="Dark mode" />);
    expect(getByText('Dark mode')).toBeTruthy();
  });

  it('does not render label when not provided', () => {
    const { queryByText } = render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(queryByText('Dark mode')).toBeNull();
  });

  it('calls onToggle with true when currently off', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(<Toggle value={false} onToggle={onToggle} />);
    fireEvent.press(getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false when currently on', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(<Toggle value={true} onToggle={onToggle} />);
    fireEvent.press(getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('has correct accessibility state when off', () => {
    const { getByRole } = render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(getByRole('switch').props.accessibilityState.checked).toBe(false);
  });

  it('has correct accessibility state when on', () => {
    const { getByRole } = render(<Toggle value={true} onToggle={jest.fn()} />);
    expect(getByRole('switch').props.accessibilityState.checked).toBe(true);
  });

  it('uses label as accessibility label', () => {
    const { getByLabelText } = render(<Toggle value={false} onToggle={jest.fn()} label="Notifications" />);
    expect(getByLabelText('Notifications')).toBeTruthy();
  });

  it('uses fallback accessibility label when no label provided', () => {
    const { getByLabelText } = render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(getByLabelText('Toggle')).toBeTruthy();
  });
});

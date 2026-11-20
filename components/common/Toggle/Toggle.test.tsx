import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Toggle from './Toggle';

describe('Toggle', () => {
  it('renders without crashing', async () => {
    const { toJSON } = await render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders label when provided', async () => {
    const { getByText } = await render(<Toggle value={false} onToggle={jest.fn()} label="Dark mode" />);
    expect(getByText('Dark mode')).toBeTruthy();
  });

  it('does not render label when not provided', async () => {
    const { queryByText } = await render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(queryByText('Dark mode')).toBeNull();
  });

  it('calls onToggle with true when currently off', async () => {
    const onToggle = jest.fn();
    const { getByRole } = await render(<Toggle value={false} onToggle={onToggle} />);
    await fireEvent.press(getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false when currently on', async () => {
    const onToggle = jest.fn();
    const { getByRole } = await render(<Toggle value={true} onToggle={onToggle} />);
    await fireEvent.press(getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('has correct accessibility state when off', async () => {
    const { getByRole } = await render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(getByRole('switch').props.accessibilityState.checked).toBe(false);
  });

  it('has correct accessibility state when on', async () => {
    const { getByRole } = await render(<Toggle value={true} onToggle={jest.fn()} />);
    expect(getByRole('switch').props.accessibilityState.checked).toBe(true);
  });

  it('uses label as accessibility label', async () => {
    const { getByLabelText } = await render(<Toggle value={false} onToggle={jest.fn()} label="Notifications" />);
    expect(getByLabelText('Notifications')).toBeTruthy();
  });

  it('uses fallback accessibility label when no label provided', async () => {
    const { getByLabelText } = await render(<Toggle value={false} onToggle={jest.fn()} />);
    expect(getByLabelText('Toggle')).toBeTruthy();
  });
});

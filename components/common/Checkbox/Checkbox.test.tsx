import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', async () => {
    const { getByRole } = await render(<Checkbox value={false} onChange={jest.fn()} />);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(false);
  });

  it('renders checked when value is true', async () => {
    const { getByRole } = await render(<Checkbox value={true} onChange={jest.fn()} />);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('renders label text', async () => {
    const { getByText } = await render(<Checkbox value={false} onChange={jest.fn()} label="Accept terms" />);
    expect(getByText('Accept terms')).toBeTruthy();
  });

  it('centers the checkbox vertically with the label', async () => {
    const { getByRole } = await render(
      <Checkbox value={false} onChange={jest.fn()} label="En lengre tekst som wrapper til flere linjer" />,
    );
    const flat = StyleSheet.flatten(getByRole('checkbox').props.style);
    expect(flat.alignItems).toBe('center');
  });

  it('calls onChange with toggled value on press', async () => {
    const onChange = jest.fn();
    const { getByRole } = await render(<Checkbox value={false} onChange={onChange} />);
    await fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when currently checked', async () => {
    const onChange = jest.fn();
    const { getByRole } = await render(<Checkbox value={true} onChange={onChange} />);
    await fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = jest.fn();
    const { getByRole } = await render(<Checkbox value={false} onChange={onChange} disabled />);
    await fireEvent.press(getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses label as accessibility label', async () => {
    const { getByLabelText } = await render(<Checkbox value={false} onChange={jest.fn()} label="My checkbox" />);
    expect(getByLabelText('My checkbox')).toBeTruthy();
  });

  it('uses fallback accessibility label when no label provided', async () => {
    const { getByLabelText } = await render(<Checkbox value={false} onChange={jest.fn()} />);
    expect(getByLabelText('Checkbox')).toBeTruthy();
  });
});

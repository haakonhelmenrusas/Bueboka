import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const { getByRole } = render(<Checkbox value={false} onChange={jest.fn()} />);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(false);
  });

  it('renders checked when value is true', () => {
    const { getByRole } = render(<Checkbox value={true} onChange={jest.fn()} />);
    expect(getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('renders label text', () => {
    const { getByText } = render(<Checkbox value={false} onChange={jest.fn()} label="Accept terms" />);
    expect(getByText('Accept terms')).toBeTruthy();
  });

  it('calls onChange with toggled value on press', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Checkbox value={false} onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when currently checked', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Checkbox value={true} onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Checkbox value={false} onChange={onChange} disabled />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses label as accessibility label', () => {
    const { getByLabelText } = render(<Checkbox value={false} onChange={jest.fn()} label="My checkbox" />);
    expect(getByLabelText('My checkbox')).toBeTruthy();
  });

  it('uses fallback accessibility label when no label provided', () => {
    const { getByLabelText } = render(<Checkbox value={false} onChange={jest.fn()} />);
    expect(getByLabelText('Checkbox')).toBeTruthy();
  });
});

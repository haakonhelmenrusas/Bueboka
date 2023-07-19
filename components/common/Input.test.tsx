import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Input from './Input';

describe('Input', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<Input label="Test" />);
    expect(getByTestId('input')).toBeTruthy();
  });

  test('should render with placeholder text', () => {
    const { getByPlaceholderText } = render(<Input label="Test" placeholderText="My text" />);
    expect(getByPlaceholderText('My text')).toBeTruthy();
  });

  it('should call onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(<Input label="Test" onChangeText={onChangeText} />);
    fireEvent.changeText(getByTestId('input'), 90);
    expect(onChangeText).toHaveBeenCalledWith(90);
  });
});

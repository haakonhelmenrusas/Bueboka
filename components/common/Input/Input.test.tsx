import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Input from './Input';

describe('Input', () => {
  it('should render correctly', async () => {
    const { getByTestId } = await render(<Input label="Test" />);
    expect(getByTestId('input')).toBeTruthy();
  });

  test('should render with placeholder text', async () => {
    const { getByPlaceholderText } = await render(<Input label="Test" placeholder="My text" />);
    expect(getByPlaceholderText('My text')).toBeTruthy();
  });

  it('should call onChangeText', async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(<Input label="Test" onChangeText={onChangeText} />);
    await fireEvent.changeText(getByTestId('input'), '90');
    expect(onChangeText).toHaveBeenCalledWith('90');
  });
});

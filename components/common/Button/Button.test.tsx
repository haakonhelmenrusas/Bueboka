import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Button from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button label="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('should call onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should be disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Test" onPress={onPress} disabled />);
    fireEvent.press(getByText('Test'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should be loading', () => {
    const { getByTestId } = render(<Button label="Test" loading />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  test('renders a button with the correct text color when type is outline', () => {
    const { getByText } = render(<Button label="Click me!" type="outline" />);
    expect(getByText('Click me!').props.style[1].color).toBe('#053546');
  });
});

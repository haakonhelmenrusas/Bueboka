import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Checkbox from './Checkbox';

jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

describe('Checkbox', () => {
  it('renders correctly with label and unchecked state', () => {
    const { getByText, getByTestId } = render(<Checkbox label="Test Label" checked={false} onPress={() => {}} />);
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByTestId('Feather__square')).toBeTruthy();
  });

  it('renders correctly with label and checked state', () => {
    const { getByText, getByTestId } = render(<Checkbox label="Test Label" checked={true} onPress={() => {}} />);
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByTestId('Feather__check-square')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<Checkbox label="Test Label" checked={false} onPress={onPressMock} />);
    fireEvent.press(getByTestId('TouchableOpacity'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with long label', () => {
    const longLabel = 'This is a very long label to test the rendering of the Checkbox component';
    const { getByText } = render(<Checkbox label={longLabel} checked={false} onPress={() => {}} />);
    expect(getByText(longLabel)).toBeTruthy();
  });

  it('renders correctly with empty label', () => {
    const { getByTestId } = render(<Checkbox label="" checked={false} onPress={() => {}} />);
    expect(getByTestId('Feather__square')).toBeTruthy();
  });
});

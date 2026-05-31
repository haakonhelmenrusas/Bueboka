import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ModalHeader from './ModalHeader';

jest.mock('@/components/sightMarks/calculateMarksModal/CalculateMarksModalStyles', () => ({
  styles: {
    header: {},
    title: {},
  },
}));

describe('ModalHeader', () => {
  it('renders title text', () => {
    const { getByText } = render(<ModalHeader title="My Modal" onPress={jest.fn()} />);
    expect(getByText('My Modal')).toBeTruthy();
  });

  it('calls onPress when close button is pressed', () => {
    const onPress = jest.fn();
    const tree = render(<ModalHeader title="Title" onPress={onPress} />);
    const touchable = tree.root.findByProps({ accessible: true });
    fireEvent.press(touchable);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with undefined title', () => {
    const { toJSON } = render(<ModalHeader onPress={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });
});

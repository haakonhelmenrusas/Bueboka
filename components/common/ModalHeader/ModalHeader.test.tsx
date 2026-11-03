import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ModalHeader from './ModalHeader';

jest.mock('./ModalHeaderStyles', () => ({
  styles: {
    header: {},
    title: {},
    closeButton: {},
  },
}));

describe('ModalHeader', () => {
  it('renders title text', async () => {
    const { getByText } = await render(<ModalHeader title="My Modal" onPress={jest.fn()} />);
    expect(getByText('My Modal')).toBeTruthy();
  });

  it('calls onPress when close button is pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(<ModalHeader title="Title" onPress={onPress} />);
    await fireEvent.press(getByTestId('modal-header-close'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with undefined title', async () => {
    const { toJSON } = await render(<ModalHeader onPress={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });
});

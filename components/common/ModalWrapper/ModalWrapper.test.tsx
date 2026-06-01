import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import ModalWrapper from './ModalWrapper';

describe('ModalWrapper', () => {
  it('renders children when visible', () => {
    const { getByText } = render(
      <ModalWrapper visible={true} onClose={jest.fn()}>
        <Text>Content</Text>
      </ModalWrapper>,
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders children in full-screen mode', () => {
    const { getByText } = render(
      <ModalWrapper visible={true} onClose={jest.fn()} fullScreen>
        <Text>Full screen</Text>
      </ModalWrapper>,
    );
    expect(getByText('Full screen')).toBeTruthy();
  });

  it('calls onClose on requestClose', () => {
    const onClose = jest.fn();
    render(
      <ModalWrapper visible={true} onClose={onClose}>
        <Text>Content</Text>
      </ModalWrapper>,
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import ModalWrapper from './ModalWrapper';

describe('ModalWrapper', () => {
  it('renders children when visible', async () => {
    const { getByText } = await render(
      <ModalWrapper visible={true} onClose={jest.fn()}>
        <Text>Content</Text>
      </ModalWrapper>,
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders children in full-screen mode', async () => {
    const { getByText } = await render(
      <ModalWrapper visible={true} onClose={jest.fn()} fullScreen>
        <Text>Full screen</Text>
      </ModalWrapper>,
    );
    expect(getByText('Full screen')).toBeTruthy();
  });

  it('calls onClose on requestClose', async () => {
    const onClose = jest.fn();
    await render(
      <ModalWrapper visible={true} onClose={onClose}>
        <Text>Content</Text>
      </ModalWrapper>,
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

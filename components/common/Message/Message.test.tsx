import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Message from './Message';

describe('Message', () => {
  it('renders title and description', async () => {
    const { getByText } = await render(<Message title="Error" description="Something went wrong" />);
    expect(getByText('Error')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('renders button when onPress and buttonLabel are provided', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Message title="Info" description="Details here" onPress={onPress} buttonLabel="Retry" />);
    expect(getByText('Retry')).toBeTruthy();
  });

  it('calls onPress when button is pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Message title="Info" description="Details" onPress={onPress} buttonLabel="OK" />);
    await fireEvent.press(getByText('OK'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render button when onPress is missing', async () => {
    const { queryByText } = await render(<Message title="Info" description="Details" buttonLabel="OK" />);
    expect(queryByText('OK')).toBeNull();
  });

  it('does not render button when buttonLabel is missing', async () => {
    const { queryByText } = await render(<Message title="Info" description="Details" onPress={jest.fn()} />);
    expect(queryByText('Retry')).toBeNull();
  });
});

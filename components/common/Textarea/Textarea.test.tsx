import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Textarea from './Textarea';

describe('Textarea', () => {
  it('renders with label', async () => {
    const { getByText } = await render(<Textarea label="Notes" />);
    expect(getByText('Notes')).toBeTruthy();
  });

  it('renders textarea input', async () => {
    const { getByTestId } = await render(<Textarea label="Notes" />);
    expect(getByTestId('textarea')).toBeTruthy();
  });

  it('calls onChangeText when text changes', async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(<Textarea label="Notes" onChangeText={onChangeText} />);
    await fireEvent.changeText(getByTestId('textarea'), 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('renders placeholder text', async () => {
    const { getByPlaceholderText } = await render(<Textarea label="Notes" placeholderText="Enter notes..." />);
    expect(getByPlaceholderText('Enter notes...')).toBeTruthy();
  });

  it('renders with native placeholder prop', async () => {
    const { getByPlaceholderText } = await render(<Textarea label="Notes" placeholder="Type here" />);
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('placeholderText takes precedence over placeholder', async () => {
    const { getByPlaceholderText, queryByPlaceholderText } = await render(
      <Textarea label="Notes" placeholderText="Legacy" placeholder="Native" />,
    );
    expect(getByPlaceholderText('Legacy')).toBeTruthy();
    expect(queryByPlaceholderText('Native')).toBeNull();
  });

  it('displays error message when error is true', async () => {
    const { getByText } = await render(<Textarea label="Notes" error errorMessage="Required field" />);
    expect(getByText('Required field')).toBeTruthy();
  });

  it('does not display error message when error is false', async () => {
    const { queryByText } = await render(<Textarea label="Notes" error={false} errorMessage="Required field" />);
    expect(queryByText('Required field')).toBeNull();
  });

  it('shows optional hint when optional is true', async () => {
    const { getByText } = await render(<Textarea label="Notes" optional />);
    expect(getByText(/valgfritt/i)).toBeTruthy();
  });

  it('renders help text', async () => {
    const { getByText } = await render(<Textarea label="Notes" helpText="Some help" />);
    expect(getByText('Some help')).toBeTruthy();
  });

  it('renders info text', async () => {
    const { getByText } = await render(<Textarea label="Notes" info="Extra info" />);
    expect(getByText('Extra info')).toBeTruthy();
  });
});

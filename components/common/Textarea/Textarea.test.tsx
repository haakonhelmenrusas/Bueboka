import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Textarea from './Textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    const { getByText } = render(<Textarea label="Notes" />);
    expect(getByText('Notes')).toBeTruthy();
  });

  it('renders textarea input', () => {
    const { getByTestId } = render(<Textarea label="Notes" />);
    expect(getByTestId('textarea')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(<Textarea label="Notes" onChangeText={onChangeText} />);
    fireEvent.changeText(getByTestId('textarea'), 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(<Textarea label="Notes" placeholderText="Enter notes..." />);
    expect(getByPlaceholderText('Enter notes...')).toBeTruthy();
  });

  it('renders with native placeholder prop', () => {
    const { getByPlaceholderText } = render(<Textarea label="Notes" placeholder="Type here" />);
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('placeholderText takes precedence over placeholder', () => {
    const { getByPlaceholderText, queryByPlaceholderText } = render(
      <Textarea label="Notes" placeholderText="Legacy" placeholder="Native" />,
    );
    expect(getByPlaceholderText('Legacy')).toBeTruthy();
    expect(queryByPlaceholderText('Native')).toBeNull();
  });

  it('displays error message when error is true', () => {
    const { getByText } = render(<Textarea label="Notes" error errorMessage="Required field" />);
    expect(getByText('Required field')).toBeTruthy();
  });

  it('does not display error message when error is false', () => {
    const { queryByText } = render(<Textarea label="Notes" error={false} errorMessage="Required field" />);
    expect(queryByText('Required field')).toBeNull();
  });

  it('shows optional hint when optional is true', () => {
    const { getByText } = render(<Textarea label="Notes" optional />);
    expect(getByText(/valgfritt/i)).toBeTruthy();
  });

  it('renders help text', () => {
    const { getByText } = render(<Textarea label="Notes" helpText="Some help" />);
    expect(getByText('Some help')).toBeTruthy();
  });

  it('renders info text', () => {
    const { getByText } = render(<Textarea label="Notes" info="Extra info" />);
    expect(getByText('Extra info')).toBeTruthy();
  });
});

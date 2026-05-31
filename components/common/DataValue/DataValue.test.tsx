import { render } from '@testing-library/react-native';
import React from 'react';

import DataValue from './DataValue';

describe('DataValue', () => {
  it('renders string value', () => {
    const { getByText } = render(<DataValue value="hello" />);
    expect(getByText('hello')).toBeTruthy();
  });

  it('renders number value', () => {
    const { getByText } = render(<DataValue value={42} />);
    expect(getByText('42')).toBeTruthy();
  });

  it('renders number value with suffix', () => {
    const { getByText } = render(<DataValue value={100} suffix=" kg" />);
    expect(getByText('100 kg')).toBeTruthy();
  });

  it('renders string value with suffix', () => {
    const { getByText } = render(<DataValue value="test" suffix="!" />);
    expect(getByText('test!')).toBeTruthy();
  });

  it('capitalizes first letter when capitalize is true', () => {
    const { getByText } = render(<DataValue value="hello" capitalize />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('shows "Ingen data" pill for null', () => {
    const { getByText } = render(<DataValue value={null} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for undefined', () => {
    const { getByText } = render(<DataValue value={undefined} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for empty string', () => {
    const { getByText } = render(<DataValue value="" />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for whitespace-only string', () => {
    const { getByText } = render(<DataValue value="   " />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for NaN', () => {
    const { getByText } = render(<DataValue value={NaN} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('renders zero as a valid value', () => {
    const { getByText } = render(<DataValue value={0} />);
    expect(getByText('0')).toBeTruthy();
  });

  it('handles capitalize on empty string gracefully', () => {
    const { getByText } = render(<DataValue value="" capitalize />);
    expect(getByText('Ingen data')).toBeTruthy();
  });
});

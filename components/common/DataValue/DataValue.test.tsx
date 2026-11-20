import { render } from '@testing-library/react-native';
import React from 'react';

import DataValue from './DataValue';

describe('DataValue', () => {
  it('renders string value', async () => {
    const { getByText } = await render(<DataValue value="hello" />);
    expect(getByText('hello')).toBeTruthy();
  });

  it('renders number value', async () => {
    const { getByText } = await render(<DataValue value={42} />);
    expect(getByText('42')).toBeTruthy();
  });

  it('renders number value with suffix', async () => {
    const { getByText } = await render(<DataValue value={100} suffix=" kg" />);
    expect(getByText('100 kg')).toBeTruthy();
  });

  it('renders string value with suffix', async () => {
    const { getByText } = await render(<DataValue value="test" suffix="!" />);
    expect(getByText('test!')).toBeTruthy();
  });

  it('capitalizes first letter when capitalize is true', async () => {
    const { getByText } = await render(<DataValue value="hello" capitalize />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('shows "Ingen data" pill for null', async () => {
    const { getByText } = await render(<DataValue value={null} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for undefined', async () => {
    const { getByText } = await render(<DataValue value={undefined} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for empty string', async () => {
    const { getByText } = await render(<DataValue value="" />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for whitespace-only string', async () => {
    const { getByText } = await render(<DataValue value="   " />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('shows "Ingen data" pill for NaN', async () => {
    const { getByText } = await render(<DataValue value={NaN} />);
    expect(getByText('Ingen data')).toBeTruthy();
  });

  it('renders zero as a valid value', async () => {
    const { getByText } = await render(<DataValue value={0} />);
    expect(getByText('0')).toBeTruthy();
  });

  it('handles capitalize on empty string gracefully', async () => {
    const { getByText } = await render(<DataValue value="" capitalize />);
    expect(getByText('Ingen data')).toBeTruthy();
  });
});

import { render } from '@testing-library/react-native';
import React from 'react';

import { GoogleLogo } from './GoogleLogo';

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('react-native-svg', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => mockReact.createElement(View, { ...props, testID: 'svg' }),
    Path: (props: any) => mockReact.createElement(View, { ...props, testID: 'path' }),
    G: (props: any) => mockReact.createElement(View, { ...props, testID: 'g' }),
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

describe('GoogleLogo', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<GoogleLogo />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { toJSON } = render(<GoogleLogo size={32} />);
    expect(toJSON()).toBeTruthy();
  });

  it('defaults to size 20', () => {
    const { getByTestId } = render(<GoogleLogo />);
    const svg = getByTestId('svg');
    expect(svg.props.width).toBe(20);
    expect(svg.props.height).toBe(20);
  });
});

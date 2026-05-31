import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { ...props, testID: 'svg' }),
    Svg: (props: any) => React.createElement(View, { ...props, testID: 'svg' }),
    Path: (props: any) => React.createElement(View, { ...props, testID: 'path' }),
    G: (props: any) => React.createElement(View, { ...props, testID: 'g' }),
  };
});

import { GoogleLogo } from './GoogleLogo';

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

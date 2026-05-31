import { render } from '@testing-library/react-native';
import React from 'react';

import Notch from './Notch';

describe('Notch', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Notch />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders two nested views', () => {
    const tree = render(<Notch />).toJSON() as any;
    expect(tree.type).toBe('View');
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].type).toBe('View');
  });
});

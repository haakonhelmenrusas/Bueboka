import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    const { getByText } = render(<Badge>Hello</Badge>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders with icon', () => {
    const icon = <Text testID="star-icon">★</Text>;
    const { getByText, UNSAFE_getByProps } = render(<Badge icon={icon}>Star</Badge>);
    expect(UNSAFE_getByProps({ 'aria-hidden': true })).toBeTruthy();
    expect(getByText('Star')).toBeTruthy();
  });

  it('does not render icon container when no icon provided', () => {
    const tree = render(<Badge>No icon</Badge>).toJSON() as any;
    expect(tree.children).toHaveLength(1);
  });

  it('applies uppercase style when uppercase prop is true', () => {
    const { getByText } = render(<Badge uppercase>caps</Badge>);
    const text = getByText('caps');
    const flatStyle = Array.isArray(text.props.style) ? Object.assign({}, ...text.props.style.filter(Boolean)) : text.props.style;
    expect(flatStyle.textTransform).toBe('uppercase');
  });

  it('accepts different variants', () => {
    const variants = ['default', 'training', 'competition', 'primary', 'secondary', 'ghost'] as const;
    variants.forEach((variant) => {
      const { getByText } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('accepts different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const { getByText } = render(<Badge size={size}>{size}</Badge>);
      expect(getByText(size)).toBeTruthy();
    });
  });
});

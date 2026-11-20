import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', async () => {
    const { getByText } = await render(<Badge>Hello</Badge>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders with icon', async () => {
    const icon = <Text testID="star-icon">★</Text>;
    const { getByText } = await render(<Badge icon={icon}>Star</Badge>);
    expect(getByText('★', { includeHiddenElements: true })).toBeTruthy();
    expect(getByText('Star')).toBeTruthy();
  });

  it('does not render icon container when no icon provided', async () => {
    const tree = (await render(<Badge>No icon</Badge>)).toJSON() as any;
    expect(tree.children).toHaveLength(1);
  });

  it('applies uppercase style when uppercase prop is true', async () => {
    const { getByText } = await render(<Badge uppercase>caps</Badge>);
    const text = getByText('caps');
    const flatStyle = Array.isArray(text.props.style) ? Object.assign({}, ...text.props.style.filter(Boolean)) : text.props.style;
    expect(flatStyle.textTransform).toBe('uppercase');
  });

  it('accepts different variants', async () => {
    const variants = ['default', 'training', 'competition', 'primary', 'secondary', 'ghost'] as const;
    for (const variant of variants) {
      const { getByText } = await render(<Badge variant={variant}>{variant}</Badge>);
      expect(getByText(variant)).toBeTruthy();
    }
  });

  it('accepts different sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { getByText } = await render(<Badge size={size}>{size}</Badge>);
      expect(getByText(size)).toBeTruthy();
    }
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { ArrowIcon, BowIcon } from '../ArcheryIcons';

// NOTE: kept in a single test — RNTL v14 returns null from toJSON() on later
// renders once several tests in the same file have rendered.
describe('ArcheryIcons', () => {
  it('renders the lucide bow-arrow and tabler archery-arrow path data', async () => {
    const bow = await render(<BowIcon size={24} color="#000" />);
    const bowJson = JSON.stringify(bow.toJSON());
    // lucide bow-arrow: bow limbs + string + arrow shaft (ISC, lucide.dev/icons/bow-arrow)
    expect(bowJson).toContain('M18.575 11.082a13 13 0 0 1 1.048 9.027');
    expect(bowJson).toContain('M9.707 14.293 21 3');
    expect(bowJson.match(/RNSVGPath/g)).toHaveLength(5);

    const arrow = await render(<ArrowIcon size={24} color="#000" />);
    const arrowJson = JSON.stringify(arrow.toJSON());
    // tabler archery-arrow: head + shaft + fletching (MIT, tabler.io/icons/icon/archery-arrow)
    expect(arrowJson).toContain('M14 7v3h3l3 -3h-3v-3l-3 3');
    expect(arrowJson).toContain('M14 10l-9 9');
    expect(arrowJson.match(/RNSVGPath/g)).toHaveLength(3);
  });
});

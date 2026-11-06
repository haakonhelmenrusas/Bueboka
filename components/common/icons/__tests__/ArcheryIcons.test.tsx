import React from 'react';
import { render } from '@testing-library/react-native';
import { ArrowIcon, BowTypeIcon } from '../ArcheryIcons';
import { BowType } from '@/types';

const iconJson = async (element: React.ReactElement): Promise<string> => {
  const { toJSON } = await render(element);
  return JSON.stringify(toJSON());
};

// NOTE: kept in a single test — RNTL v14 returns null from toJSON() on later
// renders once several tests in the same file have rendered.
describe('ArcheryIcons', () => {
  it('renders a distinct bow shape per bow type, a recurve fallback, and a stroked arrow', async () => {
    const types = [
      BowType.RECURVE,
      BowType.COMPOUND,
      BowType.LONGBOW,
      BowType.BAREBOW,
      BowType.HORSEBOW,
      BowType.TRADITIONAL,
      BowType.OTHER,
    ];
    const shapes: string[] = [];
    for (const type of types) {
      shapes.push(await iconJson(<BowTypeIcon type={type} size={24} color="#000" />));
    }
    // every type renders something, and all shapes are unique
    shapes.forEach((s) => expect(s.length).toBeGreaterThan(2));
    expect(new Set(shapes).size).toBe(types.length);

    // unknown types fall back to the recurve shape
    const fallback = await iconJson(<BowTypeIcon type={'UNKNOWN' as BowType} size={24} color="#000" />);
    expect(fallback).toEqual(shapes[0]);

    // arrow icon: shaft + 2 fletching lines + 1 arrowhead path
    const arrowJson = await iconJson(<ArrowIcon size={24} color="#000" />);
    expect(arrowJson.match(/RNSVGLine/g)).toHaveLength(3);
    expect(arrowJson.match(/RNSVGPath/g)).toHaveLength(1);
  });
});

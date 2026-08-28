import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '@/styles/colors';
import { isFieldTarget, RING_UNIT_DIVISOR, targetRings } from './targetGeometry';

interface TargetFaceProps {
  size: number;
  targetType?: string;
}

/** Ring colours by score, 1 through 10. */
const STANDARD_COLOURS: Record<number, { fill: string; stroke: string }> = {
  1: { fill: '#FFFFFF', stroke: colors.text },
  2: { fill: '#FFFFFF', stroke: colors.text },
  3: { fill: '#1a1a1a', stroke: '#444' },
  4: { fill: '#1a1a1a', stroke: '#444' },
  5: { fill: '#3DA9D4', stroke: '#2a8ab8' },
  6: { fill: '#3DA9D4', stroke: '#2a8ab8' },
  7: { fill: '#E74C3C', stroke: '#c0392b' },
  8: { fill: '#E74C3C', stroke: '#c0392b' },
  9: { fill: '#F5C542', stroke: '#d4a830' },
  10: { fill: '#F5C542', stroke: '#d4a830' },
};

const FIELD_COLOURS: Record<number, { fill: string; stroke: string }> = {
  1: { fill: '#1a1a1a', stroke: '#444' },
  2: { fill: '#1a1a1a', stroke: '#444' },
  3: { fill: '#1a1a1a', stroke: '#444' },
  4: { fill: '#1a1a1a', stroke: '#444' },
  5: { fill: '#1a1a1a', stroke: '#444' },
  6: { fill: '#1a1a1a', stroke: '#444' },
  7: { fill: '#F5C542', stroke: '#d4a830' },
  8: { fill: '#F5C542', stroke: '#d4a830' },
  9: { fill: '#F5C542', stroke: '#d4a830' },
  10: { fill: '#F5C542', stroke: '#d4a830' },
};

export function TargetFace({ size, targetType }: TargetFaceProps) {
  const center = size / 2;
  const unit = size / RING_UNIT_DIVISOR;
  const palette = isFieldTarget(targetType) ? FIELD_COLOURS : STANDARD_COLOURS;

  // targetRings is innermost first; draw outermost first so inner rings paint on top.
  const rings = [...targetRings(size, targetType)].reverse();

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((ring) => {
        const { fill, stroke } = palette[ring.score];
        return <Circle key={ring.score} cx={center} cy={center} r={ring.radius} fill={fill} stroke={stroke} strokeWidth={0.5} />;
      })}
      <Circle cx={center} cy={center} r={unit * 0.5} fill="transparent" stroke={colors.text} strokeWidth={0.5} />
      <Line x1={center - unit * 0.35} y1={center} x2={center + unit * 0.35} y2={center} stroke={colors.text} strokeWidth={0.4} />
      <Line x1={center} y1={center - unit * 0.35} x2={center} y2={center + unit * 0.35} stroke={colors.text} strokeWidth={0.4} />
    </Svg>
  );
}

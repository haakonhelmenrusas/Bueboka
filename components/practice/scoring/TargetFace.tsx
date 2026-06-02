import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '@/styles/colors';

interface TargetFaceProps {
  size: number;
  targetType?: string;
}

const STANDARD_RINGS = [
  { fill: '#FFFFFF', stroke: colors.text },
  { fill: '#FFFFFF', stroke: colors.text },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#3DA9D4', stroke: '#2a8ab8' },
  { fill: '#3DA9D4', stroke: '#2a8ab8' },
  { fill: '#E74C3C', stroke: '#c0392b' },
  { fill: '#E74C3C', stroke: '#c0392b' },
  { fill: '#F5C542', stroke: '#d4a830' },
  { fill: '#F5C542', stroke: '#d4a830' },
];

const FIELD_RINGS = [
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#1a1a1a', stroke: '#444' },
  { fill: '#F5C542', stroke: '#d4a830' },
  { fill: '#F5C542', stroke: '#d4a830' },
  { fill: '#F5C542', stroke: '#d4a830' },
  { fill: '#F5C542', stroke: '#d4a830' },
];

function isFieldTarget(targetType?: string): boolean {
  return targetType?.startsWith('felt-') ?? false;
}

function isCentre6Target(targetType?: string): boolean {
  return targetType === '80cm-centre-6';
}

export function TargetFace({ size, targetType }: TargetFaceProps) {
  const center = size / 2;
  const unit = size / 22;

  const rings = isFieldTarget(targetType) ? FIELD_RINGS : STANDARD_RINGS;
  const startRing = isCentre6Target(targetType) ? 4 : 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.slice(startRing).map((ring, i) => {
        const ringIndex = startRing + i;
        const visibleCount = 11 - startRing;
        const radius = isCentre6Target(targetType) ? (unit * 11 * (visibleCount - i)) / visibleCount : unit * (11 - ringIndex);
        return <Circle key={ringIndex} cx={center} cy={center} r={radius} fill={ring.fill} stroke={ring.stroke} strokeWidth={0.5} />;
      })}
      <Circle cx={center} cy={center} r={unit * 0.5} fill="transparent" stroke={colors.text} strokeWidth={0.5} />
      <Line x1={center - unit * 0.35} y1={center} x2={center + unit * 0.35} y2={center} stroke={colors.text} strokeWidth={0.4} />
      <Line x1={center} y1={center - unit * 0.35} x2={center} y2={center + unit * 0.35} stroke={colors.text} strokeWidth={0.4} />
    </Svg>
  );
}

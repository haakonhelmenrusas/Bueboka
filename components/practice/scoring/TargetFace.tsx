import React from 'react';
import Svg, { Circle, G, Text } from 'react-native-svg';

interface TargetFaceProps {
  size: number;
}

/**
 * Standard 10-zone archery target face.
 * Rings:
 * 10, 9 - Gold
 * 8, 7  - Red
 * 6, 5  - Blue
 * 4, 3  - Black
 * 2, 1  - White
 */
export const TargetFace: React.FC<TargetFaceProps> = ({ size }) => {
  const center = size / 2;
  const unit = size / 22; // 10 rings + 1 extra area padding

  const rings = [
    { value: 1, color: '#FFFFFF', stroke: '#000000' },
    { value: 2, color: '#FFFFFF', stroke: '#000000' },
    { value: 3, color: '#111111', stroke: '#FFFFFF' },
    { value: 4, color: '#111111', stroke: '#FFFFFF' },
    { value: 5, color: '#33B5E5', stroke: '#000000' },
    { value: 6, color: '#33B5E5', stroke: '#000000' },
    { value: 7, color: '#FF4444', stroke: '#000000' },
    { value: 8, color: '#FF4444', stroke: '#000000' },
    { value: 9, color: '#FFBB33', stroke: '#000000' },
    { value: 10, color: '#FFBB33', stroke: '#000000' },
  ];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {rings.map((ring, index) => {
          const radius = unit * (11 - index);
          return (
            <Circle
              key={ring.value}
              cx={center}
              cy={center}
              r={radius}
              fill={ring.color}
              stroke={ring.stroke}
              strokeWidth={1}
            />
          );
        })}
        {/* Center X */}
        <Circle cx={center} cy={center} r={unit * 0.5} fill="transparent" stroke="#000000" strokeWidth={0.5} />
      </G>
    </Svg>
  );
};


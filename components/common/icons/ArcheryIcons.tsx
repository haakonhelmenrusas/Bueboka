import type { ReactNode } from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { colors } from '@/styles/colors';
import { BowType } from '@/types';

interface ArcheryIconProps {
  size?: number;
  color?: string;
}

const strokeProps = (color: string, strokeWidth = 1.2) =>
  ({
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }) as const;

export function BowIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M30.6956 0.0260342C31.3007 -0.128255 32.01 0.412759 32.01 1.03593C31.3187 3.5807 31.2286 6.63643 30.4872 9.12309C30.3048 9.73424 29.7257 10.1951 29.0885 9.87851C28.4073 9.53987 27.4034 8.03706 26.7141 7.54614H26.5157L11.2611 22.8088C10.8844 23.6263 12.6337 26.4897 11.6098 27.4575L7.24759 31.7976C4.56456 32.7614 4.96731 29.315 4.20989 27.758C3.22004 27.3813 2.02981 27.2691 1.05398 26.9124C-0.0661236 26.5017 -0.284533 25.3876 0.406763 24.4578C0.967815 23.7044 3.64684 21.0354 4.40626 20.4543C5.63457 19.5146 7.49205 20.6347 8.87264 20.805L9.16318 20.7148L24.4679 5.30193C24.0371 4.67074 22.3359 3.47049 22.0894 2.87538C21.7368 2.02178 22.404 1.62904 23.1093 1.4467C25.5319 0.819522 28.247 0.643191 30.6956 0.0260342Z"
        fill={color}
      />
      <Path
        d="M6.20759 9.40567L11.9083 15.1544L9.1451 17.8976L0.362631 9.19728C-0.693349 7.45601 0.695255 5.51437 2.70703 6.15357C2.9575 6.23372 3.2801 6.53829 3.53257 6.48619C8.54397 3.186 15.5431 3.19001 20.5104 6.55432L17.647 9.38964C14.0303 7.55419 9.81035 7.53616 6.20759 9.40767V9.40567Z"
        fill={color}
      />
      <Path
        d="M25.4637 11.5056C25.7142 11.5056 26.8704 14.1445 27.0166 14.5533C28.4253 18.4846 28.3031 22.7286 26.5999 26.5438C26.4235 26.9405 25.5579 28.3652 25.5279 28.5836C25.4958 28.816 25.7783 29.0625 25.8625 29.3089C26.5458 31.2866 24.3296 32.7774 22.7106 31.5612L14.1165 22.8709L16.8596 20.1077L22.6144 25.6601C24.4999 22.1154 24.4378 17.9136 22.6404 14.3529L25.4637 11.5056Z"
        fill={color}
      />
    </Svg>
  );
}

export function ArrowIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  const s = strokeProps(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* shaft */}
      <Line x1={5} y1={19} x2={19.5} y2={4.5} {...s} />
      {/* tip: corner arrowhead */}
      <Polyline points="13.8,4.5 19.5,4.5 19.5,10.2" {...s} />
      {/* feathers: two swept strokes behind the tail, not a second arrowhead */}
      <Line x1={7.4} y1={16.6} x2={4.9} y2={14.1} {...s} />
      <Line x1={9.4} y1={14.6} x2={6.9} y2={12.1} {...s} />
    </Svg>
  );
}

/** Horizontal arrow shot from the bow — shared by all bow-type icons */
function ShotArrow({ color }: { color: string }) {
  const s = strokeProps(color);
  return (
    <>
      {/* shaft */}
      <Line x1={4} y1={12} x2={20} y2={12} {...s} />
      {/* tip */}
      <Polyline points="15.8,8.8 20,12 15.8,15.2" {...s} />
      {/* feathers swept back from the tail */}
      <Line x1={6.2} y1={12} x2={3.8} y2={9.6} {...s} />
      <Line x1={8.2} y1={12} x2={5.8} y2={9.6} {...s} />
    </>
  );
}

/**
 * Bow icon per bow type — each limb geometry is distinct: recurved tips for
 * RECURVE, cam wheels for COMPOUND, tall straight limbs for LONGBOW, short
 * straight limbs for BAREBOW, short deep curve for HORSEBOW, medium curve for
 * TRADITIONAL and a flat straight bow for OTHER.
 */
export function BowTypeIcon({ type, size = 20, color = colors.white }: ArcheryIconProps & { type: BowType }) {
  const s = strokeProps(color);
  let limbs: ReactNode;
  let string: ReactNode;
  let extra: ReactNode = null;

  switch (type) {
    case BowType.COMPOUND:
      limbs = <Path d="M6 3 C 13 5 17 8.5 17 12 C 17 15.5 13 19 6 21" {...s} />;
      string = <Line x1={6} y1={3} x2={6} y2={21} {...s} />;
      extra = (
        <>
          {/* cam wheels at the limb tips */}
          <Circle cx={6} cy={3} r={1.6} {...s} />
          <Circle cx={6} cy={21} r={1.6} {...s} />
          {/* cables running from the cams down the limbs */}
          <Line x1={7.4} y1={4.2} x2={13.5} y2={19.5} {...s} />
          {/* riser/grip */}
          <Line x1={16.2} y1={10.6} x2={17.8} y2={13.4} {...s} />
        </>
      );
      break;
    case BowType.LONGBOW:
      limbs = <Path d="M7 2 C 9.5 8 9.5 16 7 22" {...s} />;
      string = <Line x1={7} y1={2} x2={7} y2={22} {...s} />;
      extra = (
        <>
          {/* grip wrap */}
          <Line x1={7} y1={10.6} x2={8.8} y2={10.6} {...s} />
          <Line x1={7} y1={13.4} x2={8.8} y2={13.4} {...s} />
        </>
      );
      break;
    case BowType.BAREBOW:
      limbs = <Path d="M7 5 C 9 10 9 14 7 19" {...s} />;
      string = <Line x1={7} y1={5} x2={7} y2={19} {...s} />;
      extra = <Line x1={7} y1={11.2} x2={8.6} y2={11.2} {...s} />;
      break;
    case BowType.HORSEBOW:
      limbs = <Path d="M6 6 C 16 7 19 10 18.5 12 C 19 14 16 17 6 18" {...s} />;
      string = <Line x1={6} y1={6} x2={6} y2={18} {...s} />;
      extra = (
        <>
          {/* recurved tips */}
          <Path d="M6 6 C 4.5 6 4 7 4.5 8" {...s} />
          <Path d="M6 18 C 4.5 18 4 17 4.5 16" {...s} />
          {/* grip */}
          <Line x1={18} y1={10.8} x2={18.9} y2={13.2} {...s} />
        </>
      );
      break;
    case BowType.TRADITIONAL:
      limbs = <Path d="M7 2 C 11 7 11 17 7 22" {...s} />;
      string = <Line x1={7} y1={2} x2={7} y2={22} {...s} />;
      extra = <Line x1={7} y1={11.2} x2={8.6} y2={11.2} {...s} />;
      break;
    case BowType.OTHER:
      limbs = <Line x1={8} y1={3} x2={8} y2={21} {...s} />;
      string = <Line x1={6} y1={3} x2={6} y2={21} {...s} />;
      break;
    case BowType.RECURVE:
    default:
      limbs = <Path d="M6 2 C 14 4 18 8 18 12 C 18 16 14 20 6 22" {...s} />;
      string = <Line x1={6} y1={2} x2={6} y2={22} {...s} />;
      extra = (
        <>
          {/* recurved tips */}
          <Path d="M6 2 C 4 2.5 3.5 4 4.5 5.5" {...s} />
          <Path d="M6 22 C 4 21.5 3.5 20 4.5 18.5" {...s} />
          {/* riser/grip */}
          <Line x1={16.6} y1={10.8} x2={18.2} y2={13.2} {...s} />
        </>
      );
      break;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {limbs}
      {string}
      {extra}
      <ShotArrow color={color} />
    </Svg>
  );
}

/**
 * Two crossed swords — same icon (lucide "swords") as the website's
 * utfordringer quick action.
 */
export function SwordsIcon({ size = 20, color = colors.white }: ArcheryIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <Line x1={13} y1={19} x2={19} y2={13} />
      <Line x1={16} y1={16} x2={20} y2={20} />
      <Line x1={19} y1={21} x2={21} y2={19} />
      <Polyline points="14.5 6.5 18 3 21 3 21 6 17.5 10" />
      <Line x1={5} y1={14} x2={9} y2={18} />
      <Line x1={7} y1={17} x2={4} y2={20} />
      <Line x1={3} y1={19} x2={5} y2={21} />
    </Svg>
  );
}

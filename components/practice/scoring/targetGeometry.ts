/**
 * Geometry shared by the target face and the scoring logic.
 *
 * The face is laid out on a unit of `size / 22`, so the outermost scoring ring
 * has radius `11 * unit` and exactly fills the view. Both `TargetFace` (which
 * draws the rings) and `scoreAt` (which scores a hit) read their radii from
 * `targetRings`, so the drawing and the score can never drift apart.
 *
 * Every function here is worklet-safe: it is pure, takes only numbers and
 * plain objects, and may be called from the UI thread during a gesture.
 */

export const RING_UNIT_DIVISOR = 22;

/** Number of scoring rings on a full face, and on the reduced 80cm centre-6 face. */
const FULL_RING_COUNT = 10;
const CENTRE_6_RING_COUNT = 6;

/** Highest score on any face. */
const MAX_SCORE = 10;

export interface Ring {
  /** Score awarded to a hit inside this radius but outside the previous one. */
  score: number;
  /** Outer radius of the band, in pixels. */
  radius: number;
}

export interface TimedPosition {
  x: number;
  y: number;
  time: number;
}

export interface Point {
  x: number;
  y: number;
}

/** The view transform currently applied to the target face. */
export interface TargetView {
  scale: number;
  focusX: number;
  focusY: number;
  /** Vertical shift that lifts the crosshair above the fingertip. */
  offset: number;
  size: number;
}

export function isFieldTarget(targetType?: string): boolean {
  'worklet';
  return targetType?.startsWith('felt-') ?? false;
}

export function isCentre6Target(targetType?: string): boolean {
  'worklet';
  return targetType === '80cm-centre-6';
}

/**
 * Scoring bands for a face, innermost first. The last entry is the outer edge
 * of the face; anything beyond it is a miss.
 *
 * A full face is drawn as ten circles of radius `(11 - i) * unit`, so the gold
 * 10 is a 2-unit disc and every band outside it is one unit wide. The reduced
 * centre-6 face divides the same outer radius evenly between its six bands.
 */
export function targetRings(size: number, targetType?: string): Ring[] {
  'worklet';
  const unit = size / RING_UNIT_DIVISOR;
  const outerRadius = unit * 11;

  if (isCentre6Target(targetType)) {
    const rings: Ring[] = [];
    for (let i = 0; i < CENTRE_6_RING_COUNT; i++) {
      rings.push({
        score: MAX_SCORE - i,
        radius: (outerRadius * (i + 1)) / CENTRE_6_RING_COUNT,
      });
    }
    return rings;
  }

  const rings: Ring[] = [];
  for (let i = 0; i < FULL_RING_COUNT; i++) {
    rings.push({
      score: MAX_SCORE - i,
      radius: unit * (i + 2),
    });
  }
  return rings;
}

/**
 * Score a hit at (x, y) in target coordinates. Returns 0 for a miss.
 */
export function scoreAt(x: number, y: number, size: number, targetType?: string): number {
  'worklet';
  const centre = size / 2;
  const dx = x - centre;
  const dy = y - centre;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const rings = targetRings(size, targetType);
  for (let i = 0; i < rings.length; i++) {
    if (distance <= rings[i].radius) {
      return rings[i].score;
    }
  }
  return 0;
}

/**
 * Convert a touch point in wrapper coordinates into target coordinates.
 *
 * This is the exact inverse of the transform applied in `animatedTargetStyle`:
 *   screenX = size / 2 - focusX * scale + targetX * scale
 *   screenY = size / 2 - offset - focusY * scale + targetY * scale
 *
 * At rest (scale 1, focus centred, no offset) it is the identity, so a tap on
 * an un-zoomed face needs no special case.
 */
export function screenToTarget(screenX: number, screenY: number, view: TargetView): Point {
  'worklet';
  const centre = view.size / 2;
  return {
    x: (screenX - centre) / view.scale + view.focusX,
    y: (screenY - centre + view.offset) / view.scale + view.focusY,
  };
}

/** Clamp a target coordinate to the face. */
export function clampToTarget(value: number, size: number): number {
  'worklet';
  return Math.max(0, Math.min(size, value));
}

/** How much of the end of a gesture is treated as finger slip. */
export const SLIP_WINDOW_MS = 100;

/**
 * The position the finger held before it started to slip.
 *
 * Lifting a finger drags it a few pixels, which would otherwise move the arrow
 * off the ring the archer was aiming at. Ignoring the last `SLIP_WINDOW_MS` of
 * travel keeps the placement where the finger rested. When the whole gesture is
 * shorter than the window there is no slip to discard, so the first sample —
 * the point that was touched — is used.
 */
export function maturePosition(history: TimedPosition[], now: number, windowMs: number = SLIP_WINDOW_MS): Point | null {
  'worklet';
  if (history.length === 0) return null;

  const cutoff = now - windowMs;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= cutoff) {
      return { x: history[i].x, y: history[i].y };
    }
  }

  return { x: history[0].x, y: history[0].y };
}

import { maturePosition, screenToTarget, scoreAt, targetRings } from '../targetGeometry';

// A 220px face gives unit = 220 / 22 = 10px, so ring radii land on whole pixels.
const SIZE = 220;
const UNIT = SIZE / 22;
const CENTRE = SIZE / 2;

describe('targetRings', () => {
  it('gives the standard face ten bands whose outer edge fills the face', () => {
    const rings = targetRings(SIZE);

    expect(rings).toHaveLength(10);
    expect(rings[0]).toEqual({ score: 10, radius: 2 * UNIT });
    expect(rings[9]).toEqual({ score: 1, radius: 11 * UNIT });
  });

  it('gives the 80cm centre-6 face six bands that still fill the face', () => {
    const rings = targetRings(SIZE, '80cm-centre-6');

    expect(rings).toHaveLength(6);
    expect(rings.map((r) => r.score)).toEqual([10, 9, 8, 7, 6, 5]);
    expect(rings[5].radius).toBe(11 * UNIT);
  });
});

describe('scoreAt', () => {
  it('scores a dead-centre hit as 10', () => {
    expect(scoreAt(CENTRE, CENTRE, SIZE)).toBe(10);
  });

  it('scores each drawn ring as the value that ring is painted for', () => {
    // Band i is drawn between radius (10 - i)u and (11 - i)u and is worth i + 1.
    for (let i = 0; i < 10; i++) {
      const radius = (10 - i + 0.5) * UNIT;
      expect(scoreAt(CENTRE + radius, CENTRE, SIZE)).toBe(i + 1);
    }
  });

  it('scores the outermost white ring as 1, not a miss', () => {
    expect(scoreAt(CENTRE + 10.5 * UNIT, CENTRE, SIZE)).toBe(1);
  });

  it('scores a hit outside the face as 0', () => {
    expect(scoreAt(CENTRE + 11.5 * UNIT, CENTRE, SIZE)).toBe(0);
  });

  it('measures distance radially, not per-axis', () => {
    // 3-4-5 triangle: 3u across and 4u down is exactly 5u from centre, on the 7 ring's outer edge.
    expect(scoreAt(CENTRE + 3 * UNIT, CENTRE + 4 * UNIT, SIZE)).toBe(7);
    // A hair further out drops into the 6.
    expect(scoreAt(CENTRE + 3.1 * UNIT, CENTRE + 4.1 * UNIT, SIZE)).toBe(6);
  });

  it('scores the centre-6 face over its own six bands', () => {
    expect(scoreAt(CENTRE, CENTRE, SIZE, '80cm-centre-6')).toBe(10);
    expect(scoreAt(CENTRE + 10.5 * UNIT, CENTRE, SIZE, '80cm-centre-6')).toBe(5);
    expect(scoreAt(CENTRE + 11.5 * UNIT, CENTRE, SIZE, '80cm-centre-6')).toBe(0);
  });
});

describe('screenToTarget', () => {
  const rest = { scale: 1, focusX: CENTRE, focusY: CENTRE, offset: 0, size: SIZE };

  it('is the identity transform when the face is not zoomed', () => {
    expect(screenToTarget(30, 40, rest)).toEqual({ x: 30, y: 40 });
  });

  it('inverts the render transform so a touch maps back to the point under it', () => {
    const view = { scale: 2.5, focusX: 40, focusY: 160, offset: 30, size: SIZE };

    // Forward transform used by the animated style: screen = centre - offset? + target * scale
    const forwardX = CENTRE - view.focusX * view.scale + 73 * view.scale;
    const forwardY = CENTRE - view.offset - view.focusY * view.scale + 91 * view.scale;

    const point = screenToTarget(forwardX, forwardY, view);

    expect(point.x).toBeCloseTo(73);
    expect(point.y).toBeCloseTo(91);
  });

  it('maps the crosshair position back to the focus point', () => {
    const view = { scale: 2.5, focusX: 40, focusY: 160, offset: 30, size: SIZE };

    const point = screenToTarget(CENTRE, CENTRE - view.offset, view);

    expect(point.x).toBeCloseTo(view.focusX);
    expect(point.y).toBeCloseTo(view.focusY);
  });
});

describe('maturePosition', () => {
  it('returns null for an empty history', () => {
    expect(maturePosition([], 1000)).toBeNull();
  });

  it('returns the most recent sample older than the slip window', () => {
    const history = [
      { x: 10, y: 10, time: 800 },
      { x: 20, y: 20, time: 880 },
      { x: 99, y: 99, time: 960 }, // inside the last 100ms — the slip
    ];

    expect(maturePosition(history, 1000)).toEqual({ x: 20, y: 20 });
  });

  it('ignores every sample recorded during the slip window', () => {
    const history = [
      { x: 10, y: 10, time: 800 },
      { x: 91, y: 91, time: 950 },
      { x: 92, y: 92, time: 970 },
      { x: 93, y: 93, time: 990 },
    ];

    expect(maturePosition(history, 1000)).toEqual({ x: 10, y: 10 });
  });

  it('falls back to the first sample when the whole gesture fits inside the window', () => {
    const history = [
      { x: 10, y: 10, time: 960 },
      { x: 40, y: 40, time: 990 },
    ];

    expect(maturePosition(history, 1000)).toEqual({ x: 10, y: 10 });
  });

  it('returns the only sample of a gesture that recorded once', () => {
    expect(maturePosition([{ x: 7, y: 8, time: 990 }], 1000)).toEqual({ x: 7, y: 8 });
  });
});

import { describe, it, expect } from 'vitest';
import {
  makeFollower,
  updateTracking,
  isStuck,
  startPath,
  endPath,
  STUCK_THRESHOLD_TICKS,
} from './mob_path_stuck';

describe('mob path stuck', () => {
  it('detects stuck', () => {
    const p = makeFollower({ x: 0, y: 0, z: 0 });
    startPath(p, 0);
    for (let t = 0; t < STUCK_THRESHOLD_TICKS; t++) {
      updateTracking(p, { currentPos: { x: 0, y: 0, z: 0 }, nowTick: t });
    }
    expect(isStuck(p, STUCK_THRESHOLD_TICKS)).toBe(true);
  });

  it('moves reset timer', () => {
    const p = makeFollower({ x: 0, y: 0, z: 0 });
    startPath(p, 0);
    updateTracking(p, { currentPos: { x: 5, y: 0, z: 0 }, nowTick: 10 });
    expect(isStuck(p, 10 + STUCK_THRESHOLD_TICKS - 1)).toBe(false);
  });

  it('no path = not stuck', () => {
    const p = makeFollower({ x: 0, y: 0, z: 0 });
    expect(isStuck(p, 100)).toBe(false);
  });

  it('end path clears stuck', () => {
    const p = makeFollower({ x: 0, y: 0, z: 0 });
    startPath(p, 0);
    updateTracking(p, { currentPos: { x: 0, y: 0, z: 0 }, nowTick: STUCK_THRESHOLD_TICKS });
    expect(isStuck(p, STUCK_THRESHOLD_TICKS)).toBe(true);
    endPath(p);
    expect(isStuck(p, STUCK_THRESHOLD_TICKS)).toBe(false);
  });
});

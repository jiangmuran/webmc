import { describe, it, expect } from 'vitest';
import {
  yawDelta,
  paddlingActive,
  dampenYaw,
  MAX_TURN_RATE_RADS_PER_TICK,
  type BoatControl,
} from './boat_turn_rotation';

const idle: BoatControl = { forward: false, back: false, left: false, right: false };

describe('boat turn rotation', () => {
  it('no input no turn', () => {
    expect(yawDelta(idle)).toBe(0);
  });

  it('left turns negative', () => {
    expect(yawDelta({ ...idle, left: true })).toBeLessThan(0);
  });

  it('forward boosts turn', () => {
    const turnOnly = yawDelta({ ...idle, right: true });
    const turnPlus = yawDelta({ ...idle, right: true, forward: true });
    expect(Math.abs(turnPlus)).toBeGreaterThan(Math.abs(turnOnly));
  });

  it('paddling active with input', () => {
    expect(paddlingActive({ ...idle, forward: true })).toBe(true);
  });

  it('still idle not paddling', () => {
    expect(paddlingActive(idle)).toBe(false);
  });

  it('damp progresses toward target', () => {
    expect(dampenYaw(0, 1, 0.5)).toBe(0.5);
  });

  it('turn rate bounded', () => {
    expect(Math.abs(yawDelta({ ...idle, left: true, forward: true }))).toBeLessThanOrEqual(
      MAX_TURN_RATE_RADS_PER_TICK * 2,
    );
  });
});

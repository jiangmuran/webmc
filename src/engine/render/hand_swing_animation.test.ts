import { describe, it, expect } from 'vitest';
import {
  startSwing,
  tickSwing,
  swingProgress,
  swingAngle,
  SWING_DURATION_TICKS,
} from './hand_swing_animation';

describe('hand swing animation', () => {
  it('start full duration', () => {
    expect(startSwing().ticksRemaining).toBe(SWING_DURATION_TICKS);
  });

  it('tick decrements', () => {
    expect(tickSwing({ ticksRemaining: 3, amplitude: 1 }).ticksRemaining).toBe(2);
  });

  it('tick clamps at 0', () => {
    expect(tickSwing({ ticksRemaining: 0, amplitude: 1 }).ticksRemaining).toBe(0);
  });

  it('progress 0 at rest', () => {
    expect(swingProgress({ ticksRemaining: 0, amplitude: 1 })).toBe(0);
  });

  it('angle peaks mid-swing', () => {
    const mid = swingAngle({ ticksRemaining: SWING_DURATION_TICKS / 2, amplitude: 1 });
    expect(mid).toBeGreaterThan(0);
  });

  it('angle zero at rest', () => {
    expect(swingAngle({ ticksRemaining: 0, amplitude: 1 })).toBe(0);
  });
});

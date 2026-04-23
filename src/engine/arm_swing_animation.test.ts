import { describe, it, expect } from 'vitest';
import {
  initSwing,
  trigger,
  tick,
  angleRadians,
  isActive,
  ARM_SWING_DURATION_TICKS,
} from './arm_swing_animation';

describe('arm swing animation', () => {
  it('init 0', () => {
    expect(initSwing().progress).toBe(0);
  });

  it('trigger resets', () => {
    const s = tick(tick(initSwing()));
    expect(trigger(s).progress).toBe(0);
  });

  it('tick advances', () => {
    const s = tick(initSwing());
    expect(s.progress).toBeCloseTo(1 / ARM_SWING_DURATION_TICKS);
  });

  it('completes after N ticks', () => {
    let s = initSwing();
    for (let i = 0; i < ARM_SWING_DURATION_TICKS; i++) s = tick(s);
    expect(s.targetReached).toBe(true);
  });

  it('angle zero at endpoints', () => {
    expect(angleRadians({ progress: 0, targetReached: false })).toBeCloseTo(0);
    expect(angleRadians({ progress: 1, targetReached: true })).toBeCloseTo(0);
  });

  it('isActive partway', () => {
    expect(isActive({ progress: 0.5, targetReached: false })).toBe(true);
    expect(isActive({ progress: 0, targetReached: false })).toBe(false);
  });
});

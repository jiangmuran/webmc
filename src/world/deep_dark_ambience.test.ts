import { describe, it, expect } from 'vitest';
import {
  shriek,
  decay,
  darknessIntensity,
  MAX_STACKS,
  STACK_DURATION_TICKS,
} from './deep_dark_ambience';

describe('deep dark ambience', () => {
  it('shriek increments stacks', () => {
    const s = { stacks: { level: 0 }, lastShriekTick: 0 };
    expect(shriek(s, 100)).toBe('warn');
    expect(s.stacks.level).toBe(1);
  });

  it('max = summon', () => {
    const s = { stacks: { level: MAX_STACKS - 1 }, lastShriekTick: 0 };
    expect(shriek(s, 0)).toBe('summon');
  });

  it('decay drops 1 over time', () => {
    const s = { stacks: { level: 2 }, lastShriekTick: 0 };
    decay(s, STACK_DURATION_TICKS);
    expect(s.stacks.level).toBe(1);
  });

  it('intensity pulses', () => {
    expect(darknessIntensity(0)).toBeCloseTo(0);
    expect(darknessIntensity(15)).toBe(1);
    expect(darknessIntensity(49)).toBe(0);
  });
});

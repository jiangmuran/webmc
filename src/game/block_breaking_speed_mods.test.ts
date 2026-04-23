import { describe, it, expect } from 'vitest';
import { effectiveSpeed, ticksToBreak } from './block_breaking_speed_mods';

const base = {
  baseSpeed: 4,
  efficiencyLevel: 0,
  hasteAmplifier: 0,
  miningFatigueAmplifier: 0,
  underwaterNotAquaAffinity: false,
  notOnGround: false,
};

describe('block breaking speed mods', () => {
  it('efficiency speeds up', () => {
    expect(effectiveSpeed({ ...base, efficiencyLevel: 3 })).toBeGreaterThan(effectiveSpeed(base));
  });

  it('haste speeds up', () => {
    expect(effectiveSpeed({ ...base, hasteAmplifier: 2 })).toBeGreaterThan(effectiveSpeed(base));
  });

  it('mining fatigue slows', () => {
    expect(effectiveSpeed({ ...base, miningFatigueAmplifier: 1 })).toBeLessThan(
      effectiveSpeed(base),
    );
  });

  it('underwater penalty', () => {
    expect(effectiveSpeed({ ...base, underwaterNotAquaAffinity: true })).toBeLessThan(
      effectiveSpeed(base),
    );
  });

  it('ticks scales with hardness', () => {
    expect(ticksToBreak(3, base)).toBeGreaterThan(ticksToBreak(1, base));
  });
});

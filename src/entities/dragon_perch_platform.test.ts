import { describe, it, expect } from 'vitest';
import { shouldPerch, breathAttackDurationTicks } from './dragon_perch_platform';

describe('dragon perch platform', () => {
  it('crystals block perch', () => {
    expect(shouldPerch({ hpPercent: 0.1, allCrystalsDestroyed: false, ticksInAir: 99999 })).toBe(
      false,
    );
  });

  it('perches at low HP', () => {
    expect(shouldPerch({ hpPercent: 0.2, allCrystalsDestroyed: true, ticksInAir: 0 })).toBe(true);
  });

  it('perches after long airtime', () => {
    expect(shouldPerch({ hpPercent: 1, allCrystalsDestroyed: true, ticksInAir: 2000 })).toBe(true);
  });

  it('breath duration positive', () => {
    expect(breathAttackDurationTicks()).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { triggerChance, reflectedDamage, stackChance, THORNS_MAX_DAMAGE } from './thorns_damage';

describe('thorns damage', () => {
  it('no level no trigger', () => {
    expect(triggerChance(0)).toBe(0);
  });

  it('trigger scales 15% per level', () => {
    expect(triggerChance(3)).toBeCloseTo(0.45);
  });

  it('damage 0 when roll above chance', () => {
    expect(reflectedDamage(1, () => 0.9)).toBe(0);
  });

  it('damage capped at max', () => {
    for (let i = 0; i < 100; i++) {
      const d = reflectedDamage(3, Math.random);
      expect(d).toBeLessThanOrEqual(THORNS_MAX_DAMAGE);
    }
  });

  it('stack capped at 100%', () => {
    expect(stackChance(20)).toBe(1);
  });
});

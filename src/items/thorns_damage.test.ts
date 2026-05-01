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

  it('damage range is 1–5 inclusive (wiki)', () => {
    expect(THORNS_MAX_DAMAGE).toBe(5);
    // Two .999... rand calls: first passes triggerChance, second hits the upper roll.
    let calls = 0;
    const rand = (): number => (calls++ === 0 ? 0 : 0.9999);
    expect(reflectedDamage(3, rand)).toBe(5);
  });

  it('stack capped at 100%', () => {
    expect(stackChance(20)).toBe(1);
  });
});

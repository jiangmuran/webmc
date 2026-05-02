import { describe, it, expect } from 'vitest';
import {
  damageAtDistance,
  fireworkBaseDamage,
  fireworkDamageRadius,
  selfBoostDamage,
} from './firework_damage';

const STAR = { shape: 'small' as const, hasTrail: false, hasTwinkle: false };

describe('firework damage', () => {
  it('no stars = 0 damage', () => {
    expect(fireworkBaseDamage([])).toBe(0);
  });

  it('2 stars = 9 base damage (wiki: 7 + 2 per extra)', () => {
    expect(fireworkBaseDamage([STAR, STAR])).toBe(9);
  });

  it('1 star = 7 base damage', () => {
    expect(fireworkBaseDamage([STAR])).toBe(7);
  });

  it('radius is 5', () => {
    expect(fireworkDamageRadius()).toBe(5);
  });

  it('damage falls off with distance', () => {
    const close = damageAtDistance({ stars: [STAR, STAR], playerDirectUse: false }, 0);
    const mid = damageAtDistance({ stars: [STAR, STAR], playerDirectUse: false }, 3);
    const far = damageAtDistance({ stars: [STAR, STAR], playerDirectUse: false }, 6);
    expect(close).toBeGreaterThan(mid);
    expect(far).toBe(0);
  });

  it('star-less rocket is harmless in elytra', () => {
    expect(selfBoostDamage([])).toBe(0);
  });

  it('star-bearing rocket self-damages', () => {
    expect(selfBoostDamage([STAR, STAR])).toBeGreaterThan(0);
  });
});

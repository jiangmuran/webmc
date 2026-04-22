import { describe, it, expect } from 'vitest';
import {
  makeZoglin,
  attackDamageByDifficulty,
  isValidTarget,
  attackMultiplier,
  ZOGLIN_MAX_HP,
} from './zoglin_despawn';

describe('zoglin', () => {
  it('max hp 40', () => {
    const z = makeZoglin();
    expect(z.maxHp).toBe(ZOGLIN_MAX_HP);
  });

  it('damage scales with diff', () => {
    expect(attackDamageByDifficulty('hard')).toBeGreaterThan(attackDamageByDifficulty('easy'));
  });

  it('peaceful zero damage', () => {
    expect(attackDamageByDifficulty('peaceful')).toBe(0);
  });

  it('does not target own kind', () => {
    expect(isValidTarget('zoglin')).toBe(false);
    expect(isValidTarget('pig')).toBe(true);
  });

  it('baby attack halved', () => {
    expect(attackMultiplier(true)).toBe(0.5);
  });
});

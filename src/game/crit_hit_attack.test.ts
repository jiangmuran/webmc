import { describe, it, expect } from 'vitest';
import { isCrit, damageWithCrit } from './crit_hit_attack';

const base = {
  falling: true,
  sprinting: false,
  onGround: false,
  inWater: false,
  hasAnyEffect: false,
};

describe('crit hit attack', () => {
  it('falling crits', () => {
    expect(isCrit(base)).toBe(true);
  });

  it('sprint cancels', () => {
    expect(isCrit({ ...base, sprinting: true })).toBe(false);
  });

  it('on ground cancels', () => {
    expect(isCrit({ ...base, onGround: true })).toBe(false);
  });

  it('in water cancels', () => {
    expect(isCrit({ ...base, inWater: true })).toBe(false);
  });

  it('crit multiplies damage', () => {
    expect(damageWithCrit(4, base)).toBe(6);
  });
});

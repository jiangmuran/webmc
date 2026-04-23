import { describe, it, expect } from 'vitest';
import { damageOnHit, knockbackDir, stacksUpTo } from './snowball_impact';

describe('snowball impact', () => {
  it('blaze takes damage', () => {
    expect(damageOnHit('blaze')).toBe(3);
  });

  it('zombie takes 0', () => {
    expect(damageOnHit('zombie')).toBe(0);
  });

  it('knockback away from attacker', () => {
    const v = knockbackDir({ x: 0, z: 0 }, { x: 5, z: 0 });
    expect(v.x).toBeGreaterThan(0);
  });

  it('stacks 16', () => {
    expect(stacksUpTo()).toBe(16);
  });
});

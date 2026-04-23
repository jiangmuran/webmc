import { describe, it, expect } from 'vitest';
import { bounceVelocity, honeySlowMultiplier, negatesFallDamage } from './slime_honey_bounce';

describe('slime honey bounce', () => {
  it('slime bounces', () => {
    expect(bounceVelocity({ block: 'slime_block', fallDistance: 5, sneaking: false })).toBeGreaterThan(
      0,
    );
  });

  it('sneak skips bounce', () => {
    expect(bounceVelocity({ block: 'slime_block', fallDistance: 5, sneaking: true })).toBe(0);
  });

  it('honey no bounce', () => {
    expect(bounceVelocity({ block: 'honey_block', fallDistance: 5, sneaking: false })).toBe(0);
  });

  it('honey slows movement', () => {
    expect(honeySlowMultiplier('honey_block')).toBeLessThan(1);
  });

  it('both negate fall damage', () => {
    expect(negatesFallDamage('slime_block')).toBe(true);
    expect(negatesFallDamage('stone')).toBe(false);
  });
});

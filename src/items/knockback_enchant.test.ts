import { describe, it, expect } from 'vitest';
import { knockbackStrength, effectiveStrength, onSword, onAxe } from './knockback_enchant';

describe('knockback enchant', () => {
  it('base scales', () => {
    expect(knockbackStrength(2)).toBe(2);
  });

  it('caps at max', () => {
    expect(knockbackStrength(10)).toBe(2);
  });

  it('no level zero', () => {
    expect(knockbackStrength(0)).toBe(0);
  });

  it('sprint boosts', () => {
    expect(effectiveStrength(1, true)).toBe(2);
  });

  it('non-sprint normal', () => {
    expect(effectiveStrength(1, false)).toBe(1);
  });

  it('on sword yes', () => {
    expect(onSword()).toBe(true);
    expect(onAxe()).toBe(false);
  });
});

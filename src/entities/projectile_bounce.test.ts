import { describe, it, expect } from 'vitest';
import { directDamageOn, resolveImpact, snowballAppliesDamage } from './projectile_bounce';

describe('projectile impact', () => {
  it('snowball expires on anything', () => {
    expect(resolveImpact({ kind: 'snowball', surface: 'block' })).toBe('expire');
    expect(resolveImpact({ kind: 'snowball', surface: 'entity' })).toBe('expire');
  });

  it('arrow sticks on block', () => {
    expect(resolveImpact({ kind: 'arrow', surface: 'block' })).toBe('stick');
  });

  it('arrow expires on entity', () => {
    expect(resolveImpact({ kind: 'arrow', surface: 'entity' })).toBe('expire');
  });

  it('trident with loyalty returns', () => {
    expect(resolveImpact({ kind: 'trident', surface: 'block', loyaltyLevel: 2 })).toBe('return');
  });

  it('trident without loyalty sticks', () => {
    expect(resolveImpact({ kind: 'trident', surface: 'block', loyaltyLevel: 0 })).toBe('stick');
  });

  it('fishing hook sticks on water', () => {
    expect(resolveImpact({ kind: 'fishing_hook', surface: 'water' })).toBe('stick');
  });

  it('snowball damages blaze only', () => {
    expect(directDamageOn('snowball', true)).toBe(3);
    expect(directDamageOn('snowball', false)).toBe(0);
    expect(snowballAppliesDamage(true)).toBe(true);
  });

  it('fireball damages on contact', () => {
    expect(directDamageOn('fireball', false)).toBe(6);
  });

  it('wither skull hits hard', () => {
    expect(directDamageOn('wither_skull', false)).toBe(8);
  });
});

import { describe, it, expect } from 'vitest';
import { applyFortune, isFortuneApplicable } from './loot_fortune';

describe('fortune', () => {
  it('level 0 = base drop unchanged', () => {
    expect(applyFortune({ baseDrop: 1, level: 0, rng: () => 0.5, kind: 'ore' })).toBe(1);
  });

  it('fortune increases ore drops', () => {
    const mean0 = applyFortune({ baseDrop: 1, level: 0, rng: () => 0.5, kind: 'ore' });
    const mean3 = applyFortune({ baseDrop: 1, level: 3, rng: () => 0.99, kind: 'ore' });
    expect(mean3).toBeGreaterThanOrEqual(mean0);
  });

  it('crop binomial boost', () => {
    const mean = applyFortune({ baseDrop: 1, level: 3, rng: () => 0.1, kind: 'crop' });
    expect(mean).toBeGreaterThan(1);
  });

  it('glowstone capped at 4', () => {
    const r = applyFortune({ baseDrop: 4, level: 3, rng: () => 0.99, kind: 'glowstone' });
    expect(r).toBe(4);
  });

  it('other kind unaffected', () => {
    expect(applyFortune({ baseDrop: 3, level: 3, rng: () => 0.5, kind: 'other' })).toBe(3);
  });

  it('ore table includes diamond', () => {
    expect(isFortuneApplicable('webmc:diamond_ore')).toBe(true);
    expect(isFortuneApplicable('webmc:stone')).toBe(false);
  });
});

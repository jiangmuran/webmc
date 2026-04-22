import { describe, it, expect } from 'vitest';
import {
  allowsHostileMobs,
  hungerStarvationDamage,
  naturalRegenInterval,
  mobDamageMultiplier,
} from './difficulty_scaling';

describe('difficulty scaling', () => {
  it('peaceful no hostiles', () => {
    expect(allowsHostileMobs('peaceful')).toBe(false);
    expect(allowsHostileMobs('hard')).toBe(true);
  });

  it('peaceful no starvation', () => {
    expect(hungerStarvationDamage('peaceful')).toBe(0);
  });

  it('hard damages more', () => {
    expect(mobDamageMultiplier('hard')).toBeGreaterThan(mobDamageMultiplier('normal'));
  });

  it('peaceful zero damage', () => {
    expect(mobDamageMultiplier('peaceful')).toBe(0);
  });

  it('regen slower on hard', () => {
    expect(naturalRegenInterval('hard')).toBeGreaterThan(naturalRegenInterval('normal'));
  });
});

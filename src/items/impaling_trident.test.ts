import { describe, it, expect } from 'vitest';
import { isAquatic, damageBonus, IMPALING_MAX } from './impaling_trident';

describe('impaling trident', () => {
  it('guardian aquatic', () => {
    expect(isAquatic('guardian')).toBe(true);
  });

  it('zombie not aquatic', () => {
    expect(isAquatic('zombie')).toBe(false);
  });

  it('no bonus at 0', () => {
    expect(damageBonus(0, 'guardian', false)).toBe(0);
  });

  it('bonus to aquatic target', () => {
    expect(damageBonus(3, 'squid', false)).toBeCloseTo(7.5);
  });

  it('Java Edition: zombie in water gets NO bonus (wiki)', () => {
    expect(damageBonus(2, 'zombie', true)).toBe(0);
  });

  it('Java Edition: drowned is NOT aquatic (wiki: MC-128249 WAI)', () => {
    expect(isAquatic('drowned')).toBe(false);
    expect(damageBonus(2, 'drowned', false)).toBe(0);
  });

  it('no bonus to land target out of water', () => {
    expect(damageBonus(5, 'cow', false)).toBe(0);
  });

  it('caps at max', () => {
    expect(damageBonus(100, 'guardian', true)).toBe(IMPALING_MAX * 2.5);
  });
});

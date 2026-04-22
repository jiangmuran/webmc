import { describe, it, expect } from 'vitest';
import { afterArmor, afterResistance, makeDamage } from './damage_source';

describe('damage source', () => {
  it('melee does not bypass armor', () => {
    const d = makeDamage('melee', 10);
    expect(d.bypassesArmor).toBe(false);
  });

  it('drown bypasses armor', () => {
    expect(makeDamage('drown', 2).bypassesArmor).toBe(true);
  });

  it('void bypasses everything', () => {
    const d = makeDamage('void', 100);
    expect(d.bypassesArmor).toBe(true);
    expect(d.bypassesInvulnerability).toBe(true);
  });

  it('fire flag set', () => {
    expect(makeDamage('lava', 4).isFire).toBe(true);
  });

  it('afterArmor reduces', () => {
    const d = makeDamage('melee', 10);
    expect(afterArmor({ source: d, armorReduction: 0.5 })).toBe(5);
  });

  it('bypass source ignores armor', () => {
    const d = makeDamage('drown', 2);
    expect(afterArmor({ source: d, armorReduction: 0.9 })).toBe(2);
  });

  it('resistance level 2 = -40%', () => {
    const d = makeDamage('melee', 10);
    expect(afterResistance({ source: d, amount: 10, resistanceLevel: 2 })).toBeCloseTo(6);
  });

  it('resistance 0 = no reduction', () => {
    const d = makeDamage('melee', 10);
    expect(afterResistance({ source: d, amount: 10, resistanceLevel: 0 })).toBe(10);
  });
});

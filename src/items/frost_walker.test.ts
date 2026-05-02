import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { frostWalkerStep, frostedIceDecayTime } from './frost_walker';

const plainBoots: Enchanted = { itemId: 1, count: 1, damage: 0 };

describe('frost walker', () => {
  it('no frost without enchant', () => {
    const out = frostWalkerStep(plainBoots, { x: 0, y: 64, z: 0 }, { isWaterSource: () => true });
    expect(out.length).toBe(0);
  });

  it('level 1 freezes within radius 3 (wiki: 2 + level)', () => {
    const boots = applyEnchant(plainBoots, 'frost_walker', 1);
    const out = frostWalkerStep(boots, { x: 0, y: 64, z: 0 }, { isWaterSource: () => true });
    // Radius-3 circle has more cells than radius-2.
    expect(out.length).toBeGreaterThan(20);
    for (const p of out) {
      expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(3.5);
    }
  });

  it('level 2 freezes within radius 4 (wiki: 2 + level)', () => {
    const boots = applyEnchant(plainBoots, 'frost_walker', 2);
    const out = frostWalkerStep(boots, { x: 0, y: 64, z: 0 }, { isWaterSource: () => true });
    for (const p of out) {
      expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(4.5);
    }
    // The radius-4 circle has more cells than the radius-3 circle.
    const r3 = frostWalkerStep(
      applyEnchant(plainBoots, 'frost_walker', 1),
      { x: 0, y: 64, z: 0 },
      { isWaterSource: () => true },
    );
    expect(out.length).toBeGreaterThan(r3.length);
  });

  it('only freezes water sources', () => {
    const boots = applyEnchant(plainBoots, 'frost_walker', 2);
    const out = frostWalkerStep(boots, { x: 0, y: 64, z: 0 }, { isWaterSource: (x) => x === 0 });
    for (const p of out) expect(p.x).toBe(0);
  });

  it('decay time defined', () => {
    expect(frostedIceDecayTime()).toBeGreaterThan(0);
  });
});

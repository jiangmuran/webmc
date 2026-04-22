import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { frostWalkerStep, frostedIceDecayTime } from './frost_walker';

const plainBoots: Enchanted = { itemId: 1, count: 1, damage: 0 };

describe('frost walker', () => {
  it('no frost without enchant', () => {
    const out = frostWalkerStep(plainBoots, { x: 0, y: 64, z: 0 }, { isWaterSource: () => true });
    expect(out.length).toBe(0);
  });

  it('level 1 freezes within radius 2', () => {
    const boots = applyEnchant(plainBoots, 'frost_walker', 1);
    const out = frostWalkerStep(boots, { x: 0, y: 64, z: 0 }, { isWaterSource: () => true });
    // Radius-2 circle → 13 cells inside (including center).
    expect(out.length).toBeGreaterThan(4);
    for (const p of out) {
      expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(2.5);
    }
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

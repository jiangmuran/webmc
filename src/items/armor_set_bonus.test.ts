import { describe, it, expect } from 'vitest';
import {
  totalProtection,
  totalToughness,
  totalKbResist,
  damageWithArmor,
  type ArmorPiece,
} from './armor_set_bonus';

const iron: ArmorPiece[] = [
  { slot: 'helmet', material: 'iron', protection: 2, toughness: 0, knockbackResistance: 0 },
  { slot: 'chestplate', material: 'iron', protection: 6, toughness: 0, knockbackResistance: 0 },
  { slot: 'leggings', material: 'iron', protection: 5, toughness: 0, knockbackResistance: 0 },
  { slot: 'boots', material: 'iron', protection: 2, toughness: 0, knockbackResistance: 0 },
];

describe('armor set bonus', () => {
  it('total protection', () => {
    expect(totalProtection(iron)).toBe(15);
  });

  it('toughness 0 iron', () => {
    expect(totalToughness(iron)).toBe(0);
  });

  it('netherite has kb resist', () => {
    const n: ArmorPiece[] = [
      {
        slot: 'helmet',
        material: 'netherite',
        protection: 3,
        toughness: 3,
        knockbackResistance: 0.1,
      },
    ];
    expect(totalKbResist(n)).toBeCloseTo(0.1);
  });

  it('armor reduces damage', () => {
    expect(damageWithArmor(10, 15, 0)).toBeLessThan(10);
  });

  it('no armor full damage', () => {
    expect(damageWithArmor(10, 0, 0)).toBe(10);
  });

  it('toughness helps against heavy hits', () => {
    const d1 = damageWithArmor(20, 15, 0);
    const d2 = damageWithArmor(20, 15, 8);
    expect(d2).toBeLessThan(d1);
  });
});

import { describe, it, expect } from 'vitest';
import {
  defenseOf,
  dyeLeatherArmor,
  equipHorseArmor,
  type EquippedHorseArmor,
} from './horse_armor';

function empty(): EquippedHorseArmor {
  return { armor: null };
}

describe('horse armor', () => {
  it('iron beats leather which beats none', () => {
    const s = empty();
    expect(defenseOf(s)).toBe(0);
    equipHorseArmor(s, 'iron');
    expect(defenseOf(s)).toBe(5);
    equipHorseArmor(s, 'leather');
    expect(defenseOf(s)).toBe(3);
  });

  it('diamond is the best armor', () => {
    const s = empty();
    equipHorseArmor(s, 'diamond');
    expect(defenseOf(s)).toBe(11);
  });

  it('dye applies only on leather', () => {
    const s = empty();
    equipHorseArmor(s, 'iron');
    expect(dyeLeatherArmor(s, [255, 0, 0])).toBe(false);
    equipHorseArmor(s, 'leather');
    expect(dyeLeatherArmor(s, [255, 0, 0])).toBe(true);
    expect(s.dyeRgb).toEqual([255, 0, 0]);
  });
});

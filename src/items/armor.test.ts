import { describe, it, expect } from 'vitest';
import {
  ARMOR_DEFS,
  incomingDamage,
  makeEmptyArmorSet,
  protectionLevel,
  totalDefense,
  totalToughness,
  type ArmorSet,
} from './armor';
import { applyEnchant } from './enchantment';

function equip(slot: keyof ArmorSet, key: keyof typeof ARMOR_DEFS): ArmorSet {
  const def = ARMOR_DEFS[key];
  if (!def) throw new Error(`missing def ${key}`);
  return {
    ...makeEmptyArmorSet(),
    [slot]: { def, stack: { itemId: 1, count: 1, damage: 0 } },
  };
}

describe('armor', () => {
  it('empty set does nothing', () => {
    const s = makeEmptyArmorSet();
    expect(totalDefense(s)).toBe(0);
    expect(incomingDamage(10, s)).toBe(10);
  });

  it('diamond chestplate reduces a 10-damage hit noticeably', () => {
    const s = equip('chestplate', 'diamond_chestplate');
    const out = incomingDamage(10, s);
    expect(out).toBeLessThan(10);
    expect(out).toBeGreaterThan(0);
  });

  it('full diamond armor reduces more than chestplate alone', () => {
    const helmetDef = ARMOR_DEFS['diamond_helmet'];
    const chestDef = ARMOR_DEFS['diamond_chestplate'];
    const legsDef = ARMOR_DEFS['diamond_leggings'];
    const bootsDef = ARMOR_DEFS['diamond_boots'];
    if (!helmetDef || !chestDef || !legsDef || !bootsDef) throw new Error('missing diamond armor');
    const s: ArmorSet = {
      helmet: { def: helmetDef, stack: { itemId: 1, count: 1, damage: 0 } },
      chestplate: { def: chestDef, stack: { itemId: 1, count: 1, damage: 0 } },
      leggings: { def: legsDef, stack: { itemId: 1, count: 1, damage: 0 } },
      boots: { def: bootsDef, stack: { itemId: 1, count: 1, damage: 0 } },
    };
    const fullOut = incomingDamage(10, s);
    const chestOnly = incomingDamage(10, equip('chestplate', 'diamond_chestplate'));
    expect(fullOut).toBeLessThan(chestOnly);
    expect(totalDefense(s)).toBe(20);
    expect(totalToughness(s)).toBe(8);
  });

  it('protection enchants stack toward 80% cap', () => {
    const s = equip('chestplate', 'iron_chestplate');
    const piece = s.chestplate;
    if (!piece) throw new Error();
    piece.stack = applyEnchant(piece.stack, 'protection', 4);
    expect(protectionLevel(s)).toBe(4);
    const damageReduced = incomingDamage(20, s);
    expect(damageReduced).toBeLessThan(20);
  });

  it('leather is weaker than iron which is weaker than diamond (chestplates)', () => {
    const leather = incomingDamage(10, equip('chestplate', 'leather_chestplate'));
    const iron = incomingDamage(10, equip('chestplate', 'iron_chestplate'));
    const diamond = incomingDamage(10, equip('chestplate', 'diamond_chestplate'));
    expect(leather).toBeGreaterThan(iron);
    expect(iron).toBeGreaterThan(diamond);
  });
});

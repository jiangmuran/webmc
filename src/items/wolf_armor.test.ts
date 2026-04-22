import { describe, it, expect } from 'vitest';
import {
  craftWolfArmor,
  damageArmor,
  makeWolfArmor,
  repairArmor,
  WOLF_ARMOR_MAX_DURABILITY,
} from './wolf_armor';

describe('wolf armor', () => {
  it('crafts with 6 scutes', () => {
    expect(craftWolfArmor({ armadilloScutes: 6 })).not.toBeNull();
    expect(craftWolfArmor({ armadilloScutes: 5 })).toBeNull();
  });

  it('starts at max durability', () => {
    expect(makeWolfArmor().durability).toBe(WOLF_ARMOR_MAX_DURABILITY);
  });

  it('damage absorbs up to durability', () => {
    const a = makeWolfArmor();
    const r = damageArmor(a, 10);
    expect(r.absorbed).toBe(10);
    expect(r.broke).toBe(false);
    expect(r.overflowDamage).toBe(0);
    expect(a.durability).toBe(WOLF_ARMOR_MAX_DURABILITY - 10);
  });

  it('overflow damages wolf when armor breaks', () => {
    const a = makeWolfArmor();
    const r = damageArmor(a, WOLF_ARMOR_MAX_DURABILITY + 5);
    expect(r.absorbed).toBe(WOLF_ARMOR_MAX_DURABILITY);
    expect(r.broke).toBe(true);
    expect(r.overflowDamage).toBe(5);
  });

  it('repair consumes scutes until full', () => {
    const a = makeWolfArmor();
    damageArmor(a, WOLF_ARMOR_MAX_DURABILITY);
    const used = repairArmor(a, 10);
    expect(used).toBe(4); // 4 * 16 = 64
    expect(a.durability).toBe(WOLF_ARMOR_MAX_DURABILITY);
  });

  it('no repair when already full', () => {
    const a = makeWolfArmor();
    expect(repairArmor(a, 5)).toBe(0);
  });
});

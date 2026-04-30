import { describe, it, expect } from 'vitest';
import {
  rollNextScuteCooldown,
  brushYieldsScute,
  wolfArmoredDamage,
  SCUTE_DROP_MIN_TICKS,
  SCUTE_DROP_MAX_TICKS,
  WOLF_ARMOR_MAX_DURABILITY,
} from './armadillo_scute_drop';

describe('armadillo scute drop', () => {
  it('cooldown in range', () => {
    for (let i = 0; i < 50; i++) {
      const c = rollNextScuteCooldown(Math.random);
      expect(c).toBeGreaterThanOrEqual(SCUTE_DROP_MIN_TICKS);
      expect(c).toBeLessThanOrEqual(SCUTE_DROP_MAX_TICKS);
    }
  });

  it('brush only after cooldown', () => {
    expect(brushYieldsScute(0)).toBe(false);
    expect(brushYieldsScute(SCUTE_DROP_MIN_TICKS)).toBe(true);
  });

  it('wolf armor absorbs 100% damage with durability (wiki: full absorption)', () => {
    const r = wolfArmoredDamage({ raw: 10, armorDurabilityLeft: 64 });
    expect(r.damage).toBe(0);
    expect(r.armorDurabilityLeft).toBe(63);
  });

  it('wolf armor max durability 64 (wiki Wolf_Armor infobox)', () => {
    expect(WOLF_ARMOR_MAX_DURABILITY).toBe(64);
  });

  it('wolf armor passes magic damage through (wiki: magic exception)', () => {
    const r = wolfArmoredDamage({ raw: 10, isMagicDamage: true, armorDurabilityLeft: 64 });
    expect(r.damage).toBe(10);
    expect(r.armorDurabilityLeft).toBe(64);
  });

  it('broken wolf armor stops absorbing', () => {
    const r = wolfArmoredDamage({ raw: 10, armorDurabilityLeft: 0 });
    expect(r.damage).toBe(10);
  });
});

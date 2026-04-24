import { describe, it, expect } from 'vitest';
import {
  isBroken,
  damageChancePassUnbreaking,
  applyDamage,
  durabilityPercent,
  type DamageableItem,
} from './tool_durability_damage';

const pickaxe: DamageableItem = {
  id: 'iron_pickaxe',
  maxDurability: 250,
  damage: 0,
  unbreakingLevel: 0,
};

describe('tool durability damage', () => {
  it('not broken new', () => {
    expect(isBroken(pickaxe)).toBe(false);
  });

  it('broken at max', () => {
    expect(isBroken({ ...pickaxe, damage: 250 })).toBe(true);
  });

  it('unbreaking 0 always damages', () => {
    expect(damageChancePassUnbreaking(0, () => 0.99)).toBe(true);
  });

  it('unbreaking 3 reduces', () => {
    const tests = Array.from({ length: 100 }, (_, i) =>
      damageChancePassUnbreaking(3, () => i / 100),
    );
    expect(tests.filter((t) => t).length).toBeLessThan(50);
  });

  it('applyDamage increments', () => {
    expect(applyDamage(pickaxe, 1, () => 0).damage).toBe(1);
  });

  it('durability starts at 100%', () => {
    expect(durabilityPercent(pickaxe)).toBe(1);
  });

  it('damage caps at max', () => {
    expect(applyDamage({ ...pickaxe, damage: 249 }, 10, () => 0).damage).toBe(250);
  });
});

import { describe, it, expect } from 'vitest';
import {
  ELYTRA_MAX_DURABILITY,
  ELYTRA_REPAIR_PER_MEMBRANE,
  repairElytra,
  rollMembraneDrop,
} from './phantom_membrane';

describe('phantom membrane', () => {
  it('drops 0-1 base, +looting bonus', () => {
    let drops = 0;
    for (let i = 0; i < 1000; i++) {
      drops += rollMembraneDrop({ lootingLevel: 0, rng: Math.random });
    }
    expect(drops).toBeGreaterThan(300);
    expect(drops).toBeLessThan(700);
  });

  it('looting adds bonus drops', () => {
    let withLoot = 0;
    let none = 0;
    for (let i = 0; i < 500; i++) {
      withLoot += rollMembraneDrop({ lootingLevel: 3, rng: Math.random });
      none += rollMembraneDrop({ lootingLevel: 0, rng: Math.random });
    }
    expect(withLoot).toBeGreaterThan(none);
  });

  it('elytra repairs 108 per membrane', () => {
    const r = repairElytra({ currentDamage: 300, membraneCount: 2 });
    expect(r.membranesConsumed).toBe(2);
    expect(r.newDamage).toBe(300 - 2 * ELYTRA_REPAIR_PER_MEMBRANE);
  });

  it('fully-damaged elytra needs 4 membranes (432/108)', () => {
    const r = repairElytra({
      currentDamage: ELYTRA_MAX_DURABILITY,
      membraneCount: 5,
    });
    expect(r.membranesConsumed).toBe(4);
    expect(r.newDamage).toBe(0);
  });

  it('xp cost is 2 per membrane', () => {
    const r = repairElytra({ currentDamage: 300, membraneCount: 2 });
    expect(r.xpLevelCost).toBe(4);
  });
});

import { describe, it, expect } from 'vitest';
import { guaranteedTreasure, planBuriedTreasure, rollTreasureLoot } from './buried_treasure';

describe('buried treasure', () => {
  it('chest depth 1..3', () => {
    const t = planBuriedTreasure({ rng: () => 0.5 });
    expect(t.chestDepth).toBeGreaterThanOrEqual(1);
    expect(t.chestDepth).toBeLessThanOrEqual(3);
  });

  it('always has heart of the sea', () => {
    const g = guaranteedTreasure();
    expect(g[0]?.item).toBe('webmc:heart_of_the_sea');
  });

  it('weighted loot returns non-guaranteed entries', () => {
    const e = rollTreasureLoot(0.5);
    expect(e?.guaranteed).not.toBe(true);
  });

  it('low roll = iron_ingot', () => {
    const e = rollTreasureLoot(0.01);
    expect(e?.item).toBe('webmc:iron_ingot');
  });

  it('uses Java armor names + iron_sword (wiki)', () => {
    // Wiki (minecraft.wiki/w/Buried_Treasure) → Java loot table.
    // Old table used Bedrock 'leather_cap' / 'leather_tunic' and lacked
    // iron_sword.
    const ids = new Set<string>();
    for (let r = 0; r < 1; r += 0.001) {
      const e = rollTreasureLoot(r);
      if (e) ids.add(e.item);
    }
    expect(ids.has('webmc:leather_helmet')).toBe(true);
    expect(ids.has('webmc:leather_chestplate')).toBe(true);
    expect(ids.has('webmc:iron_sword')).toBe(true);
    expect(ids.has('webmc:leather_cap')).toBe(false);
    expect(ids.has('webmc:leather_tunic')).toBe(false);
  });
});

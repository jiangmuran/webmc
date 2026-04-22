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
});

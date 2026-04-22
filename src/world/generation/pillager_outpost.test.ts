import { describe, it, expect } from 'vitest';
import {
  canSpawnOutpost,
  MIN_VILLAGE_DISTANCE_CHUNKS,
  outpostLayout,
  rollOutpostLoot,
} from './pillager_outpost';

describe('pillager outpost', () => {
  it('has 1 captain and 5 pillagers', () => {
    const l = outpostLayout();
    expect(l.captainCount).toBe(1);
    expect(l.pillagerCount).toBe(5);
  });

  it('has roof chest', () => {
    expect(outpostLayout().roofChest).toBe(true);
  });

  it('loot table rolls valid items', () => {
    const r = rollOutpostLoot(0.001);
    expect(r?.item).toBe('webmc:crossbow');
  });

  it('loot at high roll still returns something', () => {
    expect(rollOutpostLoot(0.999)).not.toBeNull();
  });

  it('no village = can spawn', () => {
    expect(canSpawnOutpost({ cx: 0, cz: 0 }, null)).toBe(true);
  });

  it('nearby village blocks outpost', () => {
    expect(canSpawnOutpost({ cx: 2, cz: 2 }, { cx: 0, cz: 0 })).toBe(false);
  });

  it('far village allows outpost', () => {
    expect(canSpawnOutpost({ cx: 20, cz: 20 }, { cx: 0, cz: 0 })).toBe(true);
  });

  it('MIN distance is 10 chunks', () => {
    expect(MIN_VILLAGE_DISTANCE_CHUNKS).toBe(10);
  });
});

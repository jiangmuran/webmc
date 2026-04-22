import { describe, it, expect } from 'vitest';
import {
  ENDERMITE_MAX_HEALTH,
  isHuntedBy,
  makeEndermite,
  PEARL_ENDERMITE_CHANCE,
  shouldSpawnFromPearl,
  tickEndermite,
} from './endermite';

describe('endermite', () => {
  it('starts at 8 HP', () => {
    expect(makeEndermite(1, { x: 0, y: 0, z: 0 }).health).toBe(ENDERMITE_MAX_HEALTH);
  });

  it('despawns after 120s', () => {
    const e = makeEndermite(1, { x: 0, y: 0, z: 0 });
    const r = tickEndermite(e, 121);
    expect(r.despawned).toBe(true);
  });

  it('pearl 5% chance', () => {
    expect(PEARL_ENDERMITE_CHANCE).toBe(0.05);
    expect(shouldSpawnFromPearl(0.01)).toBe(true);
    expect(shouldSpawnFromPearl(0.1)).toBe(false);
  });

  it('nearby enderman hunts', () => {
    expect(isHuntedBy({ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 })).toBe(true);
  });

  it('far enderman ignores', () => {
    expect(isHuntedBy({ x: 0, y: 0, z: 0 }, { x: 100, y: 0, z: 0 })).toBe(false);
  });
});

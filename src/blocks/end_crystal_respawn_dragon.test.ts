import { describe, it, expect } from 'vitest';
import {
  respawnPatternValid,
  endCrystalBasePositions,
  PILLAR_COUNT,
} from './end_crystal_respawn_dragon';

describe('end crystal respawn dragon', () => {
  it('needs 10 pillars', () => {
    expect(PILLAR_COUNT).toBe(10);
  });

  it('all covered → valid', () => {
    const p = Array.from({ length: 10 }, (_, i) => ({ x: i, z: 0 }));
    expect(respawnPatternValid(p, new Array(10).fill(true))).toBe(true);
  });

  it('missing one → invalid', () => {
    const p = Array.from({ length: 10 }, (_, i) => ({ x: i, z: 0 }));
    const c = new Array(10).fill(true);
    c[3] = false;
    expect(respawnPatternValid(p, c)).toBe(false);
  });

  it('wrong pillar count invalid', () => {
    expect(respawnPatternValid([], [])).toBe(false);
  });

  it('crystal bases around portal', () => {
    const p = endCrystalBasePositions(0, 0);
    expect(p).toHaveLength(4);
    expect(p).toContainEqual({ x: 3, z: 0 });
  });
});

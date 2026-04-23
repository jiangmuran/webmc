import { describe, it, expect } from 'vitest';
import { findSpawnPoint } from './spawn_point_search';

describe('spawn point search', () => {
  it('finds when suitable', () => {
    const p = findSpawnPoint({
      centerX: 0,
      centerZ: 0,
      radius: 4,
      isSuitable: () => true,
      rng: () => 0.5,
    });
    expect(p).toBeDefined();
  });

  it('fails when never suitable', () => {
    expect(
      findSpawnPoint({
        centerX: 0,
        centerZ: 0,
        radius: 4,
        isSuitable: () => false,
        rng: () => 0.5,
      }),
    ).toBeUndefined();
  });

  it('within radius', () => {
    const p = findSpawnPoint({
      centerX: 100,
      centerZ: 200,
      radius: 5,
      isSuitable: () => true,
      rng: () => 0.9,
    });
    expect(p).toBeDefined();
    expect(Math.abs((p?.x ?? 0) - 100)).toBeLessThanOrEqual(5);
    expect(Math.abs((p?.z ?? 0) - 200)).toBeLessThanOrEqual(5);
  });

  it('returns first match', () => {
    let calls = 0;
    const p = findSpawnPoint({
      centerX: 0,
      centerZ: 0,
      radius: 10,
      isSuitable: () => {
        calls++;
        return calls >= 3;
      },
      rng: () => 0.5,
    });
    expect(p).toBeDefined();
  });
});

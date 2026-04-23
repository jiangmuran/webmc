import { describe, it, expect } from 'vitest';
import { mobSpawnAllowed, surfaceBlock, huge_mushroom_count } from './mushroom_island';

describe('mushroom island', () => {
  it('mooshroom allowed', () => {
    expect(mobSpawnAllowed('mooshroom')).toBe(true);
  });

  it('zombie not allowed', () => {
    expect(mobSpawnAllowed('zombie')).toBe(false);
  });

  it('mycelium above sea', () => {
    expect(surfaceBlock(65, 63)).toBe('mycelium');
    expect(surfaceBlock(50, 63)).toBe('dirt');
  });

  it('huge count 2-4', () => {
    const n = huge_mushroom_count(() => 0.5);
    expect(n).toBeGreaterThanOrEqual(2);
    expect(n).toBeLessThanOrEqual(4);
  });
});

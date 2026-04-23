import { describe, it, expect } from 'vitest';
import { isSlimeChunk, canSpawnSlimeHere, SLIME_UNDERGROUND_MAX_Y } from './slime_chunk_check';

describe('slime chunk check', () => {
  it('deterministic', () => {
    expect(isSlimeChunk(42, 1, 2)).toBe(isSlimeChunk(42, 1, 2));
  });

  it('~10% rate across chunks', () => {
    let count = 0;
    for (let x = 0; x < 100; x++) for (let z = 0; z < 100; z++) if (isSlimeChunk(1, x, z)) count++;
    expect(count).toBeGreaterThan(300);
    expect(count).toBeLessThan(2000);
  });

  it('swamp night full moon', () => {
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 1)).toBe(true);
  });

  it('swamp new moon blocks', () => {
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0)).toBe(false);
  });

  it('underground slime chunk', () => {
    // pick a chunk hash-confirmed to be slime
    let found = false;
    for (let x = 0; x < 20; x++) {
      if (isSlimeChunk(1, x, 0)) {
        found = canSpawnSlimeHere(1, x, 0, 30, 'plains', false, 0);
        if (found) break;
      }
    }
    expect(found).toBe(true);
  });

  it('y threshold', () => {
    expect(SLIME_UNDERGROUND_MAX_Y).toBe(40);
  });
});

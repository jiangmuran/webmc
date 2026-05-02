import { describe, it, expect } from 'vitest';
import {
  isSlimeChunk,
  canSpawnSlimeHere,
  SLIME_UNDERGROUND_MAX_Y,
  SWAMP_SLIME_MIN_Y,
  SWAMP_SLIME_MAX_Y,
} from './slime_chunk_check';

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

  it('swamp night full moon (wiki: brightness=1 always passes)', () => {
    // rand=anything < 1 always passes
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 1, () => 0.99)).toBe(true);
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 1, () => 0)).toBe(true);
  });

  it('swamp new moon blocks (wiki: brightness=0 always fails)', () => {
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0, () => 0)).toBe(false);
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0, () => 0.99)).toBe(false);
  });

  it('swamp gibbous (0.75) passes ~75% (wiki rand-vs-brightness)', () => {
    // rand=0.5 < 0.75 → pass; rand=0.8 > 0.75 → fail.
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0.75, () => 0.5)).toBe(true);
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0.75, () => 0.8)).toBe(false);
  });

  it('swamp crescent (0.25) passes ~25% (wiki rand-vs-brightness)', () => {
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0.25, () => 0.1)).toBe(true);
    expect(canSpawnSlimeHere(1, 0, 0, 60, 'swamp', true, 0.25, () => 0.5)).toBe(false);
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

  it('swamp y range is 51..69 inclusive per wiki, sibling-aligned', () => {
    // minecraft.wiki/w/Slime: swamp slime altitudes are Y=51..Y=69
    // inclusive. Sibling slime_spawn_chunks.ts uses the same bounds.
    expect(SWAMP_SLIME_MIN_Y).toBe(51);
    expect(SWAMP_SLIME_MAX_Y).toBe(69);
    expect(canSpawnSlimeHere(1, 0, 0, 51, 'swamp', true, 1, () => 0.5)).toBe(true);
    expect(canSpawnSlimeHere(1, 0, 0, 69, 'swamp', true, 1, () => 0.5)).toBe(true);
    expect(canSpawnSlimeHere(1, 0, 0, 50, 'swamp', true, 1, () => 0.5)).toBe(false);
    expect(canSpawnSlimeHere(1, 0, 0, 70, 'swamp', true, 1, () => 0.5)).toBe(false);
  });
});

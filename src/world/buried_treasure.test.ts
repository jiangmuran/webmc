import { describe, it, expect } from 'vitest';
import {
  chunkHasTreasure,
  treasureForChunk,
  TREASURE_Y_MIN,
  TREASURE_Y_MAX,
} from './buried_treasure';

describe('buried treasure', () => {
  it('deterministic per chunk', () => {
    expect(chunkHasTreasure(10, 10, 42)).toBe(chunkHasTreasure(10, 10, 42));
  });

  it('rare (many chunks empty)', () => {
    let treasures = 0;
    for (let x = 0; x < 100; x++) if (chunkHasTreasure(x, 0, 1)) treasures++;
    expect(treasures).toBeLessThan(100);
  });

  it('treasure y in range', () => {
    const t = treasureForChunk(0, 0, 42);
    expect(t.y).toBeGreaterThanOrEqual(TREASURE_Y_MIN);
    expect(t.y).toBeLessThanOrEqual(TREASURE_Y_MAX);
  });

  it('heart of the sea always', () => {
    expect(treasureForChunk(0, 0, 42).hasHeartOfTheSea).toBe(true);
  });

  it('different chunks different', () => {
    const a = treasureForChunk(0, 0, 42);
    const b = treasureForChunk(1, 1, 42);
    expect(a).not.toEqual(b);
  });
});

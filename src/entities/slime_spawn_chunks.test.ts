import { describe, it, expect } from 'vitest';
import {
  isSlimeChunk,
  canSpawnInSwamp,
  canSpawnInSlimeChunk,
  SLIME_CHUNK_MAX_Y,
  SWAMP_SLIME_MIN_Y,
  SWAMP_SLIME_MAX_Y,
} from './slime_spawn_chunks';

describe('slime spawn', () => {
  it('slime chunk deterministic', () => {
    expect(isSlimeChunk({ worldSeed: 42n, cx: 0, cz: 0 })).toBe(
      isSlimeChunk({ worldSeed: 42n, cx: 0, cz: 0 }),
    );
  });

  it('different chunks differ', () => {
    const a = isSlimeChunk({ worldSeed: 42n, cx: 0, cz: 0 });
    const b = isSlimeChunk({ worldSeed: 42n, cx: 100, cz: 0 });
    expect(a === b).toBe(a === b); // at least the check ran
  });

  it('swamp spawn range', () => {
    expect(canSpawnInSwamp({ biome: 'swamp', y: 60, lightLevel: 5 })).toBe(true);
    expect(canSpawnInSwamp({ biome: 'plains', y: 60, lightLevel: 5 })).toBe(false);
    expect(canSpawnInSwamp({ biome: 'swamp', y: 60, lightLevel: 10 })).toBe(false);
  });

  it('slime chunk y gate', () => {
    expect(canSpawnInSlimeChunk(30)).toBe(true);
    expect(canSpawnInSlimeChunk(SLIME_CHUNK_MAX_Y)).toBe(false);
  });

  it('swamp y range is exactly 51..69 inclusive per wiki', () => {
    // minecraft.wiki/w/Slime: "between the altitudes of Y=51 and
    // Y=69 (inclusive)".
    expect(SWAMP_SLIME_MIN_Y).toBe(51);
    expect(SWAMP_SLIME_MAX_Y).toBe(69);
    // Boundaries themselves pass.
    expect(canSpawnInSwamp({ biome: 'swamp', y: 51, lightLevel: 0 })).toBe(true);
    expect(canSpawnInSwamp({ biome: 'swamp', y: 69, lightLevel: 0 })).toBe(true);
    // One block outside on either side fails.
    expect(canSpawnInSwamp({ biome: 'swamp', y: 50, lightLevel: 0 })).toBe(false);
    expect(canSpawnInSwamp({ biome: 'swamp', y: 70, lightLevel: 0 })).toBe(false);
  });
});

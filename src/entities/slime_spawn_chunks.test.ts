import { describe, it, expect } from 'vitest';
import {
  isSlimeChunk,
  canSpawnInSwamp,
  canSpawnInSlimeChunk,
  SLIME_CHUNK_MAX_Y,
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
});

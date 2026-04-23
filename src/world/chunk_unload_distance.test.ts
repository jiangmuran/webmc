import { describe, it, expect } from 'vitest';
import {
  chunkDistance,
  shouldUnload,
  shouldKeepLoaded,
  chunksInViewDistance,
} from './chunk_unload_distance';

describe('chunk unload distance', () => {
  it('chebyshev distance', () => {
    expect(
      chunkDistance({ chunkX: 3, chunkZ: 4, playerChunkX: 0, playerChunkZ: 0, viewDistance: 10 }),
    ).toBe(4);
  });

  it('in view kept', () => {
    expect(
      shouldKeepLoaded({
        chunkX: 5,
        chunkZ: 0,
        playerChunkX: 0,
        playerChunkZ: 0,
        viewDistance: 10,
      }),
    ).toBe(true);
  });

  it('unloads when past margin', () => {
    expect(
      shouldUnload(
        {
          chunkX: 20,
          chunkZ: 0,
          playerChunkX: 0,
          playerChunkZ: 0,
          viewDistance: 10,
        },
        2,
      ),
    ).toBe(true);
  });

  it('within margin keeps loaded', () => {
    expect(
      shouldUnload(
        {
          chunkX: 11,
          chunkZ: 0,
          playerChunkX: 0,
          playerChunkZ: 0,
          viewDistance: 10,
        },
        2,
      ),
    ).toBe(false);
  });

  it('chunks in VD formula', () => {
    expect(chunksInViewDistance(1)).toBe(9);
    expect(chunksInViewDistance(4)).toBe(81);
  });
});

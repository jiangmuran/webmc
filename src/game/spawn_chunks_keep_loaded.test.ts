import { describe, it, expect } from 'vitest';
import {
  isSpawnChunk,
  alwaysLoadedChunks,
  totalSpawnChunks,
  SPAWN_CHUNK_RADIUS,
} from './spawn_chunks_keep_loaded';

describe('spawn chunks always loaded', () => {
  it('spawn chunk itself', () => {
    expect(isSpawnChunk({ x: 0, z: 0 }, { x: 0, z: 0 })).toBe(true);
  });

  it('edge in range', () => {
    expect(isSpawnChunk({ x: SPAWN_CHUNK_RADIUS, z: SPAWN_CHUNK_RADIUS }, { x: 0, z: 0 })).toBe(
      true,
    );
  });

  it('outside range', () => {
    expect(isSpawnChunk({ x: SPAWN_CHUNK_RADIUS + 1, z: 0 }, { x: 0, z: 0 })).toBe(false);
  });

  it('count matches formula', () => {
    const side = SPAWN_CHUNK_RADIUS * 2 + 1;
    expect(totalSpawnChunks()).toBe(side * side);
  });

  it('always loaded count', () => {
    expect(alwaysLoadedChunks({ x: 0, z: 0 })).toHaveLength(totalSpawnChunks());
  });
});

import { describe, it, expect } from 'vitest';
import { makeEmptySnapshot, snapshotBytes, SUBCHUNK_SIZE, transferables } from './mesh_snapshot';

describe('mesh snapshot', () => {
  it('empty snapshot has expected byte layout', () => {
    const s = makeEmptySnapshot();
    expect(s.blockLight.byteLength).toBe(2048);
    expect(s.skyLight.byteLength).toBe(2048);
    expect(s.biomes.byteLength).toBe(64);
    for (const neighbor of [
      s.neighborNegX,
      s.neighborPosX,
      s.neighborNegY,
      s.neighborPosY,
      s.neighborNegZ,
      s.neighborPosZ,
    ]) {
      expect(neighbor.byteLength).toBe(SUBCHUNK_SIZE * SUBCHUNK_SIZE * 2);
    }
  });

  it('total byte size fits budget', () => {
    const s = makeEmptySnapshot();
    const bytes = snapshotBytes(s);
    // Rough budget: < 20 KB for an empty sub-chunk snapshot.
    expect(bytes).toBeLessThan(20 * 1024);
  });

  it('transferables lists all buffers', () => {
    const s = makeEmptySnapshot();
    expect(transferables(s).length).toBe(11);
  });
});

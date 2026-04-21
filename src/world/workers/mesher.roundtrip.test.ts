import { describe, it, expect } from 'vitest';
import { AIR, type BlockState, makeState } from '@/blocks/state';
import { SUBCHUNK_DIM, SubChunk } from '../SubChunk';
import { EMPTY_NEIGHBORS, meshSnapshot, meshSubChunk } from '../meshing/greedy';
import { serializePalette, snapshotFromBlob } from '../meshing/snapshot';

// The worker runs in a separate realm (MessagePort), which vitest can't easily
// instantiate without jsdom + node --experimental flags. Instead, test that the
// serialize → unpack → mesh path produces the same output as the direct mesher.
// The worker itself is then just a thin envelope over this verified path.

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);

const opaqueByState = (s: BlockState) => s !== AIR;
const colorByState = (s: BlockState): readonly [number, number, number] =>
  s === STONE ? [128, 128, 128] : s === DIRT ? [134, 96, 67] : [0, 0, 0];
const faceColorsByState = (s: BlockState) => {
  const c = colorByState(s);
  return { top: c, bottom: c, side: c };
};

describe('mesher serialize/deserialize round-trip', () => {
  function compareMeshes(sc: SubChunk): void {
    const direct = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });

    const blob = serializePalette(sc, opaqueByState, faceColorsByState);
    const snap = snapshotFromBlob(blob);
    const viaBlob = meshSnapshot(snap, EMPTY_NEIGHBORS);

    expect(viaBlob.quadCount).toBe(direct.quadCount);
    expect(viaBlob.positions.length).toBe(direct.positions.length);
    expect(Array.from(viaBlob.positions)).toEqual(Array.from(direct.positions));
    expect(Array.from(viaBlob.indices)).toEqual(Array.from(direct.indices));
    expect(Array.from(viaBlob.colors)).toEqual(Array.from(direct.colors));
    expect(Array.from(viaBlob.normals)).toEqual(Array.from(direct.normals));
  }

  it('empty subchunk round-trips', () => {
    compareMeshes(new SubChunk());
  });

  it('uniform subchunk round-trips', () => {
    compareMeshes(new SubChunk(STONE));
  });

  it('scattered subchunk round-trips', () => {
    const sc = new SubChunk();
    for (let i = 0; i < 50; i++) {
      const x = i % SUBCHUNK_DIM;
      const y = (i * 3) % SUBCHUNK_DIM;
      const z = (i * 7) % SUBCHUNK_DIM;
      sc.set(x, y, z, i % 2 === 0 ? STONE : DIRT);
    }
    compareMeshes(sc);
  });

  it('serializePalette bits and indices are consistent with SubChunk state', () => {
    const sc = new SubChunk();
    sc.set(0, 0, 0, STONE);
    const blob = serializePalette(sc, opaqueByState, faceColorsByState);
    expect(blob.bitsPerIndex).toBe(sc.bitsPerIndex);
    if (sc.indices === null) {
      expect(blob.indices).toBeNull();
    } else {
      if (!blob.indices) throw new Error('blob.indices missing');
      expect(Array.from(blob.indices)).toEqual(Array.from(sc.indices));
    }
    expect(blob.paletteOpaque.length).toBe(sc.palette.size);
    expect(blob.paletteColor.length).toBe(sc.palette.size * 9);
  });
});

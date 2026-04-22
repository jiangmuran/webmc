// Mesh snapshot — the serializable data a mesher worker needs to
// produce geometry for a sub-chunk. Kept small so transfer overhead
// over a Worker postMessage boundary stays low (1-2 ms typical on
// mid-range phones).

export const SUBCHUNK_SIZE = 16;

export interface MeshSnapshot {
  // Palette-compressed block ids: a small palette array + bit-packed
  // indices into it.
  palette: Uint32Array;
  indices: Uint32Array; // 4096 entries; bit-width derived from palette length
  bitsPerIndex: number;

  // Neighbor face samples: 6 × 16×16 arrays of ambient block ids used for
  // occlusion decisions at the subchunk boundary. Packed as Uint16Array
  // (256 entries each).
  neighborNegX: Uint16Array;
  neighborPosX: Uint16Array;
  neighborNegY: Uint16Array;
  neighborPosY: Uint16Array;
  neighborNegZ: Uint16Array;
  neighborPosZ: Uint16Array;

  // Block-light + sky-light, 4 bits per voxel packed into uint8.
  blockLight: Uint8Array; // 2048 bytes
  skyLight: Uint8Array; // 2048 bytes

  // Biome id per voxel (MC 1.18+ stores biomes at 4×4×4 granularity).
  biomes: Uint8Array; // 64 bytes
}

// Returns the total byte-size estimate for a snapshot. Useful for
// transfer budget enforcement.
export function snapshotBytes(s: MeshSnapshot): number {
  return (
    s.palette.byteLength +
    s.indices.byteLength +
    s.neighborNegX.byteLength +
    s.neighborPosX.byteLength +
    s.neighborNegY.byteLength +
    s.neighborPosY.byteLength +
    s.neighborNegZ.byteLength +
    s.neighborPosZ.byteLength +
    s.blockLight.byteLength +
    s.skyLight.byteLength +
    s.biomes.byteLength
  );
}

export function makeEmptySnapshot(): MeshSnapshot {
  return {
    palette: new Uint32Array([0]),
    indices: new Uint32Array(Math.ceil(SUBCHUNK_SIZE ** 3 / 32)),
    bitsPerIndex: 1,
    neighborNegX: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    neighborPosX: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    neighborNegY: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    neighborPosY: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    neighborNegZ: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    neighborPosZ: new Uint16Array(SUBCHUNK_SIZE * SUBCHUNK_SIZE),
    blockLight: new Uint8Array(2048),
    skyLight: new Uint8Array(2048),
    biomes: new Uint8Array(64),
  };
}

// Transferable helper: list the underlying buffers so Worker.postMessage
// can move ownership.
export function transferables(s: MeshSnapshot): Transferable[] {
  return [
    s.palette.buffer,
    s.indices.buffer,
    s.neighborNegX.buffer,
    s.neighborPosX.buffer,
    s.neighborNegY.buffer,
    s.neighborPosY.buffer,
    s.neighborNegZ.buffer,
    s.neighborPosZ.buffer,
    s.blockLight.buffer,
    s.skyLight.buffer,
    s.biomes.buffer,
  ];
}

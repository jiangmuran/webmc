import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, type SubChunk, SUBCHUNK_VOLUME, localIndex } from '../SubChunk';
import { type BitsPerIndex, readIndex } from '../packed-indices';

export interface Snapshot {
  readonly flatIdx: Uint16Array;
  readonly paletteOpaque: Uint8Array;
  readonly paletteColor: Uint8Array;
  readonly paletteSize: number;
}

export interface PaletteBlob {
  readonly paletteStates: Uint32Array;
  readonly paletteOpaque: Uint8Array;
  readonly paletteColor: Uint8Array;
  readonly bitsPerIndex: BitsPerIndex;
  readonly indices: Uint32Array | null;
}

export function snapshotSubChunk(
  self: SubChunk,
  isOpaque: (state: BlockState) => boolean,
  colorOf: (state: BlockState) => readonly [number, number, number],
): Snapshot {
  const palette = self.palette;
  const n = palette.size;
  const paletteOpaque = new Uint8Array(n);
  const paletteColor = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) {
    const state = palette.get(i);
    paletteOpaque[i] = isOpaque(state) ? 1 : 0;
    const c = colorOf(state);
    paletteColor[i * 3] = c[0];
    paletteColor[i * 3 + 1] = c[1];
    paletteColor[i * 3 + 2] = c[2];
  }

  const flatIdx = new Uint16Array(SUBCHUNK_VOLUME);
  for (let y = 0; y < SUBCHUNK_DIM; y++) {
    for (let z = 0; z < SUBCHUNK_DIM; z++) {
      for (let x = 0; x < SUBCHUNK_DIM; x++) {
        const state = self.get(x, y, z);
        const pIdx = palette.indexOf(state);
        flatIdx[localIndex(x, y, z)] = pIdx < 0 ? 0 : pIdx;
      }
    }
  }

  return { flatIdx, paletteOpaque, paletteColor, paletteSize: n };
}

export function serializePalette(
  self: SubChunk,
  isOpaque: (state: BlockState) => boolean,
  colorOf: (state: BlockState) => readonly [number, number, number],
): PaletteBlob {
  const palette = self.palette;
  const n = palette.size;
  const paletteStates = new Uint32Array(n);
  const paletteOpaque = new Uint8Array(n);
  const paletteColor = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) {
    const state = palette.get(i);
    paletteStates[i] = state >>> 0;
    paletteOpaque[i] = isOpaque(state) ? 1 : 0;
    const c = colorOf(state);
    paletteColor[i * 3] = c[0];
    paletteColor[i * 3 + 1] = c[1];
    paletteColor[i * 3 + 2] = c[2];
  }
  const indicesSrc = self.indices;
  const indices = indicesSrc ? new Uint32Array(indicesSrc) : null;
  return {
    paletteStates,
    paletteOpaque,
    paletteColor,
    bitsPerIndex: self.bitsPerIndex,
    indices,
  };
}

export function snapshotFromBlob(blob: PaletteBlob): Snapshot {
  const n = blob.paletteOpaque.length;
  const flatIdx = new Uint16Array(SUBCHUNK_VOLUME);
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    flatIdx[i] = readIndex(blob.indices, i, blob.bitsPerIndex);
  }
  return {
    flatIdx,
    paletteOpaque: blob.paletteOpaque,
    paletteColor: blob.paletteColor,
    paletteSize: n,
  };
}

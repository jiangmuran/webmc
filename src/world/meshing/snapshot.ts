import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, type SubChunk, SUBCHUNK_VOLUME, localIndex } from '../SubChunk';
import { type BitsPerIndex, readIndex } from '../packed-indices';

export type RGB = readonly [number, number, number];

export interface FaceColors {
  readonly top: RGB;
  readonly bottom: RGB;
  readonly side: RGB;
}

// paletteColor layout: 9 bytes per palette entry.
// Offsets: top[0..2], bottom[3..5], side[6..8].
export const COLOR_STRIDE = 9;
export const COLOR_OFFSET_TOP = 0;
export const COLOR_OFFSET_BOTTOM = 3;
export const COLOR_OFFSET_SIDE = 6;

export interface Snapshot {
  readonly flatIdx: Uint16Array;
  readonly paletteOpaque: Uint8Array;
  readonly paletteColor: Uint8Array;
  readonly paletteSize: number;
  readonly flatSkyLight: Uint8Array;
  readonly flatBlockLight: Uint8Array;
  /** Optional palette-indexed tile ids: [top, side, bottom] × paletteSize. */
  readonly paletteTile?: Uint16Array;
}

export const TILE_STRIDE = 3;
export const TILE_OFFSET_TOP = 0;
export const TILE_OFFSET_SIDE = 1;
export const TILE_OFFSET_BOTTOM = 2;

// Shared "fully sky-lit" / "no block light" defaults for snapshots that
// don't carry computed light yet (cold meshing, tests, perf bench). The
// greedy mesher only READS these arrays, so sharing one immutable copy
// across the whole process avoids a 4 KB allocation per call.
const DEFAULT_FLAT_SKY_LIGHT = new Uint8Array(SUBCHUNK_VOLUME).fill(15);
const DEFAULT_FLAT_BLOCK_LIGHT = new Uint8Array(SUBCHUNK_VOLUME);

export interface PaletteBlob {
  readonly paletteStates: Uint32Array;
  readonly paletteOpaque: Uint8Array;
  readonly paletteColor: Uint8Array;
  readonly bitsPerIndex: BitsPerIndex;
  readonly indices: Uint32Array | null;
}

function writeFaceColors(out: Uint8Array, at: number, colors: FaceColors): void {
  out[at + COLOR_OFFSET_TOP] = colors.top[0];
  out[at + COLOR_OFFSET_TOP + 1] = colors.top[1];
  out[at + COLOR_OFFSET_TOP + 2] = colors.top[2];
  out[at + COLOR_OFFSET_BOTTOM] = colors.bottom[0];
  out[at + COLOR_OFFSET_BOTTOM + 1] = colors.bottom[1];
  out[at + COLOR_OFFSET_BOTTOM + 2] = colors.bottom[2];
  out[at + COLOR_OFFSET_SIDE] = colors.side[0];
  out[at + COLOR_OFFSET_SIDE + 1] = colors.side[1];
  out[at + COLOR_OFFSET_SIDE + 2] = colors.side[2];
}

export function snapshotSubChunk(
  self: SubChunk,
  isOpaque: (state: BlockState) => boolean,
  faceColorsOf: (state: BlockState) => FaceColors,
  light?: { sky: Uint8Array; block: Uint8Array },
): Snapshot {
  const palette = self.palette;
  const n = palette.size;
  const paletteOpaque = new Uint8Array(n);
  const paletteColor = new Uint8Array(n * COLOR_STRIDE);
  for (let i = 0; i < n; i++) {
    const state = palette.get(i);
    paletteOpaque[i] = isOpaque(state) ? 1 : 0;
    writeFaceColors(paletteColor, i * COLOR_STRIDE, faceColorsOf(state));
  }

  const flatIdx = new Uint16Array(SUBCHUNK_VOLUME);
  for (let y = 0; y < SUBCHUNK_DIM; y++) {
    for (let z = 0; z < SUBCHUNK_DIM; z++) {
      for (let x = 0; x < SUBCHUNK_DIM; x++) {
        const state = self.get(x, y, z);
        const pIdx = palette.indexOf(state);
        if (pIdx < 0) {
          throw new Error(`snapshotSubChunk: state ${String(state)} not in palette`);
        }
        flatIdx[localIndex(x, y, z)] = pIdx;
      }
    }
  }

  const flatSkyLight = light?.sky ?? DEFAULT_FLAT_SKY_LIGHT;
  const flatBlockLight = light?.block ?? DEFAULT_FLAT_BLOCK_LIGHT;

  return { flatIdx, paletteOpaque, paletteColor, paletteSize: n, flatSkyLight, flatBlockLight };
}

export function serializePalette(
  self: SubChunk,
  isOpaque: (state: BlockState) => boolean,
  faceColorsOf: (state: BlockState) => FaceColors,
): PaletteBlob {
  const palette = self.palette;
  const n = palette.size;
  const paletteStates = new Uint32Array(n);
  const paletteOpaque = new Uint8Array(n);
  const paletteColor = new Uint8Array(n * COLOR_STRIDE);
  for (let i = 0; i < n; i++) {
    const state = palette.get(i);
    paletteStates[i] = state >>> 0;
    paletteOpaque[i] = isOpaque(state) ? 1 : 0;
    writeFaceColors(paletteColor, i * COLOR_STRIDE, faceColorsOf(state));
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

export function snapshotFromBlob(
  blob: PaletteBlob,
  light?: { sky: Uint8Array; block: Uint8Array },
): Snapshot {
  const n = blob.paletteOpaque.length;
  const flatIdx = new Uint16Array(SUBCHUNK_VOLUME);
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    const idx = readIndex(blob.indices, i, blob.bitsPerIndex);
    if (idx >= n) {
      throw new Error(`snapshotFromBlob: index ${String(idx)} out of palette range ${String(n)}`);
    }
    flatIdx[i] = idx;
  }
  const flatSkyLight = light?.sky ?? DEFAULT_FLAT_SKY_LIGHT;
  const flatBlockLight = light?.block ?? DEFAULT_FLAT_BLOCK_LIGHT;
  return {
    flatIdx,
    paletteOpaque: blob.paletteOpaque,
    paletteColor: blob.paletteColor,
    paletteSize: n,
    flatSkyLight,
    flatBlockLight,
  };
}

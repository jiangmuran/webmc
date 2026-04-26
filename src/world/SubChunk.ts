import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import { Palette } from './Palette';
import { type BitsPerIndex, allocIndices, readIndex, repack, writeIndex } from './packed-indices';

export const SUBCHUNK_DIM = 16;
export const SUBCHUNK_AREA = SUBCHUNK_DIM * SUBCHUNK_DIM;
export const SUBCHUNK_VOLUME = SUBCHUNK_AREA * SUBCHUNK_DIM;

export function localIndex(x: number, y: number, z: number): number {
  return (y << 8) | (z << 4) | x;
}

function assertLocal(x: number, y: number, z: number): void {
  if ((x | y | z) < 0 || x >= SUBCHUNK_DIM || y >= SUBCHUNK_DIM || z >= SUBCHUNK_DIM) {
    throw new RangeError(`SubChunk: local coord out of range (${x},${y},${z})`);
  }
}

export class SubChunk {
  private _palette: Palette;
  private _indices: Uint32Array | null;
  private _bits: BitsPerIndex;
  private _version = 0;
  private _nonAir = 0;

  constructor(fill: BlockState = AIR) {
    this._palette = new Palette([fill]);
    this._bits = this._palette.bitsPerIndex;
    this._indices = null;
    this._nonAir = fill === AIR ? 0 : SUBCHUNK_VOLUME;
  }

  get version(): number {
    return this._version;
  }

  get palette(): Palette {
    return this._palette;
  }

  get bitsPerIndex(): BitsPerIndex {
    return this._bits;
  }

  get indices(): Uint32Array | null {
    return this._indices;
  }

  get isUniform(): boolean {
    return this._bits === 0;
  }

  get nonAirCount(): number {
    return this._nonAir;
  }

  get(x: number, y: number, z: number): BlockState {
    assertLocal(x, y, z);
    const pIdx = readIndex(this._indices, localIndex(x, y, z), this._bits);
    return this._palette.get(pIdx);
  }

  set(x: number, y: number, z: number, state: BlockState): void {
    assertLocal(x, y, z);
    const pos = localIndex(x, y, z);
    const prevPIdx = readIndex(this._indices, pos, this._bits);
    const prevState = this._palette.get(prevPIdx);
    if (prevState === state) return;

    let newPIdx = this._palette.indexOf(state);
    if (newPIdx === -1) {
      newPIdx = this._palette.add(state);
      const requiredBits = this._palette.bitsPerIndex;
      if (requiredBits !== this._bits) {
        this._indices = repack(this._indices, SUBCHUNK_VOLUME, this._bits, requiredBits);
        this._bits = requiredBits;
      }
    }

    if (this._bits === 0) {
      this._bits = this._palette.bitsPerIndex;
      this._indices = allocIndices(SUBCHUNK_VOLUME, this._bits);
    }

    if (this._indices !== null) {
      writeIndex(this._indices, pos, this._bits, newPIdx);
    }

    if (prevState === AIR && state !== AIR) this._nonAir += 1;
    else if (prevState !== AIR && state === AIR) this._nonAir -= 1;

    this._version += 1;
  }

  fill(state: BlockState): void {
    this._palette = new Palette([state]);
    this._bits = 0;
    this._indices = null;
    this._nonAir = state === AIR ? 0 : SUBCHUNK_VOLUME;
    this._version += 1;
  }

  // Bulk-load from pre-computed palette + indices (used by chunk-codec
  // decode). Bypasses the per-cell sec.set() loop which paid palette
  // lookup + bit-pack write for every of 4096 cells. Direct assignment
  // is microseconds. Counts non-air for the inventory-stat tracking.
  static fromRaw(
    palette: BlockState[],
    bits: BitsPerIndex,
    indices: Uint32Array | null,
  ): SubChunk {
    const sc = new SubChunk(AIR);
    sc._palette = new Palette(palette);
    sc._bits = bits;
    sc._indices = indices;
    if (indices === null) {
      // Uniform — non-air count is full-volume if palette[0] != AIR.
      sc._nonAir = palette[0] !== AIR && palette[0] !== undefined ? SUBCHUNK_VOLUME : 0;
    } else {
      let n = 0;
      for (let pos = 0; pos < SUBCHUNK_VOLUME; pos++) {
        const idx = readIndex(indices, pos, bits);
        if ((palette[idx] ?? AIR) !== AIR) n++;
      }
      sc._nonAir = n;
    }
    return sc;
  }
}

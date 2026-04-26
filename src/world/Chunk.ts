import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import { SUBCHUNK_DIM, SubChunk } from './SubChunk';

export const CHUNK_SECTIONS = 24;
export const CHUNK_HEIGHT = CHUNK_SECTIONS * SUBCHUNK_DIM;
export const CHUNK_DIM = SUBCHUNK_DIM;

export function sectionOf(y: number): number {
  return y >>> 4;
}

export function localYOf(y: number): number {
  return y & 0xf;
}

function assertLocal(lx: number, y: number, lz: number): void {
  if ((lx | lz) < 0 || lx >= CHUNK_DIM || lz >= CHUNK_DIM) {
    throw new RangeError(`Chunk: horizontal coord out of range (${lx},${lz})`);
  }
  if (y < 0 || y >= CHUNK_HEIGHT) {
    throw new RangeError(`Chunk: y out of range (${y})`);
  }
}

export class Chunk {
  readonly cx: number;
  readonly cz: number;
  private readonly _sections: (SubChunk | null)[] = new Array<SubChunk | null>(CHUNK_SECTIONS).fill(
    null,
  );
  private readonly _meshDirty = new Set<number>();
  private _version = 0;

  constructor(cx: number, cz: number) {
    this.cx = cx;
    this.cz = cz;
  }

  get sections(): readonly (SubChunk | null)[] {
    return this._sections;
  }

  get meshDirty(): ReadonlySet<number> {
    return this._meshDirty;
  }

  get version(): number {
    return this._version;
  }

  section(cy: number): SubChunk | null {
    if (cy < 0 || cy >= CHUNK_SECTIONS) return null;
    return this._sections[cy] ?? null;
  }

  // Bulk-install a pre-built SubChunk. Used by chunk-save restore to
  // skip the per-cell palette + bitpack work — restoring a 4096-cell
  // section via .set() takes ~50ms because each call walks the palette
  // and rewrites the bit-packed indices. Direct swap-in is microseconds.
  setSection(cy: number, sc: SubChunk | null): void {
    if (cy < 0 || cy >= CHUNK_SECTIONS) {
      throw new RangeError(`Chunk: section index out of range (${cy})`);
    }
    this._sections[cy] = sc;
    this._meshDirty.add(cy);
    this._version += 1;
  }

  ensureSection(cy: number): SubChunk {
    if (cy < 0 || cy >= CHUNK_SECTIONS) {
      throw new RangeError(`Chunk: section index out of range (${cy})`);
    }
    const existing = this._sections[cy];
    if (existing) return existing;
    const sc = new SubChunk();
    this._sections[cy] = sc;
    return sc;
  }

  get(lx: number, y: number, lz: number): BlockState {
    assertLocal(lx, y, lz);
    const cy = sectionOf(y);
    const sc = this._sections[cy];
    if (!sc) return AIR;
    return sc.get(lx, localYOf(y), lz);
  }

  set(lx: number, y: number, lz: number, state: BlockState): void {
    assertLocal(lx, y, lz);
    const cy = sectionOf(y);
    const sc = state === AIR && !this._sections[cy] ? null : this.ensureSection(cy);
    if (!sc) return;
    const localY = localYOf(y);
    const prev = sc.get(lx, localY, lz);
    if (prev === state) return;
    sc.set(lx, localY, lz, state);
    this._meshDirty.add(cy);
    if (localY === 0 && cy > 0) this._meshDirty.add(cy - 1);
    if (localY === SUBCHUNK_DIM - 1 && cy < CHUNK_SECTIONS - 1) {
      this._meshDirty.add(cy + 1);
    }
    this._version += 1;
  }

  clearMeshDirty(cy?: number): void {
    if (cy === undefined) this._meshDirty.clear();
    else this._meshDirty.delete(cy);
  }

  markMeshDirty(cy: number): void {
    if (cy >= 0 && cy < CHUNK_SECTIONS) this._meshDirty.add(cy);
  }
}

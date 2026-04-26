import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import { CHUNK_DIM, CHUNK_HEIGHT, Chunk } from './Chunk';

export const CHUNK_DIM_LOG2 = 4;

export function chunkXOf(wx: number): number {
  return wx >> CHUNK_DIM_LOG2;
}

export function chunkZOf(wz: number): number {
  return wz >> CHUNK_DIM_LOG2;
}

export function localXOf(wx: number): number {
  return wx & (CHUNK_DIM - 1);
}

export function localZOf(wz: number): number {
  return wz & (CHUNK_DIM - 1);
}

// Pack two 16-bit signed coords into a 32-bit unsigned number. Was a
// template-literal string per Map lookup — World.has/getChunk/etc are
// hot in mob ticks and physics. The single-slot getChunk cache covers
// most hits, but cold lookups still allocated.
export function chunkKey(cx: number, cz: number): number {
  return ((cx + 32768) & 0xffff) * 65536 + ((cz + 32768) & 0xffff);
}

export class World {
  private readonly _chunks = new Map<number, Chunk>();
  // Set of chunks with at least one dirty mesh section. Maintained via
  // Chunk.onMeshDirty so the per-frame mesh flush iterates only
  // dirty chunks instead of every loaded one (was 576 iterations per
  // frame at 12-radius just to find dirty ones).
  private readonly _dirtyChunks = new Set<Chunk>();
  // Single-slot last-accessed cache. ~95% of consecutive get/set
  // calls hit the same chunk (mob AABB sweep, particle physics,
  // raycasts), and the Map<string,Chunk> lookup costs a string
  // allocation `${cx},${cz}` per call — pre-cache, that was ~600K
  // throwaway strings per second under normal load.
  private _cacheCx = Number.NaN;
  private _cacheCz = Number.NaN;
  private _cacheChunk: Chunk | null = null;

  get chunkCount(): number {
    return this._chunks.size;
  }

  chunks(): IterableIterator<Chunk> {
    return this._chunks.values();
  }

  has(cx: number, cz: number): boolean {
    return this._chunks.has(chunkKey(cx, cz));
  }

  getChunk(cx: number, cz: number): Chunk | null {
    if (cx === this._cacheCx && cz === this._cacheCz) return this._cacheChunk;
    const c = this._chunks.get(chunkKey(cx, cz)) ?? null;
    this._cacheCx = cx;
    this._cacheCz = cz;
    this._cacheChunk = c;
    return c;
  }

  ensureChunk(cx: number, cz: number): Chunk {
    const key = chunkKey(cx, cz);
    const existing = this._chunks.get(key);
    if (existing) return existing;
    const c = new Chunk(cx, cz);
    c.onMeshDirty = (chunk) => this._dirtyChunks.add(chunk);
    this._chunks.set(key, c);
    if (cx === this._cacheCx && cz === this._cacheCz) this._cacheChunk = c;
    return c;
  }

  removeChunk(cx: number, cz: number): boolean {
    if (cx === this._cacheCx && cz === this._cacheCz) {
      this._cacheChunk = null;
      this._cacheCx = Number.NaN;
      this._cacheCz = Number.NaN;
    }
    const key = chunkKey(cx, cz);
    const c = this._chunks.get(key);
    if (c) {
      this._dirtyChunks.delete(c);
      c.onMeshDirty = null;
    }
    return this._chunks.delete(key);
  }

  // Caller iterates this set + clears entries via clearDirty(chunk)
  // when the chunk's meshDirty becomes empty. Saves the per-frame
  // walk over all loaded chunks just to find ones with dirty sections.
  dirtyChunks(): IterableIterator<Chunk> {
    return this._dirtyChunks.values();
  }

  clearDirty(chunk: Chunk): void {
    this._dirtyChunks.delete(chunk);
  }

  get(wx: number, wy: number, wz: number): BlockState {
    if (wy < 0 || wy >= CHUNK_HEIGHT) return AIR;
    const chunk = this.getChunk(chunkXOf(wx), chunkZOf(wz));
    if (!chunk) return AIR;
    return chunk.get(localXOf(wx), wy, localZOf(wz));
  }

  set(wx: number, wy: number, wz: number, state: BlockState): void {
    if (wy < 0 || wy >= CHUNK_HEIGHT) {
      throw new RangeError(`World: y out of range (${wy.toString()})`);
    }
    const cx = chunkXOf(wx);
    const cz = chunkZOf(wz);
    const chunk = state === AIR && !this.has(cx, cz) ? null : this.ensureChunk(cx, cz);
    if (!chunk) return;
    chunk.set(localXOf(wx), wy, localZOf(wz), state);
  }
}

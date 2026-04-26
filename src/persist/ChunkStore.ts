import type { ChunkLight } from '@/world/lighting';
import type { Chunk } from '@/world/Chunk';
import type { PersistDB } from './db';
import { decodeChunk, encodeChunk } from './chunk-codec';
import type { ChunkBlob } from './types';

export interface ChunkStoreOptions {
  worldId: string;
  flushIntervalMs: number;
  flushBatch: number;
}

const DEFAULTS: Omit<ChunkStoreOptions, 'worldId'> = {
  flushIntervalMs: 1000,
  flushBatch: 32,
};

interface DirtyEntry {
  chunk: Chunk;
  light: ChunkLight | null;
}

export class ChunkStore {
  private readonly opts: ChunkStoreOptions;
  private readonly dirty = new Map<string, DirtyEntry>();
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private inFlight = false;

  constructor(
    private readonly db: PersistDB,
    opts: Partial<ChunkStoreOptions> & { worldId: string },
  ) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  key(cx: number, cz: number): string {
    return `${cx.toString()},${cz.toString()}`;
  }

  markDirty(chunk: Chunk, light: ChunkLight | null): void {
    this.dirty.set(this.key(chunk.cx, chunk.cz), { chunk, light });
  }

  async load(cx: number, cz: number): Promise<{ chunk: Chunk; light: ChunkLight | null } | null> {
    const blob = await this.db.getChunk(this.opts.worldId, cx, cz);
    if (!blob) return null;
    // Corrupt or future-version blob → return null so the loader
    // regenerates the chunk fresh, instead of crashing the world load.
    try {
      const decoded = decodeChunk(blob.payload);
      return { chunk: decoded.chunk, light: decoded.light };
    } catch (err) {
      console.warn(`[ChunkStore] failed to decode chunk (${cx}, ${cz}) — regenerating:`, err);
      return null;
    }
  }

  async flush(): Promise<number> {
    if (this.dirty.size === 0 || this.inFlight) return 0;
    this.inFlight = true;
    try {
      // Walk the dirty Map directly with a manual cap — Array.from + slice
      // allocated the full dirty list every flush even when only 32
      // would be written. With 500+ dirty chunks during heavy edits
      // (terraforming, explosions), that's a 500-entry array trashed
      // every second.
      const blobs: ChunkBlob[] = [];
      const cap = this.opts.flushBatch;
      for (const d of this.dirty.values()) {
        if (blobs.length >= cap) break;
        blobs.push({
          worldId: this.opts.worldId,
          cx: d.chunk.cx,
          cz: d.chunk.cz,
          payload: encodeChunk(d.chunk, d.light ?? undefined),
          version: d.chunk.version,
        });
      }
      await this.db.putChunks(blobs);
      // Only delete the dirty entry if the chunk's version hasn't moved
      // forward during the async putChunks. Otherwise edits made during
      // the await would be silently dropped — chunk would appear "clean"
      // until the next edit re-marks it. Vanilla doesn't have this race
      // because it serializes inside the world tick, but we await IDB.
      for (const b of blobs) {
        const k = this.key(b.cx, b.cz);
        if (this.dirty.get(k)?.chunk.version === b.version) this.dirty.delete(k);
      }
      return blobs.length;
    } finally {
      this.inFlight = false;
    }
  }

  startAutoFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.opts.flushIntervalMs);
  }

  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  get pendingCount(): number {
    return this.dirty.size;
  }

  get worldId(): string {
    return this.opts.worldId;
  }
}

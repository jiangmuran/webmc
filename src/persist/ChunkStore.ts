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
    const decoded = decodeChunk(blob.payload);
    return { chunk: decoded.chunk, light: decoded.light };
  }

  async flush(): Promise<number> {
    if (this.dirty.size === 0 || this.inFlight) return 0;
    this.inFlight = true;
    try {
      const toWrite = Array.from(this.dirty.values()).slice(0, this.opts.flushBatch);
      const blobs: ChunkBlob[] = toWrite.map((d) => ({
        worldId: this.opts.worldId,
        cx: d.chunk.cx,
        cz: d.chunk.cz,
        payload: encodeChunk(d.chunk, d.light ?? undefined),
        version: d.chunk.version,
      }));
      await this.db.putChunks(blobs);
      for (const b of blobs) this.dirty.delete(this.key(b.cx, b.cz));
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

import type { PersistDB } from './db';
import {
  type ChunkBlob,
  type ChunkKey,
  type PlayerState,
  type WorldMeta,
  chunkKeyOf,
} from './types';

function chunkKeyString(k: ChunkKey): string {
  return `${k[0]}|${k[1].toString()}|${k[2].toString()}`;
}

export class InMemoryPersistDB implements PersistDB {
  private worlds = new Map<string, WorldMeta>();
  private chunks = new Map<string, ChunkBlob>();
  private players = new Map<string, PlayerState>();
  private meta = new Map<string, unknown>();

  listWorlds(): Promise<WorldMeta[]> {
    return Promise.resolve(Array.from(this.worlds.values()));
  }

  getWorld(id: string): Promise<WorldMeta | null> {
    return Promise.resolve(this.worlds.get(id) ?? null);
  }

  putWorld(w: WorldMeta): Promise<void> {
    this.worlds.set(w.id, w);
    return Promise.resolve();
  }

  deleteWorld(id: string): Promise<void> {
    this.worlds.delete(id);
    this.players.delete(id);
    for (const k of Array.from(this.chunks.keys())) {
      if (k.startsWith(`${id}|`)) this.chunks.delete(k);
    }
    return Promise.resolve();
  }

  getChunk(worldId: string, cx: number, cz: number): Promise<ChunkBlob | null> {
    return Promise.resolve(this.chunks.get(chunkKeyString([worldId, cx, cz])) ?? null);
  }

  putChunk(chunk: ChunkBlob): Promise<void> {
    this.chunks.set(chunkKeyString(chunkKeyOf(chunk)), chunk);
    return Promise.resolve();
  }

  putChunks(chunks: readonly ChunkBlob[]): Promise<void> {
    for (const c of chunks) this.chunks.set(chunkKeyString(chunkKeyOf(c)), c);
    return Promise.resolve();
  }

  deleteChunksByWorld(worldId: string): Promise<number> {
    let count = 0;
    for (const k of Array.from(this.chunks.keys())) {
      if (k.startsWith(`${worldId}|`)) {
        this.chunks.delete(k);
        count++;
      }
    }
    return Promise.resolve(count);
  }

  getPlayer(worldId: string): Promise<PlayerState | null> {
    return Promise.resolve(this.players.get(worldId) ?? null);
  }

  putPlayer(player: PlayerState): Promise<void> {
    this.players.set(player.worldId, player);
    return Promise.resolve();
  }

  getMeta(key: string): Promise<unknown> {
    return Promise.resolve(this.meta.get(key) ?? null);
  }

  setMeta(key: string, value: unknown): Promise<void> {
    this.meta.set(key, value);
    return Promise.resolve();
  }

  setMetas(entries: readonly { key: string; value: unknown }[]): Promise<void> {
    for (const e of entries) this.meta.set(e.key, e.value);
    return Promise.resolve();
  }

  close(): void {
    // no-op
  }
}

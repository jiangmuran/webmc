import { describe, it, expect } from 'vitest';
import { makeState } from '@/blocks/state';
import { Chunk } from '@/world/Chunk';
import { ChunkStore } from './ChunkStore';
import { InMemoryPersistDB } from './memory-db';

const STONE = makeState(1, 0);

describe('ChunkStore', () => {
  it('flushes dirty chunks into the DB', async () => {
    const db = new InMemoryPersistDB();
    const store = new ChunkStore(db, { worldId: 'w1' });
    const c = new Chunk(3, -2);
    c.set(0, 40, 0, STONE);
    store.markDirty(c, null);
    expect(store.pendingCount).toBe(1);
    const count = await store.flush();
    expect(count).toBe(1);
    expect(store.pendingCount).toBe(0);
    const blob = await db.getChunk('w1', 3, -2);
    expect(blob).not.toBeNull();
  });

  it('load round-trips via codec', async () => {
    const db = new InMemoryPersistDB();
    const store = new ChunkStore(db, { worldId: 'w1' });
    const c = new Chunk(5, 7);
    c.set(1, 50, 2, STONE);
    store.markDirty(c, null);
    await store.flush();
    const loaded = await store.load(5, 7);
    expect(loaded).not.toBeNull();
    expect(loaded?.chunk.get(1, 50, 2)).toBe(STONE);
  });

  it('respects flushBatch cap across multiple flush calls', async () => {
    const db = new InMemoryPersistDB();
    const store = new ChunkStore(db, { worldId: 'w1', flushBatch: 2 });
    for (let i = 0; i < 5; i++) {
      const c = new Chunk(i, 0);
      c.set(0, 30, 0, STONE);
      store.markDirty(c, null);
    }
    const first = await store.flush();
    expect(first).toBe(2);
    expect(store.pendingCount).toBe(3);
    const second = await store.flush();
    expect(second).toBe(2);
    const third = await store.flush();
    expect(third).toBe(1);
    expect(store.pendingCount).toBe(0);
  });

  it('load returns null for a missing chunk', async () => {
    const db = new InMemoryPersistDB();
    const store = new ChunkStore(db, { worldId: 'w1' });
    expect(await store.load(999, 999)).toBeNull();
  });
});

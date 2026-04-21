import { describe, it, expect } from 'vitest';
import { InMemoryPersistDB } from './memory-db';
import { CURRENT_SCHEMA_VERSION, type ChunkBlob, type WorldMeta } from './types';

function makeWorld(overrides: Partial<WorldMeta> = {}): WorldMeta {
  return {
    id: 'test-world',
    name: 'Test',
    seed: 1234,
    createdAt: 0,
    updatedAt: 0,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    spawn: { x: 0, y: 80, z: 0 },
    ...overrides,
  };
}

function makeChunk(worldId: string, cx: number, cz: number, bytes = 4): ChunkBlob {
  return {
    worldId,
    cx,
    cz,
    payload: new Uint8Array(bytes).fill(cx + cz),
    version: 1,
  };
}

describe('PersistDB contract (InMemory)', () => {
  it('worlds: round-trip put/get/list/delete', async () => {
    const db = new InMemoryPersistDB();
    expect(await db.listWorlds()).toEqual([]);
    const w = makeWorld({ id: 'a' });
    await db.putWorld(w);
    expect(await db.getWorld('a')).toEqual(w);
    expect(await db.listWorlds()).toHaveLength(1);
    await db.putWorld(makeWorld({ id: 'b', name: 'B' }));
    expect((await db.listWorlds()).map((x) => x.id).sort()).toEqual(['a', 'b']);
    await db.deleteWorld('a');
    expect(await db.getWorld('a')).toBeNull();
    expect(await db.listWorlds()).toHaveLength(1);
  });

  it('chunks: put/get by composite key', async () => {
    const db = new InMemoryPersistDB();
    const c = makeChunk('w1', 3, -2);
    await db.putChunk(c);
    const got = await db.getChunk('w1', 3, -2);
    expect(got).not.toBeNull();
    expect(got?.payload.length).toBe(4);
    expect(await db.getChunk('w1', 3, 0)).toBeNull();
  });

  it('chunks: batch put respects all keys', async () => {
    const db = new InMemoryPersistDB();
    const batch: ChunkBlob[] = [
      makeChunk('w1', 0, 0),
      makeChunk('w1', 1, 0),
      makeChunk('w1', 0, 1),
      makeChunk('w2', 0, 0),
    ];
    await db.putChunks(batch);
    expect(await db.getChunk('w1', 0, 0)).not.toBeNull();
    expect(await db.getChunk('w1', 1, 0)).not.toBeNull();
    expect(await db.getChunk('w2', 0, 0)).not.toBeNull();
  });

  it('deleteWorld also drops the chunks and player for that world', async () => {
    const db = new InMemoryPersistDB();
    await db.putWorld(makeWorld({ id: 'w1' }));
    await db.putWorld(makeWorld({ id: 'w2' }));
    await db.putChunks([makeChunk('w1', 0, 0), makeChunk('w1', 1, 0), makeChunk('w2', 0, 0)]);
    await db.putPlayer({
      worldId: 'w1',
      position: { x: 0, y: 0, z: 0 },
      yaw: 0,
      pitch: 0,
      hotbarSlots: [],
      selectedSlot: 0,
      updatedAt: 0,
    });
    await db.deleteWorld('w1');
    expect(await db.getWorld('w1')).toBeNull();
    expect(await db.getPlayer('w1')).toBeNull();
    expect(await db.getChunk('w1', 0, 0)).toBeNull();
    expect(await db.getChunk('w2', 0, 0)).not.toBeNull();
  });

  it('deleteChunksByWorld returns the count and leaves other worlds intact', async () => {
    const db = new InMemoryPersistDB();
    await db.putChunks([
      makeChunk('a', 0, 0),
      makeChunk('a', 1, 0),
      makeChunk('a', 0, 1),
      makeChunk('b', 0, 0),
    ]);
    const deleted = await db.deleteChunksByWorld('a');
    expect(deleted).toBe(3);
    expect(await db.getChunk('a', 0, 0)).toBeNull();
    expect(await db.getChunk('b', 0, 0)).not.toBeNull();
  });

  it('player: round-trip', async () => {
    const db = new InMemoryPersistDB();
    expect(await db.getPlayer('w1')).toBeNull();
    await db.putPlayer({
      worldId: 'w1',
      position: { x: 5, y: 65, z: -2 },
      yaw: 1.2,
      pitch: -0.3,
      hotbarSlots: [1, 2, 3],
      selectedSlot: 0,
      updatedAt: 123,
    });
    const p = await db.getPlayer('w1');
    expect(p?.position.x).toBe(5);
    expect(p?.hotbarSlots).toEqual([1, 2, 3]);
  });

  it('meta: typed kv round-trip', async () => {
    const db = new InMemoryPersistDB();
    await db.setMeta('lastPlayedWorldId', 'abc');
    expect(await db.getMeta('lastPlayedWorldId')).toBe('abc');
    await db.setMeta('schema', { v: 1 });
    expect(await db.getMeta('schema')).toEqual({ v: 1 });
    expect(await db.getMeta('missing')).toBeNull();
  });
});

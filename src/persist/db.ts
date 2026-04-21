import type { ChunkBlob, PlayerState, WorldMeta } from './types';

export interface PersistDB {
  listWorlds(): Promise<WorldMeta[]>;
  getWorld(id: string): Promise<WorldMeta | null>;
  putWorld(w: WorldMeta): Promise<void>;
  deleteWorld(id: string): Promise<void>;

  getChunk(worldId: string, cx: number, cz: number): Promise<ChunkBlob | null>;
  putChunk(chunk: ChunkBlob): Promise<void>;
  putChunks(chunks: readonly ChunkBlob[]): Promise<void>;
  deleteChunksByWorld(worldId: string): Promise<number>;

  getPlayer(worldId: string): Promise<PlayerState | null>;
  putPlayer(player: PlayerState): Promise<void>;

  getMeta(key: string): Promise<unknown>;
  setMeta(key: string, value: unknown): Promise<void>;

  close(): void;
}

const DB_NAME = 'webmc';
const DB_VERSION = 1;

const WORLDS_STORE = 'worlds';
const CHUNKS_STORE = 'chunks';
const PLAYER_STORE = 'player';
const META_STORE = 'meta';

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = (): void => {
      resolve(req.result);
    };
    req.onerror = (): void => {
      reject(req.error ?? new Error('IDB request error'));
    };
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = (): void => {
      resolve();
    };
    tx.onerror = (): void => {
      reject(tx.error ?? new Error('IDB transaction error'));
    };
    tx.onabort = (): void => {
      reject(tx.error ?? new Error('IDB transaction aborted'));
    };
  });
}

export async function openIndexedDB(name = DB_NAME): Promise<IndexedDBPersistDB> {
  const req = indexedDB.open(name, DB_VERSION);
  req.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const db = req.result;
    const oldVersion = event.oldVersion;
    if (oldVersion < 1) {
      db.createObjectStore(WORLDS_STORE, { keyPath: 'id' });
      db.createObjectStore(CHUNKS_STORE, { keyPath: ['worldId', 'cx', 'cz'] });
      db.createObjectStore(PLAYER_STORE, { keyPath: 'worldId' });
      db.createObjectStore(META_STORE, { keyPath: 'k' });
    }
  };
  const db = await reqToPromise(req);
  return new IndexedDBPersistDB(db);
}

export class IndexedDBPersistDB implements PersistDB {
  constructor(private readonly db: IDBDatabase) {}

  async listWorlds(): Promise<WorldMeta[]> {
    const tx = this.db.transaction(WORLDS_STORE, 'readonly');
    const store = tx.objectStore(WORLDS_STORE);
    const all = await reqToPromise<WorldMeta[]>(store.getAll() as IDBRequest<WorldMeta[]>);
    await txDone(tx);
    return all;
  }

  async getWorld(id: string): Promise<WorldMeta | null> {
    const tx = this.db.transaction(WORLDS_STORE, 'readonly');
    const store = tx.objectStore(WORLDS_STORE);
    const val = await reqToPromise<WorldMeta | undefined>(
      store.get(id) as IDBRequest<WorldMeta | undefined>,
    );
    await txDone(tx);
    return val ?? null;
  }

  async putWorld(w: WorldMeta): Promise<void> {
    const tx = this.db.transaction(WORLDS_STORE, 'readwrite');
    tx.objectStore(WORLDS_STORE).put(w);
    await txDone(tx);
  }

  async deleteWorld(id: string): Promise<void> {
    const tx = this.db.transaction([WORLDS_STORE, CHUNKS_STORE, PLAYER_STORE], 'readwrite');
    tx.objectStore(WORLDS_STORE).delete(id);
    tx.objectStore(PLAYER_STORE).delete(id);
    const chunks = tx.objectStore(CHUNKS_STORE);
    const range = IDBKeyRange.bound([id, -Infinity, -Infinity], [id, Infinity, Infinity]);
    const cursorReq = chunks.openCursor(range);
    await new Promise<void>((resolve, reject) => {
      cursorReq.onsuccess = (): void => {
        const cursor = cursorReq.result;
        if (!cursor) {
          resolve();
          return;
        }
        cursor.delete();
        cursor.continue();
      };
      cursorReq.onerror = (): void => {
        reject(cursorReq.error ?? new Error('cursor error'));
      };
    });
    await txDone(tx);
  }

  async getChunk(worldId: string, cx: number, cz: number): Promise<ChunkBlob | null> {
    const tx = this.db.transaction(CHUNKS_STORE, 'readonly');
    const val = await reqToPromise<ChunkBlob | undefined>(
      tx.objectStore(CHUNKS_STORE).get([worldId, cx, cz]) as IDBRequest<ChunkBlob | undefined>,
    );
    await txDone(tx);
    return val ?? null;
  }

  async putChunk(chunk: ChunkBlob): Promise<void> {
    const tx = this.db.transaction(CHUNKS_STORE, 'readwrite');
    tx.objectStore(CHUNKS_STORE).put(chunk);
    await txDone(tx);
  }

  async putChunks(chunks: readonly ChunkBlob[]): Promise<void> {
    if (chunks.length === 0) return;
    const tx = this.db.transaction(CHUNKS_STORE, 'readwrite');
    const store = tx.objectStore(CHUNKS_STORE);
    for (const c of chunks) store.put(c);
    await txDone(tx);
  }

  async deleteChunksByWorld(worldId: string): Promise<number> {
    const tx = this.db.transaction(CHUNKS_STORE, 'readwrite');
    const store = tx.objectStore(CHUNKS_STORE);
    const range = IDBKeyRange.bound([worldId, -Infinity, -Infinity], [worldId, Infinity, Infinity]);
    let count = 0;
    const cursorReq = store.openCursor(range);
    await new Promise<void>((resolve, reject) => {
      cursorReq.onsuccess = (): void => {
        const cursor = cursorReq.result;
        if (!cursor) {
          resolve();
          return;
        }
        cursor.delete();
        count++;
        cursor.continue();
      };
      cursorReq.onerror = (): void => {
        reject(cursorReq.error ?? new Error('cursor error'));
      };
    });
    await txDone(tx);
    return count;
  }

  async getPlayer(worldId: string): Promise<PlayerState | null> {
    const tx = this.db.transaction(PLAYER_STORE, 'readonly');
    const val = await reqToPromise<PlayerState | undefined>(
      tx.objectStore(PLAYER_STORE).get(worldId) as IDBRequest<PlayerState | undefined>,
    );
    await txDone(tx);
    return val ?? null;
  }

  async putPlayer(player: PlayerState): Promise<void> {
    const tx = this.db.transaction(PLAYER_STORE, 'readwrite');
    tx.objectStore(PLAYER_STORE).put(player);
    await txDone(tx);
  }

  async getMeta(key: string): Promise<unknown> {
    const tx = this.db.transaction(META_STORE, 'readonly');
    const val = await reqToPromise<{ k: string; v: unknown } | undefined>(
      tx.objectStore(META_STORE).get(key) as IDBRequest<{ k: string; v: unknown } | undefined>,
    );
    await txDone(tx);
    return val?.v ?? null;
  }

  async setMeta(key: string, value: unknown): Promise<void> {
    const tx = this.db.transaction(META_STORE, 'readwrite');
    tx.objectStore(META_STORE).put({ k: key, v: value });
    await txDone(tx);
  }

  close(): void {
    this.db.close();
  }
}

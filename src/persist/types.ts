export interface WorldMeta {
  id: string;
  name: string;
  seed: number;
  createdAt: number;
  updatedAt: number;
  schemaVersion: number;
  spawn: { x: number; y: number; z: number };
}

export interface ChunkBlob {
  worldId: string;
  cx: number;
  cz: number;
  payload: Uint8Array;
  version: number;
}

// Persisted by item NAME (not numeric id) so saves stay valid across
// registry-order changes between releases.
export interface PersistedItemStack {
  name: string;
  count: number;
  damage: number;
}

export interface PersistedInventory {
  hotbar: (PersistedItemStack | null)[];
  main: (PersistedItemStack | null)[];
  armor: (PersistedItemStack | null)[];
  offhand: PersistedItemStack | null;
  selectedHotbar: number;
}

export interface PlayerState {
  worldId: string;
  position: { x: number; y: number; z: number };
  yaw: number;
  pitch: number;
  hotbarSlots: number[];
  selectedSlot: number;
  updatedAt: number;
  // Optional: full inventory snapshot. Older saves without this field
  // restore an empty inventory (legacy hotbarSlots was never populated).
  inventory?: PersistedInventory;
}

export const CURRENT_SCHEMA_VERSION = 1;

export type ChunkKey = readonly [string, number, number];

export function chunkKeyOf(blob: { worldId: string; cx: number; cz: number }): ChunkKey {
  return [blob.worldId, blob.cx, blob.cz];
}

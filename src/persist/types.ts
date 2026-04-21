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

export interface PlayerState {
  worldId: string;
  position: { x: number; y: number; z: number };
  yaw: number;
  pitch: number;
  hotbarSlots: number[];
  selectedSlot: number;
  updatedAt: number;
}

export const CURRENT_SCHEMA_VERSION = 1;

export type ChunkKey = readonly [string, number, number];

export function chunkKeyOf(blob: { worldId: string; cx: number; cz: number }): ChunkKey {
  return [blob.worldId, blob.cx, blob.cz];
}

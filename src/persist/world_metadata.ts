// World metadata — the small blob at the root of every saved world.
// Tracks name, seed, created time, game rules, dimension list, player
// uuid → last position. Migrations land here first before loading the
// chunk store.

export const WORLD_META_VERSION = 2;

export interface WorldMetadataV2 {
  version: 2;
  name: string;
  seed: string; // string to preserve precision for 64-bit seeds
  createdAt: number;
  lastPlayedAt: number;
  totalPlaytimeSec: number;
  gamerules: Record<string, string>;
  dimensions: readonly string[];
  knownPlayers: readonly KnownPlayer[];
  spawnPoint: { dimension: string; x: number; y: number; z: number };
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export interface KnownPlayer {
  uuid: string;
  name: string;
  lastLoginAt: number;
}

export function freshWorld(name: string, seed: string, nowSec: number): WorldMetadataV2 {
  return {
    version: WORLD_META_VERSION,
    name,
    seed,
    createdAt: nowSec,
    lastPlayedAt: nowSec,
    totalPlaytimeSec: 0,
    gamerules: {
      keepInventory: 'false',
      doDaylightCycle: 'true',
      doFireTick: 'true',
      doMobSpawning: 'true',
      mobGriefing: 'true',
    },
    dimensions: ['overworld', 'nether', 'the_end'],
    knownPlayers: [],
    spawnPoint: { dimension: 'overworld', x: 0, y: 64, z: 0 },
    difficulty: 'normal',
  };
}

export function addKnownPlayer(
  meta: WorldMetadataV2,
  uuid: string,
  name: string,
  nowSec: number,
): WorldMetadataV2 {
  const existing = meta.knownPlayers.find((p) => p.uuid === uuid);
  if (existing) {
    return {
      ...meta,
      knownPlayers: meta.knownPlayers.map((p) =>
        p.uuid === uuid ? { ...p, name, lastLoginAt: nowSec } : p,
      ),
    };
  }
  return {
    ...meta,
    knownPlayers: [...meta.knownPlayers, { uuid, name, lastLoginAt: nowSec }],
  };
}

export function setGamerule(meta: WorldMetadataV2, key: string, value: string): WorldMetadataV2 {
  return { ...meta, gamerules: { ...meta.gamerules, [key]: value } };
}

export function accumulatePlaytime(meta: WorldMetadataV2, sessionSec: number): WorldMetadataV2 {
  return { ...meta, totalPlaytimeSec: meta.totalPlaytimeSec + sessionSec };
}

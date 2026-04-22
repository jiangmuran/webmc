// Initial player spawn packet. When a player joins, the host sends a
// packet containing:
//   - entity id
//   - spawn position + yaw/pitch
//   - game seed (for procedural structures)
//   - current time of day
//   - active gamerules snapshot
//   - spawn chunk positions
//   - player list (for tab menu)

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerSpawnPacket {
  version: number;
  entityId: number;
  spawnPos: Vec3;
  yawRad: number;
  pitchRad: number;
  dimension: string;
  gameSeed: string;
  timeOfDay: number; // [0, 1)
  gamerules: Record<string, string>;
  spawnChunks: readonly { cx: number; cz: number }[];
  playerList: readonly { uuid: string; name: string }[];
}

export const SPAWN_PACKET_VERSION = 1;

export interface BuildQuery {
  entityId: number;
  spawnPos: Vec3;
  yawRad: number;
  pitchRad: number;
  dimension: string;
  gameSeed: string;
  timeOfDay: number;
  gamerules: Record<string, string>;
  spawnChunks: readonly { cx: number; cz: number }[];
  players: readonly { uuid: string; name: string }[];
}

export function buildPacket(q: BuildQuery): PlayerSpawnPacket {
  return {
    version: SPAWN_PACKET_VERSION,
    entityId: q.entityId,
    spawnPos: { ...q.spawnPos },
    yawRad: q.yawRad,
    pitchRad: q.pitchRad,
    dimension: q.dimension,
    gameSeed: q.gameSeed,
    timeOfDay: q.timeOfDay,
    gamerules: { ...q.gamerules },
    spawnChunks: q.spawnChunks.map((c) => ({ ...c })),
    playerList: q.players.map((p) => ({ ...p })),
  };
}

// Basic validation: versions match, coords finite, chunks non-empty.
export interface ValidateResult {
  valid: boolean;
  errors: readonly string[];
}

export function validatePacket(p: PlayerSpawnPacket): ValidateResult {
  const errors: string[] = [];
  if (p.version !== SPAWN_PACKET_VERSION) {
    errors.push(`version mismatch: ${p.version.toString()} vs ${SPAWN_PACKET_VERSION.toString()}`);
  }
  if (
    !Number.isFinite(p.spawnPos.x) ||
    !Number.isFinite(p.spawnPos.y) ||
    !Number.isFinite(p.spawnPos.z)
  ) {
    errors.push('non-finite spawn position');
  }
  if (p.spawnChunks.length === 0) errors.push('no spawn chunks');
  if (p.entityId <= 0) errors.push('bad entity id');
  return { valid: errors.length === 0, errors };
}

// Abbreviated network size estimate (bytes) for bandwidth budgeting.
export function estimatedBytes(p: PlayerSpawnPacket): number {
  let bytes = 40; // fixed header
  bytes += p.gameSeed.length * 2;
  bytes += Object.entries(p.gamerules).reduce((s, [k, v]) => s + k.length + v.length + 4, 0);
  bytes += p.spawnChunks.length * 8;
  bytes += p.playerList.reduce((s, pl) => s + pl.uuid.length + pl.name.length + 4, 0);
  return bytes;
}

// /spawnpoint command. Sets per-player spawn or world spawn.

export interface WorldSpawnState {
  worldSpawn: { x: number; y: number; z: number };
  perPlayerSpawns: Map<string, { x: number; y: number; z: number }>;
}

export function makeSpawnState(world: { x: number; y: number; z: number }): WorldSpawnState {
  return { worldSpawn: world, perPlayerSpawns: new Map() };
}

export type SpawnCmd =
  | { kind: 'set_world'; pos: { x: number; y: number; z: number } }
  | { kind: 'set_player'; playerId: string; pos: { x: number; y: number; z: number } }
  | { kind: 'clear_player'; playerId: string }
  | { kind: 'get_player'; playerId: string };

export type SpawnResult = { ok: true; message: string } | { ok: false; reason: string };

export function applySpawnCmd(s: WorldSpawnState, cmd: SpawnCmd): SpawnResult {
  if (cmd.kind === 'set_world') {
    s.worldSpawn = cmd.pos;
    return { ok: true, message: 'world spawn updated' };
  }
  if (cmd.kind === 'set_player') {
    s.perPlayerSpawns.set(cmd.playerId, cmd.pos);
    return { ok: true, message: `spawn set for ${cmd.playerId}` };
  }
  if (cmd.kind === 'clear_player') {
    if (!s.perPlayerSpawns.delete(cmd.playerId)) {
      return { ok: false, reason: 'no spawn set' };
    }
    return { ok: true, message: `cleared ${cmd.playerId}` };
  }
  const pos = s.perPlayerSpawns.get(cmd.playerId);
  if (!pos) return { ok: false, reason: 'not set' };
  return { ok: true, message: `${pos.x},${pos.y},${pos.z}` };
}

// Resolve: per-player > world.
export function resolveSpawn(
  s: WorldSpawnState,
  playerId: string,
): { x: number; y: number; z: number } {
  return s.perPlayerSpawns.get(playerId) ?? s.worldSpawn;
}

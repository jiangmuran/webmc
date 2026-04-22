// Respawn point priority. Order:
// 1. respawn anchor (nether) if charged and valid
// 2. bed (overworld) if bed is still present and unobstructed
// 3. world spawn point (overworld)
// Invalid bed (missing/obstructed) drops to #3 with a notice.

export type Dim = 'overworld' | 'nether' | 'end';

export interface RespawnSources {
  anchor: { dim: Dim; pos: { x: number; y: number; z: number }; charges: number } | null;
  bed: { dim: Dim; pos: { x: number; y: number; z: number }; valid: boolean } | null;
  worldSpawn: { x: number; y: number; z: number };
}

export interface RespawnResult {
  dim: Dim;
  pos: { x: number; y: number; z: number };
  source: 'anchor' | 'bed' | 'world_spawn';
  anchorChargeConsumed: boolean;
  bedInvalidatedNotice: boolean;
}

export function pickRespawn(s: RespawnSources): RespawnResult {
  if ((s.anchor?.charges ?? 0) > 0 && s.anchor) {
    return {
      dim: s.anchor.dim,
      pos: s.anchor.pos,
      source: 'anchor',
      anchorChargeConsumed: true,
      bedInvalidatedNotice: false,
    };
  }
  if (s.bed?.valid) {
    return {
      dim: s.bed.dim,
      pos: s.bed.pos,
      source: 'bed',
      anchorChargeConsumed: false,
      bedInvalidatedNotice: false,
    };
  }
  return {
    dim: 'overworld',
    pos: s.worldSpawn,
    source: 'world_spawn',
    anchorChargeConsumed: false,
    bedInvalidatedNotice: s.bed !== null && !s.bed.valid,
  };
}

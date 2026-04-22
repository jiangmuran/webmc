// Mob spawner tile-entity. Cycles every 10-40s, emits N mobs of the
// configured type around it. Requires a player within 16 blocks.

import type { MobKind } from '@/entities/mob';

export interface MobSpawnerState {
  mobKind: MobKind;
  minDelay: number;
  maxDelay: number;
  timerSec: number;
  spawnCount: number;
  requiredPlayerRange: number;
  maxNearby: number;
}

export function makeMobSpawner(mobKind: MobKind): MobSpawnerState {
  return {
    mobKind,
    minDelay: 10,
    maxDelay: 40,
    timerSec: 20,
    spawnCount: 4,
    requiredPlayerRange: 16,
    maxNearby: 6,
  };
}

export interface SpawnerCtx {
  hasPlayerInRange: boolean;
  nearbySameKind: number;
  dtSec: number;
  rng: () => number;
}

export interface SpawnerResult {
  spawn: number;
}

export function tickSpawner(state: MobSpawnerState, ctx: SpawnerCtx): SpawnerResult {
  if (!ctx.hasPlayerInRange) return { spawn: 0 };
  if (ctx.nearbySameKind >= state.maxNearby) return { spawn: 0 };
  state.timerSec -= ctx.dtSec;
  if (state.timerSec > 0) return { spawn: 0 };
  const spawn = Math.min(state.spawnCount, state.maxNearby - ctx.nearbySameKind);
  state.timerSec = state.minDelay + ctx.rng() * (state.maxDelay - state.minDelay);
  return { spawn };
}

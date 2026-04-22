// Peaceful despawn. On switch to peaceful difficulty, all hostile mobs
// despawn instantly except those tagged "persistent" (name tag, from
// spawn egg, or bred).

import type { MobKind } from './mob';

const HOSTILE_KINDS = new Set<MobKind>([
  'zombie',
  'skeleton',
  'creeper',
  'spider',
  'enderman',
  'ghast',
  'blaze',
  'piglin',
  'wither_skeleton',
  'pillager',
  'vindicator',
  'evoker',
  'warden',
]);

export interface PeacefulMob {
  kind: MobKind;
  persistent: boolean;
}

export function shouldDespawnOnPeaceful(mob: PeacefulMob): boolean {
  if (mob.persistent) return false;
  return HOSTILE_KINDS.has(mob.kind);
}

export interface DespawnCtx {
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  mobs: readonly { id: number; state: PeacefulMob }[];
}

export function rollPeacefulDespawn(ctx: DespawnCtx): readonly number[] {
  if (ctx.difficulty !== 'peaceful') return [];
  return ctx.mobs.filter((m) => shouldDespawnOnPeaceful(m.state)).map((m) => m.id);
}

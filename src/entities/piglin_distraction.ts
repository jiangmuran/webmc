// Piglins: wearing gold armor pacifies them unless you attack/open a
// chest near them. Dropping gold ingot near a hostile piglin briefly
// distracts it (~8 s) and it picks up the gold.

export interface PiglinState {
  aggroedTargetId: string | null;
  distractedUntilTick: number;
  lastAttackedByTick: number;
}

export const DISTRACTION_TICKS = 160; // 8 s @ 20 Hz
export const AGGRO_AFTER_ATTACK_TICKS = 600; // 30 s

export function makePiglin(): PiglinState {
  return {
    aggroedTargetId: null,
    distractedUntilTick: -Infinity,
    lastAttackedByTick: -Infinity,
  };
}

export interface HostilityQuery {
  playerWearsFullGold: boolean;
  playerOpenedChestNearby: boolean;
  playerAttackedRecently: boolean;
  nowTick: number;
}

export function isHostileTo(s: PiglinState, q: HostilityQuery, playerId: string): boolean {
  if (q.nowTick < s.distractedUntilTick && s.aggroedTargetId !== playerId) return false;
  if (q.playerAttackedRecently) return true;
  if (q.playerOpenedChestNearby) return true;
  if (q.playerWearsFullGold) return false;
  return true;
}

export function throwGoldAt(s: PiglinState, nowTick: number): void {
  s.distractedUntilTick = nowTick + DISTRACTION_TICKS;
  s.aggroedTargetId = null;
}

export function attacked(s: PiglinState, byPlayer: string, nowTick: number): void {
  s.aggroedTargetId = byPlayer;
  s.lastAttackedByTick = nowTick;
  s.distractedUntilTick = -Infinity;
}

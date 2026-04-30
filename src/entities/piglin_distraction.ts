// Piglins: wearing at least one piece of gold armor pacifies them
// unless you attack/open a chest near them. Dropping gold ingot
// near a hostile piglin briefly distracts it and it picks up the
// gold.
//
// Wiki (minecraft.wiki/w/Piglin): "It is hostile to players unless
// they wear at least one piece of golden armor… Adult piglins are
// neutral if the player is wearing at least one piece of golden
// armor." Old `playerWearsFullGold` required a full set, which made
// piglins hostile to players in 1-3 pieces of gold (a much stricter
// rule than canon — wiki: just one piece is enough).
// "When provoked, piglins remain hostile for 30 seconds." → 600 ticks.

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
  // Per wiki, ANY piece of gold armor pacifies adult piglins; a full
  // set is not required. Field renamed to reflect that — the legacy
  // `playerWearsFullGold` alias is preserved for back-compat.
  playerWearsAnyGoldArmor?: boolean;
  playerWearsFullGold?: boolean;
  playerOpenedChestNearby: boolean;
  playerAttackedRecently: boolean;
  nowTick: number;
}

function pacifiedByArmor(q: HostilityQuery): boolean {
  return q.playerWearsAnyGoldArmor === true || q.playerWearsFullGold === true;
}

export function isHostileTo(s: PiglinState, q: HostilityQuery, playerId: string): boolean {
  if (q.nowTick < s.distractedUntilTick && s.aggroedTargetId !== playerId) return false;
  if (q.playerAttackedRecently) return true;
  if (q.playerOpenedChestNearby) return true;
  if (pacifiedByArmor(q)) return false;
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

// Wolf anger / retaliation. Tamed wolves aggro on any mob that damages
// their owner. Wild wolves aggro if the player attacks them (and all
// wolves in sight). Wolves attacking together benefit from pack-style
// priority targeting.

export interface WolfState {
  id: number;
  tamed: boolean;
  ownerId: string | null;
  targetId: number | null;
  hostileToMobs: Set<number>; // entity ids the wolf will attack on sight
  fleeHealthThreshold: number;
  health: number;
}

// Wiki (minecraft.wiki/w/Wolf): "health = Wild: 8 / Tamed: 40."
// Old TAMED constant was 20, exactly half the wiki value. A "Tamed
// wolves whine when they have low health (below 20 [java])" wiki
// clue may have been read as the max — but 20 is the LOW-HEALTH
// THRESHOLD, not the max. Actual max is 40 HP (20 hearts).
export const WOLF_MAX_HEALTH_TAMED = 40;
export const WOLF_MAX_HEALTH_WILD = 8;
// Threshold below which a tamed wolf whines.
export const WOLF_TAMED_LOW_HEALTH = 20;

export function makeWolf(id: number, tamed = false, ownerId: string | null = null): WolfState {
  return {
    id,
    tamed,
    ownerId,
    targetId: null,
    hostileToMobs: new Set(),
    fleeHealthThreshold: tamed ? 0 : 5, // wild wolves flee at low HP
    health: tamed ? WOLF_MAX_HEALTH_TAMED : WOLF_MAX_HEALTH_WILD,
  };
}

// Owner took damage from mob `attackerId`.
export function onOwnerDamaged(state: WolfState, attackerId: number): void {
  if (!state.tamed) return;
  state.hostileToMobs.add(attackerId);
  state.targetId ??= attackerId;
}

// Player attacked a wild wolf — aggros this wolf and all its pack.
export interface PackAggroResult {
  aggroIds: number[];
}

export function onWildWolfHit(
  victim: WolfState,
  pack: readonly WolfState[],
  attackerId: number,
): PackAggroResult {
  const aggro: number[] = [];
  if (!victim.tamed) {
    victim.targetId = attackerId;
    victim.hostileToMobs.add(attackerId);
    aggro.push(victim.id);
    for (const w of pack) {
      if (w.id === victim.id || w.tamed) continue;
      w.targetId = attackerId;
      w.hostileToMobs.add(attackerId);
      aggro.push(w.id);
    }
  }
  return { aggroIds: aggro };
}

// Decide whether to flee (wild wolves only).
export function shouldFlee(state: WolfState): boolean {
  if (state.tamed) return false;
  return state.health <= state.fleeHealthThreshold;
}

// Clear target when attacker is dead or too far.
export function dropTarget(state: WolfState): void {
  state.targetId = null;
}

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

export const WOLF_MAX_HEALTH_TAMED = 20;
export const WOLF_MAX_HEALTH_WILD = 8;

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

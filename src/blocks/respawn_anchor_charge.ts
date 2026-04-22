// Respawn anchor charge management. 0..4 charges. Using a charged anchor
// in the nether consumes 1 charge and sets spawn point. Right-clicking
// with glowstone adds 1 charge (up to max). The block's light emission
// scales with charge (0 = dark, 4 = full 15).

export const RESPAWN_ANCHOR_MAX = 4;

export interface RespawnAnchorState {
  charges: number;
  spawnOwnerUUIDs: Set<string>;
}

export function makeRespawnAnchor(charges = 0): RespawnAnchorState {
  return {
    charges: Math.max(0, Math.min(RESPAWN_ANCHOR_MAX, charges)),
    spawnOwnerUUIDs: new Set(),
  };
}

export interface AddChargeResult {
  accepted: boolean;
  chargesAfter: number;
  consumedGlowstone: boolean;
}

export function addCharge(state: RespawnAnchorState): AddChargeResult {
  if (state.charges >= RESPAWN_ANCHOR_MAX) {
    return { accepted: false, chargesAfter: state.charges, consumedGlowstone: false };
  }
  state.charges++;
  return {
    accepted: true,
    chargesAfter: state.charges,
    consumedGlowstone: true,
  };
}

export interface ConsumeChargeQuery {
  playerUUID: string;
  dimension: 'overworld' | 'nether' | 'end' | 'custom';
}

export interface ConsumeChargeResult {
  status: 'spawn_set' | 'no_charge' | 'exploded';
  chargesAfter: number;
  explosionPower: number;
}

// Using the anchor:
//   - In the nether with charges > 0: consume 1, set the player's spawn.
//   - Outside the nether: explode (power 5). Charges do not decrement,
//     the block is simply destroyed.
export function useAnchor(state: RespawnAnchorState, q: ConsumeChargeQuery): ConsumeChargeResult {
  if (q.dimension !== 'nether') {
    return { status: 'exploded', chargesAfter: state.charges, explosionPower: 5 };
  }
  if (state.charges <= 0) {
    return { status: 'no_charge', chargesAfter: 0, explosionPower: 0 };
  }
  state.charges--;
  state.spawnOwnerUUIDs.add(q.playerUUID);
  return { status: 'spawn_set', chargesAfter: state.charges, explosionPower: 0 };
}

// Light emission scales 0, 3, 7, 11, 15.
export function emissionFor(charges: number): number {
  const c = Math.max(0, Math.min(RESPAWN_ANCHOR_MAX, charges));
  return [0, 3, 7, 11, 15][c] ?? 0;
}

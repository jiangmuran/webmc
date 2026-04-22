// Respawn anchor — the Nether-only bed equivalent. Charged with glowstone
// (up to 4 charges) and consumed on respawn. Only functions in the Nether.

export interface RespawnAnchorState {
  charges: number; // 0..4
}

const MAX_CHARGES = 4;

export function makeAnchor(): RespawnAnchorState {
  return { charges: 0 };
}

export function chargeAnchor(state: RespawnAnchorState): boolean {
  if (state.charges >= MAX_CHARGES) return false;
  state.charges++;
  return true;
}

export interface RespawnContext {
  dimension: string;
  anchor: RespawnAnchorState;
}

export interface RespawnResult {
  usable: boolean;
  chargesAfter: number;
  reason?: string;
}

// Consumes one charge if it's a nether dimension + anchor has charge.
export function useAnchor(ctx: RespawnContext): RespawnResult {
  if (ctx.dimension !== 'nether') {
    return { usable: false, chargesAfter: ctx.anchor.charges, reason: 'wrong_dimension' };
  }
  if (ctx.anchor.charges <= 0) {
    return { usable: false, chargesAfter: 0, reason: 'no_charge' };
  }
  ctx.anchor.charges--;
  return { usable: true, chargesAfter: ctx.anchor.charges };
}

// Overworld use: explodes like a charged creeper (caller triggers).
export function shouldExplodeOnUse(dimension: string): boolean {
  return dimension === 'overworld';
}

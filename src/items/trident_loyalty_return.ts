export interface TridentCtx {
  loyaltyLevel: number;
  ticksSinceLaunch: number;
  ownerAlive: boolean;
  inVoid: boolean;
}

export const RETURN_DELAY_TICKS = 10;

export function shouldReturn(t: TridentCtx): boolean {
  if (t.loyaltyLevel <= 0) return false;
  if (t.inVoid) return false;
  if (!t.ownerAlive) return false;
  return t.ticksSinceLaunch >= RETURN_DELAY_TICKS;
}

// Wiki (minecraft.wiki/w/Loyalty): "Travels at ~0.83 b/t at level I,
// ~1.67 b/t at level II, and 2.5 b/t at level III. Each level adds
// ~0.83 b/t." Old `level * 0.05` was 1/16 of canon. Sibling
// loyalty_trident.ts also corrected.
const SPEED_PER_LEVEL = 5 / 6;
export function returnSpeed(level: number): number {
  return Math.max(0, level) * SPEED_PER_LEVEL;
}

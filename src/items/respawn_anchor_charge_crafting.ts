// Wiki (minecraft.wiki/w/Respawn_Anchor): "Glowstone can be used on
// a respawn anchor to charge it... in any dimension." Only USING the
// anchor to set or trigger a respawn is dimension-restricted (it
// explodes in the Overworld and the End).
//
// Old `canCharge` required `dimensionAllowed=true` for charging, so
// in the Overworld the player couldn't charge an anchor at all even
// though wiki only restricts the spawn-point set on use. The
// dimension flag is kept on the type for callers that gate the
// "use to set spawn" path; the charging path now ignores it.

export interface ChargeCtx {
  charges: number;
  dimensionAllowed: boolean;
  itemGlowstone: boolean;
}

export const MAX_CHARGES = 4;

export function canCharge(c: ChargeCtx): boolean {
  return c.itemGlowstone && c.charges < MAX_CHARGES;
}

export function afterCharge(c: ChargeCtx): ChargeCtx {
  if (!canCharge(c)) return c;
  return { ...c, charges: c.charges + 1 };
}

// Per wiki: setting / using the anchor as a spawn point is allowed
// only in the Nether (it explodes in the Overworld + End); the
// dimensionAllowed flag gates that path separately.
export function canSetSpawn(c: ChargeCtx): boolean {
  return c.dimensionAllowed && c.charges > 0;
}

export interface ChargeCtx {
  charges: number;
  dimensionAllowed: boolean;
  itemGlowstone: boolean;
}

export const MAX_CHARGES = 4;

export function canCharge(c: ChargeCtx): boolean {
  return c.dimensionAllowed && c.itemGlowstone && c.charges < MAX_CHARGES;
}

export function afterCharge(c: ChargeCtx): ChargeCtx {
  if (!canCharge(c)) return c;
  return { ...c, charges: c.charges + 1 };
}

export interface EnchantOfferCtx {
  bookshelfPower: number;
  slot: 0 | 1 | 2;
  randomBase: number;
}

export function levelCost(c: EnchantOfferCtx): number {
  const power = Math.min(15, c.bookshelfPower);
  const base = 1 + Math.floor(power / 2) + c.randomBase;
  const slotMult = [0, 0.5, 1][c.slot] ?? 0;
  return Math.max(c.slot + 1, Math.ceil(base * slotMult));
}

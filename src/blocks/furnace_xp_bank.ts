// Furnace XP bank. Each successful smelt stashes a fractional XP value
// (e.g. iron = 0.7) inside the furnace. When the player takes the output
// stack, the accumulated XP is spawned as orbs. Breaking the furnace
// also releases XP.

export interface FurnaceXpBank {
  accumulated: number;
}

export function makeFurnaceXpBank(): FurnaceXpBank {
  return { accumulated: 0 };
}

export function addSmeltXp(bank: FurnaceXpBank, xpPerSmelt: number): void {
  bank.accumulated += xpPerSmelt;
}

// Collecting the output: returns the integer XP to drop. Fractional
// remainder is stashed back in the bank.
export interface CollectQuery {
  bank: FurnaceXpBank;
  itemsCollected: number;
  xpPerSmelt: number;
  rng: () => number;
}

export interface CollectResult {
  xpOrbs: number;
  remainingInBank: number;
}

export function collectFurnaceXp(q: CollectQuery): CollectResult {
  const xpEarned = q.itemsCollected * q.xpPerSmelt + q.bank.accumulated;
  const whole = Math.floor(xpEarned);
  const frac = xpEarned - whole;
  // Fractional XP rolls to a +1 probability.
  const bonus = q.rng() < frac ? 1 : 0;
  q.bank.accumulated = frac - (bonus ? frac : 0);
  if (q.bank.accumulated < 0) q.bank.accumulated = 0;
  return { xpOrbs: whole + bonus, remainingInBank: q.bank.accumulated };
}

// Breaking the furnace drops all accumulated XP.
export function breakFurnaceXp(bank: FurnaceXpBank): number {
  const orbs = Math.round(bank.accumulated);
  bank.accumulated = 0;
  return orbs;
}

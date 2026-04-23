// Sweet berry bush. 4 ages. Ages 2-3 damage entities walking through.
// Harvest at age 2-3 yields berries; age 3 resets to age 1.

export interface BerryBushCtx {
  age: 0 | 1 | 2 | 3;
}

export const BERRY_MAX_AGE = 3;

export function tryGrow(c: BerryBushCtx, rand: () => number): BerryBushCtx {
  if (c.age >= BERRY_MAX_AGE) return c;
  if (rand() > 0.2) return c;
  return { age: (c.age + 1) as BerryBushCtx['age'] };
}

export function walkDamage(c: BerryBushCtx): boolean {
  return c.age >= 2;
}

export interface HarvestResult {
  berries: number;
  bush: BerryBushCtx;
}

export function harvest(c: BerryBushCtx, rand: () => number): HarvestResult {
  if (c.age < 2) return { berries: 0, bush: c };
  const max = c.age === 3 ? 3 : 2;
  const berries = 1 + Math.floor(rand() * max);
  return { berries, bush: { age: 1 } };
}

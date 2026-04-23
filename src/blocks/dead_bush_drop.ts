export interface BreakCtx {
  withShears: boolean;
  rng: () => number;
}

export const STICK_DROP_CHANCE = 0.55;

export function drops(c: BreakCtx): { item: string; count: number }[] {
  if (c.withShears) return [{ item: 'dead_bush', count: 1 }];
  const sticks = c.rng() < STICK_DROP_CHANCE ? 1 + Math.floor(c.rng() * 2) : 0;
  return sticks > 0 ? [{ item: 'stick', count: sticks }] : [];
}

export function placesOnSand(block: string): boolean {
  return ['sand', 'red_sand', 'terracotta', 'dirt', 'podzol', 'coarse_dirt'].includes(block);
}

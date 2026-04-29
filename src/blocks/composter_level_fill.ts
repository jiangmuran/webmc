// Wiki: composter levels 0-7. Level 7 is the "ready" state with bone
// meal visible; further compost items have no effect. Old code had
// MAX_LEVEL=8 and let addItem advance past the ready threshold, which
// doesn't match the in-game behaviour (no compost while ready).
export const MAX_LEVEL = 7;

export interface Composter {
  level: number;
}

const COMPOST_CHANCE: Record<string, number> = {
  wheat_seeds: 0.3,
  beetroot_seeds: 0.3,
  sweet_berries: 0.3,
  bamboo: 0.3,
  apple: 0.65,
  carrot: 0.65,
  potato: 0.65,
  wheat: 0.65,
  baked_potato: 0.85,
  bread: 0.85,
  cookie: 0.85,
  hay_block: 0.85,
  cake: 1,
  pumpkin_pie: 1,
};

export function compostChance(id: string): number {
  return COMPOST_CHANCE[id] ?? 0;
}

export function addItem(c: Composter, id: string, rng: () => number): Composter {
  if (c.level >= MAX_LEVEL) return c;
  const chance = compostChance(id);
  if (chance === 0) return c;
  if (rng() < chance) return { level: Math.min(MAX_LEVEL, c.level + 1) };
  return c;
}

export function isReady(c: Composter): boolean {
  return c.level === MAX_LEVEL;
}

export function collectBonemeal(c: Composter): { result: Composter; yielded: boolean } {
  if (c.level !== MAX_LEVEL) return { result: c, yielded: false };
  return { result: { level: 0 }, yielded: true };
}

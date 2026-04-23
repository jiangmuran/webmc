export interface Composter {
  level: number;
  readyForBonemeal: boolean;
}

export const MAX_LEVEL = 7;

export function addCompost(c: Composter, chance: number, rng: () => number): Composter {
  if (c.level >= MAX_LEVEL) return c;
  if (c.readyForBonemeal) return c;
  if (rng() >= chance) return c;
  const level = c.level + 1;
  return { level, readyForBonemeal: level >= MAX_LEVEL };
}

export function extractBonemeal(c: Composter): Composter {
  if (!c.readyForBonemeal) return c;
  return { level: 0, readyForBonemeal: false };
}

export function composterFillChance(item: string): number {
  const table: Record<string, number> = {
    seed: 0.3,
    wheat: 0.65,
    apple: 0.65,
    carrot: 0.65,
    potato: 0.65,
    cake: 1,
  };
  return table[item] ?? 0;
}

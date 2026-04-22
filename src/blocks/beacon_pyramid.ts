// Beacon pyramid scan. A beacon reads a square pyramid of "fuel"
// blocks below it. Level = height of the pyramid (1..4). Each level
// is a (2*lvl+1)^2 square of iron/gold/diamond/emerald/netherite.

export const BEACON_FUEL = new Set<string>([
  'webmc:iron_block',
  'webmc:gold_block',
  'webmc:diamond_block',
  'webmc:emerald_block',
  'webmc:netherite_block',
]);

export interface PyramidQuery {
  at: (x: number, y: number, z: number) => string;
  bx: number;
  by: number;
  bz: number;
}

export function pyramidLevel(q: PyramidQuery): number {
  for (let lvl = 1; lvl <= 4; lvl++) {
    const y = q.by - lvl;
    for (let dx = -lvl; dx <= lvl; dx++) {
      for (let dz = -lvl; dz <= lvl; dz++) {
        if (!BEACON_FUEL.has(q.at(q.bx + dx, y, q.bz + dz))) {
          return lvl - 1;
        }
      }
    }
  }
  return 4;
}

export function maxRangeForLevel(lvl: number): number {
  return lvl <= 0 ? 0 : 10 + lvl * 10; // 20/30/40/50
}

export const PRIMARY_BY_LEVEL: Record<number, string[]> = {
  1: ['speed', 'haste'],
  2: ['resistance', 'jump_boost'],
  3: ['strength'],
};

export function canPickSecondary(lvl: number): boolean {
  return lvl >= 4;
}

// Dungeon rooms: 5×5 cobble walls, mob spawner center, 1-2 chests.

export type DungeonMob = 'zombie' | 'skeleton' | 'spider';

export const DUNGEON_MOB_WEIGHTS: Record<DungeonMob, number> = {
  zombie: 50,
  skeleton: 25,
  spider: 25,
};

export function rollMob(rand: () => number): DungeonMob {
  const total = 100;
  const r = rand() * total;
  if (r < 50) return 'zombie';
  if (r < 75) return 'skeleton';
  return 'spider';
}

export function chestCount(rand: () => number): 1 | 2 {
  return rand() < 0.25 ? 2 : 1;
}

export function dungeonLoot(rand: () => number): string {
  const pool = [
    'bone',
    'gunpowder',
    'string',
    'iron_ingot',
    'wheat',
    'bread',
    'record_13',
    'record_cat',
    'golden_apple',
    'enchanted_book',
  ];
  return pool[Math.floor(rand() * pool.length)] ?? 'bone';
}

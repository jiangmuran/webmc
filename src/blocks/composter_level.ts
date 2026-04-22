// Composter. Items have an "add chance" that may bump the level by 1
// (0..7). At level 7, a bone meal is available; right-clicking again
// resets to 0. Deterministic RNG injection for tests.

export interface Composter {
  level: number; // 0..7
}

export function makeComposter(): Composter {
  return { level: 0 };
}

// MC-equivalent add chances (0..1). Partial list.
const ADD_CHANCE: Record<string, number> = {
  'webmc:beetroot_seeds': 0.3,
  'webmc:dried_kelp': 0.3,
  'webmc:grass': 0.3,
  'webmc:kelp': 0.3,
  'webmc:melon_seeds': 0.3,
  'webmc:pumpkin_seeds': 0.3,
  'webmc:saplings': 0.3,
  'webmc:sweet_berries': 0.3,
  'webmc:wheat_seeds': 0.3,
  'webmc:cactus': 0.5,
  'webmc:melon_slice': 0.5,
  'webmc:sugar_cane': 0.5,
  'webmc:vine': 0.5,
  'webmc:apple': 0.65,
  'webmc:carrot': 0.65,
  'webmc:potato': 0.65,
  'webmc:wheat': 0.65,
  'webmc:baked_potato': 0.85,
  'webmc:bread': 0.85,
  'webmc:cookie': 0.85,
  'webmc:hay_block': 0.85,
  'webmc:cake': 1,
  'webmc:pumpkin_pie': 1,
};

export function addChanceFor(itemId: string): number {
  return ADD_CHANCE[itemId] ?? 0;
}

export interface AddQuery {
  itemId: string;
  rand: () => number;
}

export function tryAdd(c: Composter, q: AddQuery): 'ignored' | 'rejected' | 'leveled' | 'full' {
  if (c.level >= 7) return 'full';
  const chance = addChanceFor(q.itemId);
  if (chance <= 0) return 'ignored';
  if (q.rand() < chance) {
    c.level += 1;
    return 'leveled';
  }
  return 'rejected';
}

export function harvest(c: Composter): 'webmc:bone_meal' | null {
  if (c.level < 7) return null;
  c.level = 0;
  return 'webmc:bone_meal';
}

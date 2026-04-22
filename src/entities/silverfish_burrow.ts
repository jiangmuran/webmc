// Silverfish can "burrow" into stone-family blocks when damaged or
// stuck, turning them into infested versions. 40% chance per hit.

export interface SilverfishBurrowQuery {
  damageReceived: boolean;
  adjacentStoneFamilyId: string | null;
  rand: () => number;
}

const STONE_TO_INFESTED: Record<string, string> = {
  'webmc:stone': 'webmc:infested_stone',
  'webmc:cobblestone': 'webmc:infested_cobblestone',
  'webmc:stone_bricks': 'webmc:infested_stone_bricks',
  'webmc:mossy_stone_bricks': 'webmc:infested_mossy_stone_bricks',
  'webmc:cracked_stone_bricks': 'webmc:infested_cracked_stone_bricks',
  'webmc:chiseled_stone_bricks': 'webmc:infested_chiseled_stone_bricks',
  'webmc:deepslate': 'webmc:infested_deepslate',
};

export const BURROW_CHANCE = 0.4;

export function tryBurrow(q: SilverfishBurrowQuery): string | null {
  if (!q.damageReceived) return null;
  if (!q.adjacentStoneFamilyId) return null;
  const infestedId = STONE_TO_INFESTED[q.adjacentStoneFamilyId];
  if (!infestedId) return null;
  if (q.rand() >= BURROW_CHANCE) return null;
  return infestedId;
}

export function infestedFor(normal: string): string | null {
  return STONE_TO_INFESTED[normal] ?? null;
}

// Structures decay: % of blocks are replaced with air or substituted
// with "ruin" variants (cobbled → mossy, stone → cracked).

export const DECAY_CHANCE = 0.2;

export function decayReplace(blockId: string, rand: () => number): string | null {
  if (rand() < DECAY_CHANCE) {
    // Replace with weathered variant if we know one; otherwise delete.
    if (blockId === 'cobblestone') return 'mossy_cobblestone';
    if (blockId === 'stone_bricks') return 'cracked_stone_bricks';
    if (blockId === 'nether_bricks') return 'cracked_nether_bricks';
    return null;
  }
  return blockId;
}

export function integrityRoll(integrity: number, rand: () => number): boolean {
  return rand() < integrity;
}

export function applyIntegrity(id: string, integrity: number, rand: () => number): string | null {
  if (!integrityRoll(integrity, rand)) return null;
  return decayReplace(id, rand) ?? id;
}

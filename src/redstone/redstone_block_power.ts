// Redstone block is a permanent power source. Unlike torches/levers,
// it powers all 6 adjacent blocks at signal 15 without any "direction"
// and without needing activation.

export const REDSTONE_BLOCK_SIGNAL = 15;
export const REDSTONE_BLOCK_ID = 'webmc:redstone_block';

export interface RedstoneBlockQuery {
  isRedstoneBlockAt: (dx: number, dy: number, dz: number) => boolean;
}

// Returns the power a redstone block provides to its neighbor at offset
// (dx, dy, dz). Only direct 6-adjacent are powered; diagonals aren't.
export function powerFromRedstoneBlockAt(
  q: RedstoneBlockQuery,
  dx: number,
  dy: number,
  dz: number,
): number {
  if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) !== 1) return 0;
  return q.isRedstoneBlockAt(-dx, -dy, -dz) ? REDSTONE_BLOCK_SIGNAL : 0;
}

// Craft: 9 redstone dust → 1 redstone block (reversible 1:9).
export interface CraftRedstoneBlockQuery {
  redstoneDust: number;
}

export function craftRedstoneBlock(
  q: CraftRedstoneBlockQuery,
): { item: 'webmc:redstone_block'; count: number } | null {
  if (q.redstoneDust < 9) return null;
  return { item: 'webmc:redstone_block', count: Math.floor(q.redstoneDust / 9) };
}

// Uncrafting: 1 redstone block → 9 redstone dust.
export function uncraftRedstoneBlock(blockCount: number): {
  item: 'webmc:redstone';
  count: number;
} {
  return { item: 'webmc:redstone', count: blockCount * 9 };
}

// Redstone blocks can be moved by pistons (unlike glazed terracotta).
export const REDSTONE_BLOCK_PISTON_MOVABLE = true;

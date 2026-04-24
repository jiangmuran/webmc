export const CALL_SPAWN_RADIUS = 21;
export const CALL_MAX_SPAWNED = 8;

export interface SilverfishCallInput {
  centerX: number;
  centerZ: number;
  existingCount: number;
  isAngered: boolean;
}

export function canCall(i: SilverfishCallInput): boolean {
  if (!i.isAngered) return false;
  return i.existingCount < CALL_MAX_SPAWNED;
}

export function infestedBlocksBreakable(blockId: string): boolean {
  return (
    blockId === 'infested_stone' ||
    blockId === 'infested_cobblestone' ||
    blockId === 'infested_stone_bricks' ||
    blockId === 'infested_chiseled_stone_bricks' ||
    blockId === 'infested_mossy_stone_bricks' ||
    blockId === 'infested_cracked_stone_bricks' ||
    blockId === 'infested_deepslate'
  );
}

export function spawnsSilverfishOnBreak(blockId: string): boolean {
  return infestedBlocksBreakable(blockId);
}

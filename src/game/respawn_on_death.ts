// Respawn on death. Drops inventory (unless keepInventory) + 7×level XP orbs
// capped at 100. Respawn point = bed/anchor/world spawn.

export interface DeathCtx {
  keepInventory: boolean;
  currentLevel: number;
  currentXp: number;
  bedValid: boolean;
  anchorValid: boolean;
  dimension: string;
}

export type RespawnAt = { kind: 'bed' } | { kind: 'respawn_anchor' } | { kind: 'world_spawn' };

export function respawnLocation(c: DeathCtx): RespawnAt {
  if (c.anchorValid && c.dimension === 'nether') return { kind: 'respawn_anchor' };
  if (c.bedValid && c.dimension === 'overworld') return { kind: 'bed' };
  return { kind: 'world_spawn' };
}

export function droppedItemsCount(c: DeathCtx, inventoryItemCount: number): number {
  return c.keepInventory ? 0 : inventoryItemCount;
}

export function droppedXpOrbs(c: DeathCtx): number {
  if (c.keepInventory) return 0;
  return Math.min(100, c.currentLevel * 7);
}

export function keepsInventory(c: DeathCtx): boolean {
  return c.keepInventory;
}

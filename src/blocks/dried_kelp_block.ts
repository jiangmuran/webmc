// Dried kelp block. Fast fuel: smelts 20 items per block.

export const DRIED_KELP_BLOCK_SMELT_COUNT = 20;

export function smeltCount(): number {
  return DRIED_KELP_BLOCK_SMELT_COUNT;
}

export interface CraftInputs {
  driedKelpCount: number;
}

export const BLOCK_CRAFT_COST = 9;

export function canCraftBlock(i: CraftInputs): boolean {
  return i.driedKelpCount >= BLOCK_CRAFT_COST;
}

export function unblockCount(): number {
  return 9;
}

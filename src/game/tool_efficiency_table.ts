export type ToolMaterial = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite';

export const SPEED_MULT: Record<ToolMaterial, number> = {
  wood: 2,
  stone: 4,
  iron: 6,
  gold: 12,
  diamond: 8,
  netherite: 9,
};

export function harvestDuration(blockHardness: number, material: ToolMaterial): number {
  const mult = SPEED_MULT[material];
  return Math.max(0.01, blockHardness / mult);
}

export function toolStrongEnough(material: ToolMaterial, minTier: number): boolean {
  const TIER: Record<ToolMaterial, number> = {
    wood: 0,
    gold: 0,
    stone: 1,
    iron: 2,
    diamond: 3,
    netherite: 4,
  };
  return TIER[material] >= minTier;
}

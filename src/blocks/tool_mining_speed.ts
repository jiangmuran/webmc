export type ToolTier = 'hand' | 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite';

const SPEED_MULT: Record<ToolTier, number> = {
  hand: 1,
  wood: 2,
  stone: 4,
  iron: 6,
  gold: 12,
  diamond: 8,
  netherite: 9,
};

const TIER_RANK: Record<ToolTier, number> = {
  hand: 0,
  wood: 1,
  gold: 1,
  stone: 2,
  iron: 3,
  diamond: 4,
  netherite: 5,
};

export function canHarvest(toolTier: ToolTier, requiredTier: ToolTier): boolean {
  return TIER_RANK[toolTier] >= TIER_RANK[requiredTier];
}

export function miningTicks(
  hardness: number,
  toolTier: ToolTier,
  isCorrectToolType: boolean,
  efficiencyLevel: number,
  hasteLevel: number,
  underwater: boolean,
  onGround: boolean,
): number {
  if (hardness <= 0) return 0;
  let speed = isCorrectToolType ? SPEED_MULT[toolTier] : 1;
  if (efficiencyLevel > 0 && isCorrectToolType) {
    speed += efficiencyLevel * efficiencyLevel + 1;
  }
  if (hasteLevel > 0) speed *= 1 + 0.2 * hasteLevel;
  if (underwater) speed /= 5;
  if (!onGround) speed /= 5;
  const damage = speed / hardness / (isCorrectToolType ? 30 : 100);
  return Math.max(1, Math.ceil(1 / damage));
}

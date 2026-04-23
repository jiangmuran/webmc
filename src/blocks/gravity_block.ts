// Gravity-affected blocks: sand, gravel, anvil, concrete_powder,
// dragon_egg, falling stalactites. Convert to FallingBlockEntity on update.

const GRAVITY_BLOCKS = new Set([
  'sand',
  'red_sand',
  'suspicious_sand',
  'suspicious_gravel',
  'gravel',
  'anvil',
  'chipped_anvil',
  'damaged_anvil',
  'dragon_egg',
  'pointed_dripstone',
]);

export function affectedByGravity(blockId: string): boolean {
  if (GRAVITY_BLOCKS.has(blockId)) return true;
  return blockId.startsWith('concrete_powder_');
}

export function shouldFall(blockId: string, belowIsSupport: boolean): boolean {
  if (!affectedByGravity(blockId)) return false;
  return !belowIsSupport;
}

export function landsAsBlock(fallingKind: string): string {
  return fallingKind;
}

export function concretePowderSolidifiesInWater(blockId: string, inWater: boolean): string | null {
  if (!inWater) return null;
  if (!blockId.startsWith('concrete_powder_')) return null;
  return blockId.replace('concrete_powder_', 'concrete_');
}

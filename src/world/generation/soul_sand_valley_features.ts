export const BASE_BLOCKS = new Set(['soul_sand', 'soul_soil']);

export const DECORATION = new Set([
  'bone_block',
  'soul_fire',
  'skeleton_skull',
  'wither_skeleton_skull',
]);

export function biomeContains(block: string): boolean {
  return BASE_BLOCKS.has(block) || DECORATION.has(block);
}

export function ghastSpawnMultiplier(): number {
  return 5;
}

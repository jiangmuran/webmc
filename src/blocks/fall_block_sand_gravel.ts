export const FALLING_IDS = new Set<string>([
  'sand',
  'red_sand',
  'suspicious_sand',
  'gravel',
  'suspicious_gravel',
  'anvil',
  'chipped_anvil',
  'damaged_anvil',
  'concrete_powder',
  'white_concrete_powder',
  'orange_concrete_powder',
  'magenta_concrete_powder',
  'light_blue_concrete_powder',
  'yellow_concrete_powder',
  'lime_concrete_powder',
  'pink_concrete_powder',
  'gray_concrete_powder',
  'light_gray_concrete_powder',
  'cyan_concrete_powder',
  'purple_concrete_powder',
  'blue_concrete_powder',
  'brown_concrete_powder',
  'green_concrete_powder',
  'red_concrete_powder',
  'black_concrete_powder',
  'pointed_dripstone',
  'scaffolding',
]);

export function fallsIfUnsupported(id: string, belowId: string): boolean {
  if (!FALLING_IDS.has(id)) return false;
  return belowId === 'air' || belowId === 'water' || belowId === 'lava';
}

export function concretePowderToConcrete(id: string, belowId: string): string | undefined {
  if (!id.endsWith('_concrete_powder')) return undefined;
  if (belowId === 'water') return id.replace('_concrete_powder', '_concrete');
  return undefined;
}

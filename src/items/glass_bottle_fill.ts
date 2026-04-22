// Glass bottle: right-click water source to fill; right-click cauldron;
// right-click bee nest (full) to harvest honey bottle; in dragon breath
// cloud to obtain dragon's breath.

export type BottleFillSource =
  | { kind: 'water_source' }
  | { kind: 'cauldron_water'; level: 1 | 2 | 3 }
  | { kind: 'bee_nest_full' }
  | { kind: 'dragon_breath_cloud' }
  | { kind: 'other' };

export type BottleFillResult = 'water_bottle' | 'honey_bottle' | 'dragon_breath' | 'none';

export function fill(src: BottleFillSource): BottleFillResult {
  if (src.kind === 'water_source' || src.kind === 'cauldron_water') return 'water_bottle';
  if (src.kind === 'bee_nest_full') return 'honey_bottle';
  if (src.kind === 'dragon_breath_cloud') return 'dragon_breath';
  return 'none';
}

export const GLASS_BOTTLE_MAX_STACK = 64;

export function consumesCauldronLevel(src: BottleFillSource): number {
  if (src.kind === 'cauldron_water') return 1;
  return 0;
}

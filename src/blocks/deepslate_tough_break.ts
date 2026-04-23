export const DEEPSLATE_HARDNESS = 3;
export const DEEPSLATE_RESISTANCE = 6;

export function breakSpeed(pickTier: number): number {
  if (pickTier < 1) return 0;
  return pickTier;
}

export function harvestLevel(): number {
  return 1;
}

export function dropsCobbleUnlessSilk(silkTouch: boolean): string {
  return silkTouch ? 'deepslate' : 'cobbled_deepslate';
}

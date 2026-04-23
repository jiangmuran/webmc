export interface BonemealCtx {
  onSeagrassOrWater: boolean;
  sourceBlockIsWater: boolean;
}

export function canBonemeal(c: BonemealCtx): boolean {
  return c.onSeagrassOrWater && c.sourceBlockIsWater;
}

export function seagrassClustersPlaced(rng: () => number): number {
  return 1 + Math.floor(rng() * 4);
}

export function tallSeagrassChance(): number {
  return 0.25;
}

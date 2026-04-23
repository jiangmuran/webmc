export type FungusType = 'warped' | 'crimson';

export interface GrowthContext {
  type: FungusType;
  onNylium: boolean;
  bonemealUsed: boolean;
}

export function validNyliumFor(t: FungusType): string {
  return t === 'warped' ? 'warped_nylium' : 'crimson_nylium';
}

export function canGrowHugeFungus(c: GrowthContext): boolean {
  return c.onNylium && c.bonemealUsed;
}

export function hugeFungusHeight(c: GrowthContext, rng: () => number): number {
  if (!canGrowHugeFungus(c)) return 0;
  return 4 + Math.floor(rng() * 9);
}

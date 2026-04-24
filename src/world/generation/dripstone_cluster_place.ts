export type DripstoneAttach = 'ceiling' | 'floor';

export interface DripstoneInput {
  attach: DripstoneAttach;
  rng: () => number;
}

export function clusterHeight(i: DripstoneInput): number {
  return 2 + Math.floor(i.rng() * 5);
}

export function tipFirstTier(h: number): ('tip' | 'frustum' | 'middle' | 'base')[] {
  const out: ('tip' | 'frustum' | 'middle' | 'base')[] = [];
  for (let i = 0; i < h; i++) {
    if (i === 0) out.push('tip');
    else if (i === h - 1) out.push('base');
    else if (i === 1) out.push('frustum');
    else out.push('middle');
  }
  return out;
}

export function waterDripChance(i: DripstoneInput, hasWaterAbove: boolean): number {
  if (i.attach !== 'ceiling' || !hasWaterAbove) return 0;
  return 0.017;
}

export function formsFromDrippingLava(
  hasWaterAbove: boolean,
  hasLavaAbove: boolean,
): string | undefined {
  if (hasWaterAbove) return 'pointed_dripstone';
  if (hasLavaAbove) return 'pointed_dripstone';
  return undefined;
}

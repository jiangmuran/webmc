export type ShearTarget =
  | 'sheep'
  | 'mooshroom'
  | 'snow_golem'
  | 'bogged'
  | 'leaves'
  | 'vine'
  | 'cobweb'
  | 'glow_berry_vine'
  | 'pumpkin_carve';

export function isShearable(_t: ShearTarget): boolean {
  return true;
}

export function woolCountFromSheep(rng: () => number): number {
  return 1 + Math.floor(rng() * 3);
}

export function durabilityCost(t: ShearTarget): number {
  if (t === 'leaves' || t === 'cobweb') return 1;
  if (t === 'pumpkin_carve') return 1;
  return 1;
}

export function mooshroomBecomesCow(): boolean {
  return true;
}

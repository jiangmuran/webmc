export type Continentalness =
  | 'mushroom_fields'
  | 'deep_ocean'
  | 'ocean'
  | 'coast'
  | 'near_inland'
  | 'mid_inland'
  | 'far_inland';

export const THRESHOLDS: [number, Continentalness][] = [
  [-1.05, 'mushroom_fields'],
  [-0.455, 'deep_ocean'],
  [-0.19, 'ocean'],
  [-0.11, 'coast'],
  [0.03, 'near_inland'],
  [0.3, 'mid_inland'],
  [Infinity, 'far_inland'],
];

export function fromNoise(n: number): Continentalness {
  for (const [t, c] of THRESHOLDS) {
    if (n < t) return c;
  }
  return 'far_inland';
}

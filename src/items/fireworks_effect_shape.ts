export type EffectShape = 'small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst';

export interface FireworkStar {
  shape: EffectShape;
  colors: string[];
  fadeColors: string[];
  hasTrail: boolean;
  hasTwinkle: boolean;
}

export function valid(s: FireworkStar): boolean {
  return s.colors.length > 0;
}

export function starCountForFlightLevel(flight: number): number {
  return Math.max(1, Math.min(3, flight));
}

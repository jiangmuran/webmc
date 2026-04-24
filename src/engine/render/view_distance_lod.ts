export interface LodRules {
  fullDetailRadius: number;
  halfDetailRadius: number;
  billboardRadius: number;
}

export type DetailLevel = 'full' | 'half' | 'billboard' | 'skip';

export function chunkDetailForDistance(distance: number, r: LodRules): DetailLevel {
  if (distance <= r.fullDetailRadius) return 'full';
  if (distance <= r.halfDetailRadius) return 'half';
  if (distance <= r.billboardRadius) return 'billboard';
  return 'skip';
}

export const DEFAULT_DESKTOP: LodRules = {
  fullDetailRadius: 6,
  halfDetailRadius: 12,
  billboardRadius: 24,
};
export const DEFAULT_MOBILE: LodRules = {
  fullDetailRadius: 3,
  halfDetailRadius: 6,
  billboardRadius: 10,
};

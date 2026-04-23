export const MIN_HEIGHT = 6;
export const MAX_HEIGHT = 10;

export interface Spruce {
  height: number;
  baseFoliageRadius: number;
}

export function rollSpruce(rng: () => number): Spruce {
  return {
    height: MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1)),
    baseFoliageRadius: 3,
  };
}

export function foliageRadiusAt(y: number, s: Spruce): number {
  const fromTop = s.height - y;
  if (fromTop < 0) return 0;
  return Math.min(s.baseFoliageRadius, Math.floor(fromTop / 2));
}

export function isMegaSpruce(biome: string): boolean {
  return biome === 'old_growth_spruce_taiga' || biome === 'mega_spruce_taiga';
}

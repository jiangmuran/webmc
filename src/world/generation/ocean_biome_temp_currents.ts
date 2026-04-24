export type OceanTemp = 'warm' | 'lukewarm' | 'normal' | 'cold' | 'frozen';
export type OceanDepth = 'shallow' | 'deep';

export interface OceanSpec {
  temp: OceanTemp;
  depth: OceanDepth;
}

export function iceCoverFor(temp: OceanTemp): boolean {
  return temp === 'frozen';
}

export function surfaceFluidBlock(temp: OceanTemp): string {
  if (temp === 'frozen') return 'ice';
  return 'water';
}

export function fishSpecies(temp: OceanTemp): readonly string[] {
  if (temp === 'warm' || temp === 'lukewarm') return ['tropical_fish', 'pufferfish'];
  if (temp === 'cold' || temp === 'normal') return ['cod', 'salmon'];
  return [];
}

export function undergroundCurrentStrength(spec: OceanSpec): number {
  return spec.depth === 'deep' ? 0.03 : 0.01;
}

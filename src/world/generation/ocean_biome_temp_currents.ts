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

// Wiki (minecraft.wiki/w/Ocean): per-biome fish species —
//   warm    → tropical_fish, pufferfish
//   lukewarm→ tropical_fish, pufferfish, cod, salmon (mixed zone)
//   normal  → cod, salmon
//   cold    → cod, salmon
//   frozen  → salmon (rare)
// Old code lumped lukewarm with warm (missing cod/salmon) and frozen
// with no fish at all.
export function fishSpecies(temp: OceanTemp): readonly string[] {
  if (temp === 'warm') return ['tropical_fish', 'pufferfish'];
  if (temp === 'lukewarm') return ['tropical_fish', 'pufferfish', 'cod', 'salmon'];
  if (temp === 'normal') return ['cod', 'salmon'];
  if (temp === 'cold') return ['cod', 'salmon'];
  return ['salmon'];
}

export function undergroundCurrentStrength(spec: OceanSpec): number {
  return spec.depth === 'deep' ? 0.03 : 0.01;
}

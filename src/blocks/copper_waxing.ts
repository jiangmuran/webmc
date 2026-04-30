// Copper block waxing / oxidation.

export type CopperStage = 'copper' | 'exposed_copper' | 'weathered_copper' | 'oxidized_copper';

export const NEXT_STAGE: Record<CopperStage, CopperStage> = {
  copper: 'exposed_copper',
  exposed_copper: 'weathered_copper',
  weathered_copper: 'oxidized_copper',
  oxidized_copper: 'oxidized_copper',
};

// Wiki (minecraft.wiki/w/Oxidation): a single non-waxed copper block
// has a 64/1125 chance per random tick to enter "pre-oxidation".
// In pre-oxidation, an isolated block (no neighbors) advances with
// probability m × c² where m = 0.75 (regular) and c = 1, giving
// ~0.75. Combined per-random-tick advance chance for an isolated
// regular copper block ≈ 64/1125 × 0.75 ≈ 0.0427.
//
// Old constant 1/1000 ≈ 0.001 was ~40× too low — an isolated copper
// block took ~12 hours of random ticks to advance one stage instead
// of the wiki's ~20 minutes. The neighbour-aware m×c² calculation
// is left to a richer per-block loop; this constant is the isolated
// baseline.
export const ISOLATED_OXIDIZE_CHANCE_PER_RANDOM_TICK = (64 / 1125) * 0.75;

export function randomTick(stage: CopperStage, waxed: boolean, rand: () => number): CopperStage {
  if (waxed) return stage;
  if (rand() >= ISOLATED_OXIDIZE_CHANCE_PER_RANDOM_TICK) return stage;
  return NEXT_STAGE[stage];
}

export function waxedOf(stage: CopperStage): string {
  return `waxed_${stage}`;
}

export function scrapeWax(id: string): CopperStage | null {
  if (!id.startsWith('waxed_')) return null;
  const rest = id.replace('waxed_', '');
  if (
    rest === 'copper' ||
    rest === 'exposed_copper' ||
    rest === 'weathered_copper' ||
    rest === 'oxidized_copper'
  ) {
    return rest;
  }
  return null;
}

export function scrapeAxeOxidation(stage: CopperStage): CopperStage {
  if (stage === 'oxidized_copper') return 'weathered_copper';
  if (stage === 'weathered_copper') return 'exposed_copper';
  if (stage === 'exposed_copper') return 'copper';
  return 'copper';
}

// Copper block waxing / oxidation.

export type CopperStage = 'copper' | 'exposed_copper' | 'weathered_copper' | 'oxidized_copper';

export const NEXT_STAGE: Record<CopperStage, CopperStage> = {
  copper: 'exposed_copper',
  exposed_copper: 'weathered_copper',
  weathered_copper: 'oxidized_copper',
  oxidized_copper: 'oxidized_copper',
};

export function randomTick(stage: CopperStage, waxed: boolean, rand: () => number): CopperStage {
  if (waxed) return stage;
  if (rand() > 0.001) return stage; // 1/1000 per tick
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

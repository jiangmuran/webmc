export type CopperForm =
  | 'copper_block'
  | 'exposed_copper'
  | 'weathered_copper'
  | 'oxidized_copper'
  | 'cut_copper'
  | 'chiseled_copper';

export const OXIDATION_STAGES: CopperForm[] = [
  'copper_block',
  'exposed_copper',
  'weathered_copper',
  'oxidized_copper',
];

export function nextStage(current: CopperForm): CopperForm | undefined {
  const idx = OXIDATION_STAGES.indexOf(current);
  if (idx === -1 || idx === OXIDATION_STAGES.length - 1) return undefined;
  return OXIDATION_STAGES[idx + 1];
}

export function waxedPrefix(form: CopperForm): string {
  return `waxed_${form}`;
}

export function scrubsOnAxeHit(form: CopperForm): CopperForm | undefined {
  const idx = OXIDATION_STAGES.indexOf(form);
  if (idx <= 0) return undefined;
  return OXIDATION_STAGES[idx - 1];
}

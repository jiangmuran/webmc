export type ChiseledCopperStage =
  | 'chiseled_copper'
  | 'exposed_chiseled_copper'
  | 'weathered_chiseled_copper'
  | 'oxidized_chiseled_copper';

const ORDER: ChiseledCopperStage[] = [
  'chiseled_copper',
  'exposed_chiseled_copper',
  'weathered_chiseled_copper',
  'oxidized_chiseled_copper',
];

export function nextStage(s: ChiseledCopperStage): ChiseledCopperStage | undefined {
  const i = ORDER.indexOf(s);
  return i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : undefined;
}

export function prevStage(s: ChiseledCopperStage): ChiseledCopperStage | undefined {
  const i = ORDER.indexOf(s);
  return i > 0 ? ORDER[i - 1] : undefined;
}

export function waxed(s: ChiseledCopperStage): `waxed_${ChiseledCopperStage}` {
  return `waxed_${s}` as const;
}

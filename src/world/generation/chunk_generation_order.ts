export type Stage =
  | 'empty'
  | 'structures_starts'
  | 'structures_references'
  | 'biomes'
  | 'noise'
  | 'surface'
  | 'carvers'
  | 'features'
  | 'initialize_light'
  | 'light'
  | 'spawn'
  | 'full';

export const ORDER: Stage[] = [
  'empty',
  'structures_starts',
  'structures_references',
  'biomes',
  'noise',
  'surface',
  'carvers',
  'features',
  'initialize_light',
  'light',
  'spawn',
  'full',
];

export function nextStage(current: Stage): Stage | undefined {
  const idx = ORDER.indexOf(current);
  if (idx === -1 || idx === ORDER.length - 1) return undefined;
  return ORDER[idx + 1];
}

export function percentDone(current: Stage): number {
  const idx = ORDER.indexOf(current);
  return idx / (ORDER.length - 1);
}

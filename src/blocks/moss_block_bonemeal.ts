export const CONVERTIBLE = new Set([
  'stone',
  'cobblestone',
  'mossy_cobblestone',
  'dirt',
  'grass_block',
  'coarse_dirt',
]);

export const MOSS_RADIUS = 3;

export function canConvert(block: string): boolean {
  return CONVERTIBLE.has(block);
}

export function convertedBlock(): string {
  return 'moss_block';
}

export function azaleaSpawnChance(): number {
  return 0.1;
}

// Wiki: bone meal on moss_block converts a 3-block radius of stone-/
// dirt-family blocks to moss_block. Was 6-entry — missed deepslate
// family, granite/andesite/diorite (+polished), dirt_path, podzol,
// mycelium.
export const CONVERTIBLE = new Set([
  // Stone family
  'stone',
  'cobblestone',
  'mossy_cobblestone',
  // Granite/andesite/diorite + polished variants
  'granite',
  'polished_granite',
  'andesite',
  'polished_andesite',
  'diorite',
  'polished_diorite',
  // Deepslate family
  'deepslate',
  'cobbled_deepslate',
  'polished_deepslate',
  // Dirt family
  'dirt',
  'grass_block',
  'coarse_dirt',
  'dirt_path',
  'podzol',
  'mycelium',
  'rooted_dirt',
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

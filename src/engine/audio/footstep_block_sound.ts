export type SoundGroup =
  | 'wood'
  | 'gravel'
  | 'stone'
  | 'metal'
  | 'grass'
  | 'sand'
  | 'snow'
  | 'wool'
  | 'glass'
  | 'basalt'
  | 'coral'
  | 'sculk'
  | 'amethyst'
  | 'mud'
  | 'powder_snow';

const GROUP_MAP: Record<string, SoundGroup> = {
  stone: 'stone',
  cobblestone: 'stone',
  deepslate: 'stone',
  dirt: 'grass',
  grass_block: 'grass',
  sand: 'sand',
  red_sand: 'sand',
  gravel: 'gravel',
  oak_log: 'wood',
  oak_planks: 'wood',
  oak_leaves: 'grass',
  wool: 'wool',
  iron_block: 'metal',
  glass: 'glass',
  basalt: 'basalt',
  sculk: 'sculk',
  amethyst_block: 'amethyst',
  mud: 'mud',
  snow_block: 'snow',
  powder_snow: 'powder_snow',
};

export function soundGroupFor(id: string): SoundGroup {
  return GROUP_MAP[id] ?? 'stone';
}

export function stepSound(group: SoundGroup): string {
  return `block.${group}.step`;
}

export function breakSound(group: SoundGroup): string {
  return `block.${group}.break`;
}

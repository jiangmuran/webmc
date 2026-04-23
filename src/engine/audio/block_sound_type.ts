// Block sound type groups. Each block maps to {place, break, step, hit, fall}.

export type BlockSoundGroup =
  | 'wood'
  | 'stone'
  | 'dirt'
  | 'grass'
  | 'sand'
  | 'gravel'
  | 'wool'
  | 'metal'
  | 'glass'
  | 'snow'
  | 'ladder'
  | 'slime'
  | 'honey'
  | 'powder_snow'
  | 'anvil'
  | 'amethyst'
  | 'copper';

export interface SoundIds {
  place: string;
  break: string;
  step: string;
  hit: string;
  fall: string;
}

export function soundsFor(group: BlockSoundGroup): SoundIds {
  return {
    place: `block.${group}.place`,
    break: `block.${group}.break`,
    step: `block.${group}.step`,
    hit: `block.${group}.hit`,
    fall: `block.${group}.fall`,
  };
}

export function groupFor(blockId: string): BlockSoundGroup {
  if (blockId.endsWith('_log') || blockId.endsWith('_planks')) return 'wood';
  if (blockId === 'stone' || blockId.endsWith('stone_bricks')) return 'stone';
  if (blockId === 'grass_block') return 'grass';
  if (
    blockId === 'dirt' ||
    blockId === 'coarse_dirt' ||
    blockId === 'podzol' ||
    blockId === 'mycelium'
  )
    return 'dirt';
  if (blockId === 'sand' || blockId === 'red_sand') return 'sand';
  if (blockId === 'gravel') return 'gravel';
  if (blockId.endsWith('_wool')) return 'wool';
  if (blockId === 'iron_block' || blockId === 'gold_block' || blockId === 'netherite_block')
    return 'metal';
  if (blockId === 'glass' || blockId.endsWith('_glass')) return 'glass';
  if (blockId === 'snow' || blockId === 'snow_block') return 'snow';
  return 'stone';
}

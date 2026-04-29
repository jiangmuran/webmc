// Note block. Pitch cycles 0..24 on right-click. Instrument determined
// by block below.

export const NOTES = 25;

export type Instrument =
  | 'harp'
  | 'bass'
  | 'basedrum'
  | 'snare'
  | 'hat'
  | 'guitar'
  | 'flute'
  | 'bell'
  | 'chime'
  | 'xylophone'
  | 'iron_xylophone'
  | 'cow_bell'
  | 'didgeridoo'
  | 'bit'
  | 'banjo'
  | 'pling';

export function pitchCycle(current: number): number {
  return (current + 1) % NOTES;
}

// Wiki: note block instruments check by block category, not exact name.
// Was over-restrictive — bass only matched oak (other wood types fell
// to harp), basedrum only matched 3 stone variants (deepslate/basalt
// silently fell to harp), etc.
export function instrumentForBelow(below: string): Instrument {
  if (below.includes('wool')) return 'guitar';
  if (below === 'sand' || below === 'red_sand' || below === 'gravel') return 'snare';
  // Wood family: every log/planks/wood type (including stripped) → bass.
  if (
    below.endsWith('_log') ||
    below.endsWith('_planks') ||
    below.endsWith('_wood') ||
    below.includes('bamboo_block')
  ) {
    return 'bass';
  }
  // Glass family: stained glass + sea_lantern + beacon + conduit → hat.
  if (below.includes('glass') || below === 'sea_lantern' || below === 'beacon') return 'hat';
  // Stone family: stone, cobblestone, deepslate, basalt, blackstone,
  // andesite/granite/diorite, end_stone, netherrack, ores → basedrum.
  if (
    below === 'stone' ||
    below === 'cobblestone' ||
    below === 'obsidian' ||
    below === 'crying_obsidian' ||
    below.startsWith('deepslate') ||
    below.startsWith('basalt') ||
    below === 'smooth_basalt' ||
    below === 'blackstone' ||
    below === 'andesite' ||
    below === 'granite' ||
    below === 'diorite' ||
    below === 'end_stone' ||
    below === 'netherrack' ||
    below === 'magma_block' ||
    below.endsWith('_ore')
  ) {
    return 'basedrum';
  }
  if (below === 'clay') return 'flute';
  if (below === 'gold_block' || below === 'gold_ore') return 'bell';
  if (
    below === 'packed_ice' ||
    below === 'ice' ||
    below === 'blue_ice' ||
    below === 'frosted_ice'
  ) {
    return 'chime';
  }
  if (below === 'bone_block') return 'xylophone';
  if (below === 'iron_block' || below === 'iron_ore') return 'iron_xylophone';
  if (below === 'soul_sand') return 'cow_bell';
  if (below === 'pumpkin' || below === 'carved_pumpkin' || below === 'jack_o_lantern') {
    return 'didgeridoo';
  }
  if (below === 'emerald_block' || below === 'emerald_ore') return 'bit';
  if (below === 'hay_block') return 'banjo';
  if (below === 'glowstone') return 'pling';
  return 'harp';
}

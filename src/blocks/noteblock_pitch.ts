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

export function instrumentForBelow(below: string): Instrument {
  if (below === 'wool') return 'guitar';
  if (below === 'sand' || below === 'red_sand') return 'snare';
  if (below === 'glass') return 'hat';
  if (below === 'stone' || below === 'obsidian' || below === 'cobblestone') return 'basedrum';
  if (below === 'oak_log' || below === 'oak_planks') return 'bass';
  if (below === 'clay') return 'flute';
  if (below === 'gold_block') return 'bell';
  if (below === 'packed_ice' || below === 'ice') return 'chime';
  if (below === 'bone_block') return 'xylophone';
  if (below === 'iron_block') return 'iron_xylophone';
  if (below === 'soul_sand') return 'cow_bell';
  if (below === 'pumpkin') return 'didgeridoo';
  if (below === 'emerald_block') return 'bit';
  if (below === 'hay_block') return 'banjo';
  if (below === 'glowstone') return 'pling';
  return 'harp';
}

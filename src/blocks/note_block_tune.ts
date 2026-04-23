export const NOTE_COUNT = 25;

export function tune(current: number, rightClicks = 1): number {
  return (((current + rightClicks) % NOTE_COUNT) + NOTE_COUNT) % NOTE_COUNT;
}

export function pitch(note: number): number {
  return Math.pow(2, (note - 12) / 12);
}

export type NoteInstrument =
  | 'harp'
  | 'bass'
  | 'basedrum'
  | 'snare'
  | 'hat'
  | 'bell'
  | 'flute'
  | 'chime'
  | 'guitar'
  | 'xylophone'
  | 'iron_xylophone'
  | 'cow_bell'
  | 'didgeridoo'
  | 'bit'
  | 'banjo'
  | 'pling';

export function instrumentForBelow(block: string): NoteInstrument {
  if (block === 'gold_block') return 'bell';
  if (block === 'clay') return 'flute';
  if (block === 'packed_ice') return 'chime';
  if (block === 'wool') return 'guitar';
  if (block === 'bone_block') return 'xylophone';
  if (block === 'iron_block') return 'iron_xylophone';
  if (block === 'soul_sand') return 'cow_bell';
  if (block === 'pumpkin') return 'didgeridoo';
  if (block === 'emerald_block') return 'bit';
  if (block === 'hay_block') return 'banjo';
  if (block === 'glowstone') return 'pling';
  if (block === 'stone') return 'basedrum';
  if (block === 'sand' || block === 'gravel') return 'snare';
  if (block === 'glass') return 'hat';
  if (block.endsWith('_log') || block.endsWith('_planks')) return 'bass';
  return 'harp';
}

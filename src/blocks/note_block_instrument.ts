export type Instrument =
  | 'harp'
  | 'bass'
  | 'snare'
  | 'hat'
  | 'basedrum'
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

const BY_BLOCK: Record<string, Instrument> = {
  air: 'harp',
  wood: 'bass',
  wool: 'guitar',
  sand: 'snare',
  glass: 'hat',
  stone: 'basedrum',
  gold: 'bell',
  clay: 'flute',
  packed_ice: 'chime',
  bone_block: 'xylophone',
  iron_block: 'iron_xylophone',
  soul_sand: 'cow_bell',
  pumpkin: 'didgeridoo',
  emerald_block: 'bit',
  hay_block: 'banjo',
  glowstone: 'pling',
};

export function instrumentForBlockAbove(block: string): Instrument {
  return BY_BLOCK[block] ?? 'harp';
}

export function notePitch(note: number): number {
  const n = Math.max(0, Math.min(24, note));
  return Math.pow(2, (n - 12) / 12);
}

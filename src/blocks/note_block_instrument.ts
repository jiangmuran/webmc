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

// Wiki (minecraft.wiki/w/Note_Block): the instrument is determined by
// the block BELOW the note block (the block above must be air or
// non-solid for the block to play). Old name `instrumentForBlockAbove`
// inverted the relationship in the API surface; kept the alias for
// backward compatibility.
export function instrumentForBlockBelow(block: string): Instrument {
  return BY_BLOCK[block] ?? 'harp';
}

/** @deprecated Wiki: instrument is selected by the block BELOW.
 * Use {@link instrumentForBlockBelow}. */
export function instrumentForBlockAbove(block: string): Instrument {
  return instrumentForBlockBelow(block);
}

export function notePitch(note: number): number {
  const n = Math.max(0, Math.min(24, note));
  return Math.pow(2, (n - 12) / 12);
}

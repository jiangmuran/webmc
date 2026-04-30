// Note block — a 25-note instrument with pitch set by the redstone power
// flowing through it + the block above it. Right-clicking cycles the pitch;
// a redstone edge plays the current note.

export type NoteInstrument =
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

export interface NoteBlockState {
  note: number; // 0..24 (2 octaves, F#3 to F#5)
  instrument: NoteInstrument;
}

// Wiki (minecraft.wiki/w/Note_Block): "The instrument played is
// determined by the block directly BELOW the note block." Old
// parameter was named `aboveBlockName` and the comment claimed
// "block-above" — inverted from wiki. Siblings note_block_tuning.ts
// and noteblock_pitch.ts already key on the block-below.
export function instrumentFor(belowBlockName: string | null): NoteInstrument {
  if (!belowBlockName) return 'harp';
  const map: Record<string, NoteInstrument> = {
    'webmc:wool_white': 'guitar',
    'webmc:wool_red': 'guitar',
    'webmc:wool_blue': 'guitar',
    'webmc:oak_planks': 'bass',
    'webmc:oak_log': 'bass',
    'webmc:sand': 'snare',
    'webmc:gravel': 'snare',
    'webmc:glass': 'hat',
    'webmc:stone': 'basedrum',
    'webmc:cobblestone': 'basedrum',
    'webmc:gold_block': 'bell',
    'webmc:clay': 'flute',
    'webmc:packed_ice': 'chime',
    'webmc:bone_block': 'xylophone',
    'webmc:iron_block': 'iron_xylophone',
    'webmc:soul_sand': 'cow_bell',
    'webmc:pumpkin': 'didgeridoo',
    'webmc:emerald_block': 'bit',
    'webmc:hay_block': 'banjo',
    'webmc:glowstone': 'pling',
  };
  return map[belowBlockName] ?? 'harp';
}

// Wiki (minecraft.wiki/w/Note_Block): the 25-note range is F#3 (185 Hz)
// at note=0 to F#5 (740 Hz) at note=24. Old formula
// `440 * 2^((n-12)/12)` placed n=12 at A4 (440 Hz) instead of F#4
// (370 Hz), so every produced frequency was ~19% high. Sibling
// note_block_tuning.ts already uses the F#3-anchored 185 Hz base.
export function noteFrequency(note: number): number {
  const n = Math.max(0, Math.min(24, note));
  return 185 * Math.pow(2, n / 12);
}

export function cycleNote(state: NoteBlockState): void {
  state.note = (state.note + 1) % 25;
}

export function makeNoteBlock(): NoteBlockState {
  return { note: 0, instrument: 'harp' };
}

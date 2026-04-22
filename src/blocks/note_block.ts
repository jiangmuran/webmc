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

// Block-above → instrument. Matches MC's lookup table.
export function instrumentFor(aboveBlockName: string | null): NoteInstrument {
  if (!aboveBlockName) return 'harp';
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
  return map[aboveBlockName] ?? 'harp';
}

// Frequency in Hz for a given note (0 = F#3).
export function noteFrequency(note: number): number {
  const n = Math.max(0, Math.min(24, note));
  // MC: pitch = 2^((note - 12) / 12), base freq ≈ 440 at note=12 (A4 ish).
  return 440 * Math.pow(2, (n - 12) / 12);
}

export function cycleNote(state: NoteBlockState): void {
  state.note = (state.note + 1) % 25;
}

export function makeNoteBlock(): NoteBlockState {
  return { note: 0, instrument: 'harp' };
}

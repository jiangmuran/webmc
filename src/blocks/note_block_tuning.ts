// Note block tuning. Right-click cycles through 25 semitones (F#3 to
// F#5). Instrument is chosen by the block directly BELOW the note block.

export const MAX_NOTE = 24;

// MIDI-like semitone 0..24 → (octave, noteName)
const NOTE_NAMES = ['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'] as const;

// Wiki (minecraft.wiki/w/Note_Block): "Notes range from F#3 (semitone
// 0) through F#5 (semitone 24)." The chromatic scale crosses an
// octave boundary at B→C: F#3, G3, ..., B3, C4, ..., F4, F#4, ..., B4,
// C5, ..., F5, F#5. Old `octave = n < 12 ? 3 : 4` ignored that the
// B→C transition at semitone 6 also bumps the octave, so e.g.
// semitone 6 ("C") was labeled "C3" instead of the wiki-canonical
// "C4". Now uses `floor((n + 6) / 12)` to track each octave bump.
export function noteLabel(n: number): string {
  const clamped = Math.max(0, Math.min(MAX_NOTE, n));
  const name = NOTE_NAMES[clamped % 12] ?? 'F#';
  const octave = 3 + Math.floor((clamped + 6) / 12);
  return `${name}${octave}`;
}

export function nextNote(n: number): number {
  return (n + 1) % (MAX_NOTE + 1);
}

// Wiki (minecraft.wiki/w/Note_Block): canonical instrument IDs match the
// `block.note_block.<name>` sound events — `harp` (default), `basedrum`
// (one word, no underscore), `bit`, etc. Old code used `piano` for the
// default and `bass_drum` for stone-family blocks; sibling
// note_block_instrument.ts already uses the canonical names.
export type Instrument =
  | 'harp'
  | 'bass'
  | 'snare'
  | 'hat'
  | 'basedrum'
  | 'flute'
  | 'bell'
  | 'guitar'
  | 'chime'
  | 'xylophone'
  | 'pling'
  | 'banjo'
  | 'didgeridoo'
  | 'iron_xylophone'
  | 'cow_bell'
  | 'bit';

const INSTRUMENT_BELOW: Record<string, Instrument> = {
  'webmc:sand': 'snare',
  'webmc:red_sand': 'snare',
  'webmc:gravel': 'snare',
  'webmc:glass': 'hat',
  'webmc:stone': 'basedrum',
  'webmc:obsidian': 'basedrum',
  'webmc:netherrack': 'basedrum',
  'webmc:clay': 'flute',
  'webmc:gold_block': 'bell',
  'webmc:wool': 'guitar',
  'webmc:packed_ice': 'chime',
  'webmc:bone_block': 'xylophone',
  'webmc:iron_block': 'iron_xylophone',
  'webmc:soul_sand': 'cow_bell',
  'webmc:pumpkin': 'didgeridoo',
  'webmc:emerald_block': 'bit',
  'webmc:hay_block': 'banjo',
  'webmc:glowstone': 'pling',
};

export function instrumentBelow(blockId: string): Instrument {
  // wood family defaults to bass
  if (blockId.endsWith('_log') || blockId.endsWith('_planks')) return 'bass';
  return INSTRUMENT_BELOW[blockId] ?? 'harp';
}

// Frequency lookup: F#3 = 185 Hz, each semitone = *2^(1/12)
export function frequencyHz(n: number): number {
  return 185 * Math.pow(2, n / 12);
}

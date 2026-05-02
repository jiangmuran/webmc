// Wiki (minecraft.wiki/w/Note_Block): note 0 = F#3 (~185 Hz), note 12
// = F#4 (~370 Hz), note 24 = F#5 (~740 Hz). Old formula used 440 Hz
// (A4) as the reference at note 12, which made every emitted
// frequency a perfect-third (4 semitones) above the wiki value: a
// note block tuned to "F#4" actually played A4. The label table
// always pointed at F# tones, so frequency↔label disagreed.
const FSHARP3_HZ = 185;

export function noteIndexToFrequency(note: number): number {
  return FSHARP3_HZ * Math.pow(2, note / 12);
}

export function noteIndexToSemitones(note: number): number {
  return note - 12;
}

export function noteIndexLabel(note: number): string {
  const labels = [
    'F#3',
    'G3',
    'G#3',
    'A3',
    'A#3',
    'B3',
    'C4',
    'C#4',
    'D4',
    'D#4',
    'E4',
    'F4',
    'F#4',
    'G4',
    'G#4',
    'A4',
    'A#4',
    'B4',
    'C5',
    'C#5',
    'D5',
    'D#5',
    'E5',
    'F5',
    'F#5',
  ];
  return labels[note] ?? '';
}

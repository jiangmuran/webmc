export function noteIndexToFrequency(note: number): number {
  const a4 = 440;
  return a4 * Math.pow(2, (note - 12) / 12);
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

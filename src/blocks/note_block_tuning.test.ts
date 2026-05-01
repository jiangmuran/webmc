import { describe, it, expect } from 'vitest';
import { noteLabel, nextNote, instrumentBelow, frequencyHz, MAX_NOTE } from './note_block_tuning';

describe('note block', () => {
  it('note 0 = F#3', () => {
    expect(noteLabel(0)).toBe('F#3');
  });

  it('octave bumps at B→C transition (wiki: full F#3..F#5 range)', () => {
    // Wiki (minecraft.wiki/w/Note_Block): "Notes range from F#3
    // (semitone 0) through F#5 (semitone 24)."
    expect(noteLabel(5)).toBe('B3'); // last semitone in octave 3
    expect(noteLabel(6)).toBe('C4'); // octave bumps at B→C
    expect(noteLabel(11)).toBe('F4'); // last in octave-4-ish window
    expect(noteLabel(12)).toBe('F#4'); // exactly one octave above F#3
    expect(noteLabel(17)).toBe('B4');
    expect(noteLabel(18)).toBe('C5'); // octave bumps again
    expect(noteLabel(24)).toBe('F#5'); // top of range
  });

  it('next wraps', () => {
    expect(nextNote(MAX_NOTE)).toBe(0);
    expect(nextNote(0)).toBe(1);
  });

  it('instrument by below (default harp, wiki)', () => {
    expect(instrumentBelow('webmc:sand')).toBe('snare');
    expect(instrumentBelow('webmc:oak_planks')).toBe('bass');
    expect(instrumentBelow('webmc:dirt')).toBe('harp');
    expect(instrumentBelow('webmc:stone')).toBe('basedrum');
  });

  it('frequency 12 semitones = 2×', () => {
    expect(frequencyHz(12) / frequencyHz(0)).toBeCloseTo(2, 5);
  });
});

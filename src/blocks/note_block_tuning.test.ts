import { describe, it, expect } from 'vitest';
import { noteLabel, nextNote, instrumentBelow, frequencyHz, MAX_NOTE } from './note_block_tuning';

describe('note block', () => {
  it('note 0 = F#3', () => {
    expect(noteLabel(0)).toBe('F#3');
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

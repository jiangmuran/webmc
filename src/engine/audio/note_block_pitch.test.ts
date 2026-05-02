import { describe, it, expect } from 'vitest';
import { noteIndexToFrequency, noteIndexToSemitones, noteIndexLabel } from './note_block_pitch';

describe('note block pitch', () => {
  it('middle note is F#4 ≈ 370 Hz (wiki, not A4 = 440)', () => {
    // Wiki (minecraft.wiki/w/Note_Block): note 12 is F#4. Old code
    // returned A4 (440 Hz) — a perfect-third too high — so labels
    // and frequencies disagreed.
    expect(noteIndexToFrequency(12)).toBeCloseTo(370, 0);
  });

  it('note 0 = F#3 ≈ 185 Hz', () => {
    expect(noteIndexToFrequency(0)).toBeCloseTo(185, 0);
  });

  it('note 24 = F#5 ≈ 740 Hz (octave up doubles)', () => {
    expect(noteIndexToFrequency(24)).toBeCloseTo(740, 0);
  });

  it('semitone offset zero at middle', () => {
    expect(noteIndexToSemitones(12)).toBe(0);
  });

  it('label F#3 at 0', () => {
    expect(noteIndexLabel(0)).toBe('F#3');
  });

  it('label F#5 at 24', () => {
    expect(noteIndexLabel(24)).toBe('F#5');
  });

  it('out of range empty label', () => {
    expect(noteIndexLabel(99)).toBe('');
  });
});

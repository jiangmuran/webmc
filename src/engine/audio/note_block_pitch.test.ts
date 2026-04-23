import { describe, it, expect } from 'vitest';
import { noteIndexToFrequency, noteIndexToSemitones, noteIndexLabel } from './note_block_pitch';

describe('note block pitch', () => {
  it('middle note is A4', () => {
    expect(noteIndexToFrequency(12)).toBeCloseTo(440);
  });

  it('octave up doubles', () => {
    expect(noteIndexToFrequency(24)).toBeCloseTo(880);
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

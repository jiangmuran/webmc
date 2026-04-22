import { describe, it, expect } from 'vitest';
import { cycleNote, instrumentFor, makeNoteBlock, noteFrequency } from './note_block';

describe('note block', () => {
  it('defaults to note 0 + harp', () => {
    const n = makeNoteBlock();
    expect(n.note).toBe(0);
    expect(n.instrument).toBe('harp');
  });

  it('cycleNote wraps from 24 to 0', () => {
    const n = makeNoteBlock();
    for (let i = 0; i < 25; i++) cycleNote(n);
    expect(n.note).toBe(0);
  });

  it('instrumentFor resolves wool → guitar', () => {
    expect(instrumentFor('webmc:wool_red')).toBe('guitar');
  });

  it('instrumentFor resolves glowstone → pling', () => {
    expect(instrumentFor('webmc:glowstone')).toBe('pling');
  });

  it('unknown block → harp', () => {
    expect(instrumentFor('webmc:unknown')).toBe('harp');
    expect(instrumentFor(null)).toBe('harp');
  });

  it('noteFrequency scales an octave every 12 notes', () => {
    const f0 = noteFrequency(0);
    const f12 = noteFrequency(12);
    expect(f12 / f0).toBeCloseTo(2, 1);
  });

  it('notes clamp to 0-24 range', () => {
    expect(noteFrequency(-5)).toBe(noteFrequency(0));
    expect(noteFrequency(99)).toBe(noteFrequency(24));
  });
});

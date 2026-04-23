import { describe, it, expect } from 'vitest';
import { instrumentForBlockAbove, notePitch } from './note_block_instrument';

describe('note block instrument', () => {
  it('wood = bass', () => {
    expect(instrumentForBlockAbove('wood')).toBe('bass');
  });

  it('default harp', () => {
    expect(instrumentForBlockAbove('grass_block')).toBe('harp');
  });

  it('pitch doubles per octave', () => {
    expect(notePitch(24)).toBeCloseTo(notePitch(12) * 2);
  });

  it('pitch clamps', () => {
    expect(notePitch(100)).toBe(notePitch(24));
    expect(notePitch(-5)).toBe(notePitch(0));
  });
});

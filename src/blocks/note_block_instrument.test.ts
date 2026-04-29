import { describe, it, expect } from 'vitest';
import { instrumentForBlockBelow, notePitch } from './note_block_instrument';

describe('note block instrument', () => {
  it('wood = bass', () => {
    expect(instrumentForBlockBelow('wood')).toBe('bass');
  });

  it('default harp', () => {
    expect(instrumentForBlockBelow('grass_block')).toBe('harp');
  });

  it('pitch doubles per octave', () => {
    expect(notePitch(24)).toBeCloseTo(notePitch(12) * 2);
  });

  it('pitch clamps', () => {
    expect(notePitch(100)).toBe(notePitch(24));
    expect(notePitch(-5)).toBe(notePitch(0));
  });
});

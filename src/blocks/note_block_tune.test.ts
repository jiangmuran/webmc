import { describe, it, expect } from 'vitest';
import { tune, pitch, instrumentForBelow, NOTE_COUNT } from './note_block_tune';

describe('note block tune', () => {
  it('tune increments', () => {
    expect(tune(0)).toBe(1);
  });

  it('wraps around at 25', () => {
    expect(tune(NOTE_COUNT - 1)).toBe(0);
  });

  it('middle note is pitch 1', () => {
    expect(pitch(12)).toBeCloseTo(1);
  });

  it('gold below → bell', () => {
    expect(instrumentForBelow('gold_block')).toBe('bell');
  });

  it('oak planks → bass', () => {
    expect(instrumentForBelow('oak_planks')).toBe('bass');
  });

  it('default air-ish → harp', () => {
    expect(instrumentForBelow('dirt')).toBe('harp');
  });
});

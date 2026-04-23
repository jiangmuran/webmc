import { describe, it, expect } from 'vitest';
import { pitchCycle, instrumentForBelow, NOTES } from './noteblock_pitch';

describe('noteblock pitch', () => {
  it('increments', () => {
    expect(pitchCycle(0)).toBe(1);
  });

  it('wraps', () => {
    expect(pitchCycle(NOTES - 1)).toBe(0);
  });

  it('wool guitar', () => {
    expect(instrumentForBelow('wool')).toBe('guitar');
  });

  it('stone basedrum', () => {
    expect(instrumentForBelow('stone')).toBe('basedrum');
  });

  it('default harp', () => {
    expect(instrumentForBelow('air')).toBe('harp');
  });

  it('glowstone pling', () => {
    expect(instrumentForBelow('glowstone')).toBe('pling');
  });
});

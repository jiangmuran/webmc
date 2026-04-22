import { describe, it, expect } from 'vitest';
import { rollNaturalColor, breedColor } from './sheep_color_weight';

describe('sheep color', () => {
  it('mostly white', () => {
    expect(rollNaturalColor(() => 0.5)).toBe('white');
  });

  it('black at tail', () => {
    expect(rollNaturalColor(() => 0.85)).toBe('black');
  });

  it('pink rare', () => {
    expect(rollNaturalColor(() => 0.9999)).toBe('pink');
  });

  it('deterministic', () => {
    expect(rollNaturalColor(() => 0.3)).toBe(rollNaturalColor(() => 0.3));
  });

  it('breed same returns same', () => {
    expect(breedColor('red' as never, 'red' as never, () => 0)).toBe('red');
  });

  it('breed different picks one', () => {
    expect(breedColor('red' as never, 'blue' as never, () => 0)).toBe('red');
    expect(breedColor('red' as never, 'blue' as never, () => 0.99)).toBe('blue');
  });
});

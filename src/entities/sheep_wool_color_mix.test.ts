import { describe, it, expect } from 'vitest';
import { mixedOffspring } from './sheep_wool_color_mix';

describe('sheep wool color mix', () => {
  it('blue + yellow = green', () => {
    expect(mixedOffspring('blue', 'yellow')).toBe('green');
  });

  it('red + white = pink', () => {
    expect(mixedOffspring('red', 'white')).toBe('pink');
  });

  it('same color keeps', () => {
    expect(mixedOffspring('black', 'black')).toBe('black');
  });

  it('unknown mix falls back to first', () => {
    expect(mixedOffspring('cyan', 'brown')).toBe('cyan');
  });
});

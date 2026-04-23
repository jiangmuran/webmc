import { describe, it, expect } from 'vitest';
import {
  breakingOneBreaksPair,
  opensWithAdjacentDouble,
  iconRendersAsOpen,
} from './door_pair_split';

describe('door pair split', () => {
  const left = {
    half: 'lower' as const,
    facing: 'north' as const,
    hinge: 'left' as const,
    open: false,
  };
  const right = {
    half: 'lower' as const,
    facing: 'north' as const,
    hinge: 'right' as const,
    open: false,
  };

  it('double opens with opposite hinge', () => {
    expect(opensWithAdjacentDouble(left, right)).toBe(true);
  });

  it('same hinge does not pair', () => {
    expect(opensWithAdjacentDouble(left, { ...left })).toBe(false);
  });

  it('icon open tracks state', () => {
    expect(iconRendersAsOpen({ ...left, open: true })).toBe(true);
  });

  it('cascade break', () => {
    expect(breakingOneBreaksPair()).toBe(true);
  });
});

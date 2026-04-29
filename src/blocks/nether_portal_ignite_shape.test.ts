import { describe, it, expect } from 'vitest';
import {
  isValidShape,
  interiorBlocks,
  frameBlocksNeeded,
  MAX_WIDTH,
  MAX_HEIGHT,
  MIN_WIDTH,
} from './nether_portal_ignite_shape';

describe('nether portal ignite shape', () => {
  it('standard 2x3 valid', () => {
    expect(isValidShape({ axis: 'x', width: 2, height: 3 })).toBe(true);
  });

  it('too small rejected', () => {
    expect(isValidShape({ axis: 'x', width: 1, height: 3 })).toBe(false);
  });

  it('too big rejected', () => {
    expect(isValidShape({ axis: 'x', width: MAX_WIDTH + 1, height: 3 })).toBe(false);
  });

  it('height too small', () => {
    expect(isValidShape({ axis: 'x', width: 2, height: 2 })).toBe(false);
  });

  it('max valid', () => {
    expect(isValidShape({ axis: 'z', width: MAX_WIDTH, height: MAX_HEIGHT })).toBe(true);
  });

  it('interior area correct', () => {
    expect(interiorBlocks({ axis: 'x', width: 2, height: 3 })).toBe(6);
  });

  it('frame count standard (wiki: 10 obsidian for 2×3, corners optional)', () => {
    // 2W + 2H = 4 + 6 = 10 (corners not required to be obsidian per wiki)
    expect(frameBlocksNeeded({ axis: 'x', width: MIN_WIDTH, height: 3 })).toBe(10);
  });
});

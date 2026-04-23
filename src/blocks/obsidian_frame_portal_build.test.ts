import { describe, it, expect } from 'vitest';
import { isValidFrame, innerArea } from './obsidian_frame_portal_build';

describe('obsidian frame portal build', () => {
  it('4x5 valid', () => {
    expect(isValidFrame({ width: 4, height: 5 })).toBe(true);
  });

  it('3x5 too narrow', () => {
    expect(isValidFrame({ width: 3, height: 5 })).toBe(false);
  });

  it('inner area 2x3', () => {
    expect(innerArea({ width: 4, height: 5 })).toBe(6);
  });

  it('invalid 0 area', () => {
    expect(innerArea({ width: 100, height: 100 })).toBe(0);
  });
});

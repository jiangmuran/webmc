import { describe, it, expect } from 'vitest';
import {
  pyramidLevel,
  maxRangeForLevel,
  canPickSecondary,
  PRIMARY_BY_LEVEL,
} from './beacon_pyramid';

describe('beacon pyramid', () => {
  it('no fuel = 0', () => {
    const lvl = pyramidLevel({ at: () => 'webmc:air', bx: 0, by: 10, bz: 0 });
    expect(lvl).toBe(0);
  });

  it('1 layer below of iron = 1', () => {
    const at = (_x: number, y: number, _z: number) => (y === 9 ? 'webmc:iron_block' : 'webmc:air');
    expect(pyramidLevel({ at, bx: 0, by: 10, bz: 0 })).toBe(1);
  });

  it('full 4-layer pyramid of gold = 4', () => {
    const at = () => 'webmc:gold_block';
    expect(pyramidLevel({ at, bx: 0, by: 20, bz: 0 })).toBe(4);
  });

  it('range scales', () => {
    expect(maxRangeForLevel(0)).toBe(0);
    expect(maxRangeForLevel(1)).toBe(20);
    expect(maxRangeForLevel(4)).toBe(50);
  });

  it('secondary at level 4', () => {
    expect(canPickSecondary(3)).toBe(false);
    expect(canPickSecondary(4)).toBe(true);
  });

  it('primary options grow with level', () => {
    expect(PRIMARY_BY_LEVEL[1]).toContain('speed');
    expect(PRIMARY_BY_LEVEL[3]).toContain('strength');
  });
});

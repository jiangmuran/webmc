import { describe, it, expect } from 'vitest';
import { toNether, toOverworld, searchRadiusBlocks, NETHER_RATIO } from './portal_linking_ratio';

describe('portal linking ratio', () => {
  it('8:1 to nether', () => {
    expect(toNether({ x: 80, y: 64, z: 80 })).toEqual({ x: 10, y: 64, z: 10 });
  });

  it('reverse 1:8', () => {
    expect(toOverworld({ x: 10, y: 64, z: 10 })).toEqual({ x: 80, y: 64, z: 80 });
  });

  it('y preserved', () => {
    expect(toNether({ x: 0, y: 100, z: 0 }).y).toBe(100);
  });

  it('nether search smaller', () => {
    expect(searchRadiusBlocks('nether')).toBeLessThan(searchRadiusBlocks('overworld'));
  });

  it('ratio is 8', () => {
    expect(NETHER_RATIO).toBe(8);
  });

  it('negative coords handled', () => {
    expect(toNether({ x: -64, y: 64, z: -64 })).toEqual({ x: -8, y: 64, z: -8 });
  });
});

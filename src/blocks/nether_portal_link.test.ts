import { describe, it, expect } from 'vitest';
import { mappedCoords, searchRadius, yClampNether } from './nether_portal_link';

describe('nether portal link', () => {
  it('overworld → nether div 8', () => {
    expect(mappedCoords('overworld', { x: 800, z: 800 })).toEqual({ x: 100, z: 100 });
  });

  it('nether → overworld mul 8', () => {
    expect(mappedCoords('nether', { x: 100, z: 100 })).toEqual({ x: 800, z: 800 });
  });

  it('search radius 128', () => {
    expect(searchRadius()).toBe(128);
  });

  it('nether Y clamps to roof', () => {
    expect(yClampNether(-5)).toBe(0);
    expect(yClampNether(200)).toBe(127);
    expect(yClampNether(64)).toBe(64);
  });
});

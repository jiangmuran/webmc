import { describe, it, expect } from 'vitest';
import {
  breakInfested,
  countNearbyInfested,
  disguiseOf,
  INFESTED_DISGUISES,
} from './infested_block';

describe('infested block', () => {
  it('disguise table covers 7 variants', () => {
    expect(Object.keys(INFESTED_DISGUISES).length).toBe(7);
  });

  it('stone disguise maps', () => {
    expect(disguiseOf('webmc:infested_stone')).toBe('webmc:stone');
  });

  it('silk touch drops the infested block', () => {
    const r = breakInfested('webmc:infested_stone', true);
    expect(r.spawnedSilverfish).toBe(false);
    expect(r.drops[0]?.item).toBe('webmc:infested_stone');
  });

  it('no silk touch = silverfish', () => {
    const r = breakInfested('webmc:infested_stone', false);
    expect(r.spawnedSilverfish).toBe(true);
    expect(r.drops.length).toBe(0);
  });

  it('counts nearby infested in radius', () => {
    const n = countNearbyInfested(
      { x: 0, y: 0, z: 0 },
      [
        { x: 1, y: 0, z: 0 },
        { x: 100, y: 0, z: 0 },
        { x: 0, y: 0, z: 2 },
      ],
      () => true,
    );
    expect(n).toBe(2);
  });
});

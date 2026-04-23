import { describe, it, expect } from 'vitest';
import {
  updateOnBedSleep,
  updateOnAnchorCharge,
  isValid,
} from './player_spawn_point_update';

describe('player spawn point update', () => {
  it('bed sets overworld', () => {
    const s = updateOnBedSleep(undefined, { x: 1, y: 64, z: 2 });
    expect(s.dimension).toBe('overworld');
    expect(s.x).toBe(1);
  });

  it('anchor sets nether', () => {
    const s = updateOnAnchorCharge(undefined, { x: 10, y: 60, z: 10 });
    expect(s.dimension).toBe('nether');
    expect(s.anchor).toBe(true);
  });

  it('validity check', () => {
    expect(isValid({ x: 0, y: 0, z: 0, dimension: 'overworld', anchor: false })).toBe(true);
    expect(isValid({ x: NaN, y: 0, z: 0, dimension: 'overworld', anchor: false })).toBe(false);
  });
});

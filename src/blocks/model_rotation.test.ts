import { describe, it, expect } from 'vitest';
import { rotationForFacing, uvOffsetForRotation, rotatedFacing } from './model_rotation';

describe('model rotation', () => {
  it('north = 0', () => {
    expect(rotationForFacing('north')).toBe(0);
  });

  it('east = 90, south = 180, west = 270', () => {
    expect(rotationForFacing('east')).toBe(90);
    expect(rotationForFacing('south')).toBe(180);
    expect(rotationForFacing('west')).toBe(270);
  });

  it('uv offsets unique per rotation', () => {
    const seen = new Set();
    for (const r of [0, 90, 180, 270] as const) seen.add(uvOffsetForRotation(r).dU);
    expect(seen.size).toBe(4);
  });

  it('rotate by 180 flips', () => {
    expect(rotatedFacing('north', 180)).toBe('south');
    expect(rotatedFacing('east', 180)).toBe('west');
  });

  it('rotate 360 identity', () => {
    expect(rotatedFacing('north', 0)).toBe('north');
  });
});

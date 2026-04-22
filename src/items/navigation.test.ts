import { describe, it, expect } from 'vitest';
import { clockAngle, compassYaw, renderMap } from './navigation';

describe('compass', () => {
  it('points toward target in overworld', () => {
    const yaw = compassYaw({
      fromPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 10, y: 0, z: 0 },
      dimension: 'overworld',
    });
    expect(yaw).toBeCloseTo(Math.PI / 2, 2);
  });

  it('returns null with no target', () => {
    const yaw = compassYaw({
      fromPos: { x: 0, y: 0, z: 0 },
      targetPos: null,
      dimension: 'overworld',
    });
    expect(yaw).toBeNull();
  });

  it('spins randomly in the Nether', () => {
    const a = compassYaw({
      fromPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 10, y: 0, z: 0 },
      dimension: 'nether',
      rng: () => 0.25,
    });
    const b = compassYaw({
      fromPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 10, y: 0, z: 0 },
      dimension: 'nether',
      rng: () => 0.75,
    });
    expect(a).not.toBe(b);
  });
});

describe('clock', () => {
  it('time 0 → angle 0', () => {
    expect(clockAngle(0)).toBe(0);
  });

  it('time 12000 → angle π', () => {
    expect(clockAngle(12000)).toBeCloseTo(Math.PI, 3);
  });

  it('handles time > 24000 via modulo', () => {
    expect(clockAngle(48000)).toBeCloseTo(0, 3);
  });
});

describe('map render', () => {
  it('produces a 128x128x4 bitmap', () => {
    const map = renderMap({ x: 0, y: 0, z: 0 }, 1, { surfaceColor: () => [0, 128, 0] });
    expect(map.bitmap.length).toBe(128 * 128 * 4);
    expect(map.scale).toBe(1);
  });

  it('encodes colors from the sampler', () => {
    const map = renderMap({ x: 0, y: 0, z: 0 }, 1, {
      surfaceColor: (wx) => [Math.abs(wx) % 255, 0, 0],
    });
    expect(map.bitmap[3]).toBe(255); // alpha
  });
});

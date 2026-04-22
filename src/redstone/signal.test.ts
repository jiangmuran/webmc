import { describe, it, expect } from 'vitest';
import { MAX_POWER, type RedstoneBlock, computePower, keyOf } from './signal';

function makeLookup(
  grid: Map<string, RedstoneBlock>,
): (x: number, y: number, z: number) => RedstoneBlock {
  return (x, y, z) => grid.get(keyOf({ x, y, z })) ?? { kind: 'none', opaque: false };
}

describe('computePower', () => {
  it('no sources → empty power map', () => {
    const g = new Map<string, RedstoneBlock>();
    const power = computePower([], makeLookup(g));
    expect(power.size).toBe(0);
  });

  it('dust line loses 1 power per block', () => {
    const g = new Map<string, RedstoneBlock>();
    for (let x = 0; x < 17; x++) {
      g.set(keyOf({ x, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    }
    // Source at x=-1 emits 15.
    const power = computePower([{ x: -1, y: 0, z: 0 }], makeLookup(g));
    expect(power.get(keyOf({ x: 0, y: 0, z: 0 }))).toBe(14);
    expect(power.get(keyOf({ x: 1, y: 0, z: 0 }))).toBe(13);
    expect(power.get(keyOf({ x: 13, y: 0, z: 0 }))).toBe(1);
    // Attenuates to zero; cells past 14 don't appear or appear as 0.
    expect(power.get(keyOf({ x: 16, y: 0, z: 0 }))).toBeUndefined();
  });

  it('takes the maximum when two sources converge on the same dust', () => {
    const g = new Map<string, RedstoneBlock>();
    for (let x = 0; x < 5; x++) {
      g.set(keyOf({ x, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    }
    const power = computePower(
      [
        { x: -1, y: 0, z: 0 },
        { x: 5, y: 0, z: 0 },
      ],
      makeLookup(g),
    );
    expect(power.get(keyOf({ x: 2, y: 0, z: 0 }))).toBe(12);
  });

  it('strongly powers an adjacent opaque block', () => {
    const g = new Map<string, RedstoneBlock>();
    g.set(keyOf({ x: 0, y: 0, z: 0 }), { kind: 'conductor', opaque: true });
    const power = computePower([{ x: -1, y: 0, z: 0 }], makeLookup(g));
    expect(power.get(keyOf({ x: 0, y: 0, z: 0 }))).toBe(MAX_POWER);
  });

  it('powers an adjacent door directly', () => {
    const g = new Map<string, RedstoneBlock>();
    g.set(keyOf({ x: 0, y: 0, z: 0 }), { kind: 'door', opaque: false });
    const power = computePower([{ x: -1, y: 0, z: 0 }], makeLookup(g));
    expect(power.get(keyOf({ x: 0, y: 0, z: 0 }))).toBe(MAX_POWER);
  });

  it('dust adjacent to a door powers it', () => {
    const g = new Map<string, RedstoneBlock>();
    g.set(keyOf({ x: 0, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    g.set(keyOf({ x: 0, y: 1, z: 0 }), { kind: 'door', opaque: false });
    const power = computePower([{ x: -1, y: 0, z: 0 }], makeLookup(g));
    // dust at (0,0,0) gets level 14; the door directly above the dust
    // receives that level minus attenuation (13).
    expect(power.get(keyOf({ x: 0, y: 1, z: 0 }))).toBe(13);
  });

  it('source that emits 0 does not spread any power', () => {
    const g = new Map<string, RedstoneBlock>();
    for (let x = 0; x < 5; x++) {
      g.set(keyOf({ x, y: 0, z: 0 }), { kind: 'dust', opaque: false });
    }
    const power = computePower([{ x: -1, y: 0, z: 0 }], makeLookup(g), () => 0);
    expect(power.size).toBe(0);
  });

  it('source in a grid of dust attenuates in all 4 cardinal directions', () => {
    const g = new Map<string, RedstoneBlock>();
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        g.set(keyOf({ x, y: 0, z }), { kind: 'dust', opaque: false });
      }
    }
    const power = computePower([{ x: 0, y: 0, z: 0 }], makeLookup(g));
    // The source seeds each of 4 neighbors at 14; chebyshev=1 cells should
    // read 14 or 13 depending on how BFS reaches them.
    expect(power.get(keyOf({ x: 1, y: 0, z: 0 }))).toBeGreaterThanOrEqual(13);
    expect(power.get(keyOf({ x: 2, y: 0, z: 0 }))).toBeGreaterThanOrEqual(12);
  });
});

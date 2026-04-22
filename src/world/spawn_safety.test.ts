import { describe, it, expect } from 'vitest';
import { bedlessRespawn, findWorldSpawn, type SpawnLookup } from './spawn_safety';

function makeLookup(opts: {
  topY?: (x: number, z: number) => number | null;
  block?: (x: number, y: number, z: number) => string;
  opaque?: (x: number, y: number, z: number) => boolean;
}): SpawnLookup {
  return {
    topSolidY: opts.topY ?? (() => 60),
    blockAt: opts.block ?? (() => 'webmc:grass_block'),
    isOpaque: opts.opaque ?? (() => false),
  };
}

describe('spawn safety', () => {
  it('center grass block is safe', () => {
    const p = findWorldSpawn({ center: { x: 0, z: 0 }, lookup: makeLookup({}), radius: 1 });
    expect(p).toEqual({ x: 0.5, y: 61, z: 0.5 });
  });

  it('skips if top block is unsafe', () => {
    const l = makeLookup({ block: () => 'webmc:lava' });
    expect(findWorldSpawn({ center: { x: 0, z: 0 }, lookup: l, radius: 0 })).toBeNull();
  });

  it('skips if head blocked', () => {
    const l = makeLookup({ opaque: (_, y) => y === 61 });
    expect(findWorldSpawn({ center: { x: 0, z: 0 }, lookup: l, radius: 0 })).toBeNull();
  });

  it('expands outward if center blocked', () => {
    const l = makeLookup({ topY: (x) => (x === 0 ? null : 60) });
    const p = findWorldSpawn({ center: { x: 0, z: 0 }, lookup: l, radius: 2 });
    expect(p).not.toBeNull();
  });

  it('bedless respawn falls back if no candidate', () => {
    const worldSpawn = { x: 0, y: 64, z: 0 };
    const l = makeLookup({ topY: () => null });
    const r = bedlessRespawn(worldSpawn, l, () => 0.5);
    expect(r).toEqual(worldSpawn);
  });

  it('bedless respawn lands on safe block', () => {
    const worldSpawn = { x: 0, y: 64, z: 0 };
    const r = bedlessRespawn(worldSpawn, makeLookup({}), () => 0.5);
    expect(r.y).toBe(61);
  });
});

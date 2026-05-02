import { describe, it, expect } from 'vitest';
import { callSwarm, onInfestedBlockBroken } from './silverfish';

describe('silverfish', () => {
  it('breaking infested stone spawns a silverfish', () => {
    const r = onInfestedBlockBroken('webmc:infested_stone', false);
    expect(r.silverfishSpawned).toBe(true);
    expect(r.dropsBlockVariant).toBeNull();
  });

  it('silk touch keeps the infested variant', () => {
    const r = onInfestedBlockBroken('webmc:infested_deepslate', true);
    expect(r.silverfishSpawned).toBe(false);
    expect(r.dropsBlockVariant).toBe('webmc:infested_deepslate');
  });

  it('swarm call alerts nearby silverfish', () => {
    const r = callSwarm({
      hurtPos: { x: 0, y: 0, z: 0 },
      silverfish: [
        { id: 1, pos: { x: 10, y: 0, z: 0 } },
        { id: 2, pos: { x: 25, y: 0, z: 0 } },
      ],
      infestedBlocks: [],
    });
    expect(r.alertedSilverfishIds).toEqual([1]);
  });

  it('releases infested blocks within 21×11×21 box (wiki)', () => {
    // Wiki (minecraft.wiki/w/Silverfish#Behavior): "...other silverfish
    // within a 21×11×21 area to break out of their infested blocks."
    // Old radius 3 (Euclidean) made stronghold-wall break-outs nearly
    // impossible from a single hit.
    const r = callSwarm({
      hurtPos: { x: 0, y: 0, z: 0 },
      silverfish: [],
      infestedBlocks: [
        { pos: { x: 2, y: 0, z: 0 } }, // close, in box
        { pos: { x: 10, y: 0, z: 0 } }, // edge, in box (±10 horizontal)
        { pos: { x: 11, y: 0, z: 0 } }, // outside box
        { pos: { x: 0, y: 5, z: 0 } }, // edge vertical (±5)
        { pos: { x: 0, y: 6, z: 0 } }, // outside vertical
      ],
    });
    expect(r.releaseInfested.length).toBe(3);
  });

  it('alerts silverfish in 21×11×21 box (wiki)', () => {
    const r = callSwarm({
      hurtPos: { x: 0, y: 0, z: 0 },
      silverfish: [
        { id: 1, pos: { x: 10, y: 0, z: 0 } }, // in
        { id: 2, pos: { x: 11, y: 0, z: 0 } }, // out (>10)
        { id: 3, pos: { x: 0, y: 6, z: 0 } }, // out (>5 vertical)
      ],
      infestedBlocks: [],
    });
    expect(r.alertedSilverfishIds).toEqual([1]);
  });
});

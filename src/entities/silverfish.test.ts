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

  it('releases infested blocks within 3', () => {
    const r = callSwarm({
      hurtPos: { x: 0, y: 0, z: 0 },
      silverfish: [],
      infestedBlocks: [{ pos: { x: 2, y: 0, z: 0 } }, { pos: { x: 10, y: 0, z: 0 } }],
    });
    expect(r.releaseInfested.length).toBe(1);
  });
});

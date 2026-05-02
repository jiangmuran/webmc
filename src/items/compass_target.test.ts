import { describe, it, expect } from 'vitest';
import { bearing, setLodestone } from './compass_target';

describe('compass', () => {
  it('regular points to spawn', () => {
    const b = bearing(
      { kind: 'regular', target: null },
      {
        playerPos: { x: 10, y: 64, z: 0 },
        playerDim: 'overworld',
        worldSpawn: { x: 0, y: 64, z: 0 },
        lastDeathPos: null,
      },
    );
    expect(b).not.toBeNull();
  });

  it('lodestone wrong dim = null', () => {
    const c = { kind: 'lodestone' as const, target: null };
    setLodestone(c, { dim: 'overworld', x: 0, y: 0, z: 0 });
    const b = bearing(c, {
      playerPos: { x: 0, y: 0, z: 0 },
      playerDim: 'nether',
      worldSpawn: { x: 0, y: 0, z: 0 },
      lastDeathPos: null,
    });
    expect(b).toBeNull();
  });

  it('recovery needs death pos', () => {
    const b = bearing(
      { kind: 'recovery', target: null },
      {
        playerPos: { x: 0, y: 0, z: 0 },
        playerDim: 'overworld',
        worldSpawn: { x: 0, y: 0, z: 0 },
        lastDeathPos: null,
      },
    );
    expect(b).toBeNull();
  });

  it('recovery valid', () => {
    const b = bearing(
      { kind: 'recovery', target: null },
      {
        playerPos: { x: 0, y: 0, z: 0 },
        playerDim: 'overworld',
        worldSpawn: { x: 0, y: 0, z: 0 },
        lastDeathPos: { dim: 'overworld', x: 10, y: 0, z: 0 },
      },
    );
    expect(b).toBeCloseTo(Math.PI / 2);
  });

  it('regular spins in nether/end (wiki: no world spawn there)', () => {
    // Wiki (minecraft.wiki/w/Compass): "In the Nether and the End it
    // spins randomly because there is no world spawn." Old behavior
    // pointed at overworld-mapped coords from any dimension.
    const inNether = bearing(
      { kind: 'regular', target: null },
      {
        playerPos: { x: 0, y: 64, z: 0 },
        playerDim: 'nether',
        worldSpawn: { x: 0, y: 64, z: 0 },
        lastDeathPos: null,
      },
    );
    expect(inNether).toBeNull();

    const inEnd = bearing(
      { kind: 'regular', target: null },
      {
        playerPos: { x: 0, y: 64, z: 0 },
        playerDim: 'the_end',
        worldSpawn: { x: 0, y: 64, z: 0 },
        lastDeathPos: null,
      },
    );
    expect(inEnd).toBeNull();
  });
});

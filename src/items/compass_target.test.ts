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
});

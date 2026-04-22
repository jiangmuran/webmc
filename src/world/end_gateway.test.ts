import { describe, it, expect } from 'vitest';
import { makeGateway, pearlTeleport } from './end_gateway';

describe('end gateway', () => {
  it('creates gateway with target 1024 blocks away', () => {
    const g = makeGateway({ x: 0, y: 75, z: 0 }, 0);
    expect(g.targetPosition.x).toBeCloseTo(1024, 0);
  });

  it('pearl through gateway teleports', () => {
    const g = makeGateway({ x: 100, y: 75, z: 100 }, Math.PI / 2);
    const out = pearlTeleport({
      pearlPos: { x: 100, y: 75, z: 100 },
      gateway: g,
    });
    expect(out).not.toBeNull();
    expect(out?.z).toBeCloseTo(1124, 0);
  });

  it('pearl missing the gateway → no teleport', () => {
    const g = makeGateway({ x: 100, y: 75, z: 100 }, 0);
    const out = pearlTeleport({
      pearlPos: { x: 200, y: 75, z: 100 },
      gateway: g,
    });
    expect(out).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { makeVex, tickVex } from './vex';

describe('vex', () => {
  it('chases target', () => {
    const v = makeVex({ x: 0, y: 0, z: 0 }, 42, () => 0.5);
    tickVex(v, {
      dtSec: 0.1,
      summonerAlive: true,
      targetPos: { x: 10, y: 0, z: 0 },
    });
    expect(v.position.x).toBeGreaterThan(0);
  });

  it('expires when summoner dies', () => {
    const v = makeVex({ x: 0, y: 0, z: 0 }, 42, () => 0.5);
    const r = tickVex(v, { dtSec: 0.1, summonerAlive: false, targetPos: null });
    expect(r.expired).toBe(true);
  });

  it('expires after lifetime', () => {
    const v = makeVex({ x: 0, y: 0, z: 0 }, 42, () => 0);
    v.ageSec = 100;
    const r = tickVex(v, { dtSec: 1, summonerAlive: true, targetPos: null });
    expect(r.expired).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { makeTridentEntity, tickTrident } from './trident_track';

describe('trident track', () => {
  it('flies along initial direction', () => {
    const t = makeTridentEntity(1, { x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 'p1');
    tickTrident(t, {
      ownerPos: null,
      isSolid: () => false,
      inWater: false,
      dtSec: 0.1,
    });
    expect(t.position.x).toBeGreaterThan(0);
  });

  it('stuck phase on block hit without loyalty', () => {
    const t = makeTridentEntity(1, { x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 'p1', 0);
    const r = tickTrident(t, {
      ownerPos: null,
      isSolid: () => true,
      inWater: false,
      dtSec: 0.1,
    });
    expect(r.hitBlock).toBe(true);
    expect(t.phase).toBe('stuck');
  });

  it('loyalty triggers return phase', () => {
    const t = makeTridentEntity(1, { x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 'p1', 3);
    tickTrident(t, {
      ownerPos: { x: 0, y: 0, z: 0 },
      isSolid: () => true,
      inWater: false,
      dtSec: 0.1,
    });
    expect(t.phase).toBe('returning');
  });

  it('returning trident reaches owner', () => {
    const t = makeTridentEntity(1, { x: 5, y: 5, z: 5 }, { x: 1, y: 0, z: 0 }, 'p1', 3);
    t.phase = 'returning';
    for (let i = 0; i < 30; i++) {
      const r = tickTrident(t, {
        ownerPos: { x: 0, y: 0, z: 0 },
        isSolid: () => false,
        inWater: false,
        dtSec: 0.1,
      });
      if (r.picked) return;
    }
    throw new Error('trident did not reach owner');
  });

  it('gravity pulls trident down', () => {
    const t = makeTridentEntity(1, { x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 'p1');
    t.velocity = { x: 0, y: 0, z: 0 };
    tickTrident(t, {
      ownerPos: null,
      isSolid: () => false,
      inWater: false,
      dtSec: 1,
    });
    expect(t.velocity.y).toBeLessThan(0);
  });
});

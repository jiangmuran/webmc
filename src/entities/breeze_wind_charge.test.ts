import { describe, it, expect } from 'vitest';
import { computeWindChargePushes, makeWindCharge, tickWindCharge } from './breeze_wind_charge';

describe('breeze wind charge', () => {
  it('travels along velocity', () => {
    const p = makeWindCharge(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 10);
    tickWindCharge(p, { isSolid: () => false, dtSec: 0.1 });
    expect(p.position.x).toBeCloseTo(1);
  });

  it('explodes on solid hit', () => {
    const p = makeWindCharge(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 20);
    const r = tickWindCharge(p, { isSolid: () => true, dtSec: 0.1 });
    expect(r.exploded).toBe(true);
  });

  it('expires after 3 seconds', () => {
    const p = makeWindCharge(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    p.ageSec = 2.9;
    const r = tickWindCharge(p, { isSolid: () => false, dtSec: 0.2 });
    expect(r.exploded).toBe(true);
  });

  it('push magnitude decreases with distance', () => {
    const pushes = computeWindChargePushes({ x: 0, y: 0, z: 0 }, [
      { id: 1, position: { x: 0.2, y: 0, z: 0 } },
      { id: 2, position: { x: 1.3, y: 0, z: 0 } },
    ]);
    expect(pushes.length).toBe(2);
    expect(Math.abs(pushes[0]?.dv.x ?? 0)).toBeGreaterThan(Math.abs(pushes[1]?.dv.x ?? 0));
  });

  it('outside radius = no push', () => {
    const pushes = computeWindChargePushes({ x: 0, y: 0, z: 0 }, [
      { id: 1, position: { x: 10, y: 0, z: 0 } },
    ]);
    expect(pushes).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { makeThrownEgg, tickThrownEgg } from './thrown_egg';

describe('thrown egg', () => {
  it('impacts on solid + sometimes spawns chicks', () => {
    let totalChicks = 0;
    for (let i = 0; i < 10000; i++) {
      const e = makeThrownEgg({ x: 0, y: 10, z: 0 }, { x: 0, y: -1, z: 0 }, 5);
      const r = tickThrownEgg(e, { isSolid: () => true, dtSec: 0.1 }, Math.random);
      totalChicks += r.chicksSpawned;
    }
    // ~1/8 chicken rate → roughly 1250 single chicks.
    expect(totalChicks).toBeGreaterThan(500);
  });

  it('no impact → flies through air', () => {
    const e = makeThrownEgg({ x: 0, y: 10, z: 0 }, { x: 1, y: 0, z: 0 }, 5);
    const r = tickThrownEgg(e, { isSolid: () => false, dtSec: 0.05 });
    expect(r.impacted).toBe(false);
    expect(e.position.x).toBeGreaterThan(0);
  });

  it('expires after 30s', () => {
    const e = makeThrownEgg({ x: 0, y: 10, z: 0 }, { x: 0, y: 0, z: 0 }, 0);
    const r = tickThrownEgg(e, { isSolid: () => false, dtSec: 31 });
    expect(r.expired).toBe(true);
  });
});

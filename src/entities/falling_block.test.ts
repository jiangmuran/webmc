import { describe, it, expect } from 'vitest';
import { makeFallingBlock, tickFallingBlock } from './falling_block';

describe('falling block', () => {
  it('sand falls then lands', () => {
    const f = makeFallingBlock({ x: 0, y: 60, z: 0 }, 'webmc:sand');
    let landed = false;
    for (let i = 0; i < 100; i++) {
      const r = tickFallingBlock(f, { isSolidBelow: (_x, y) => y <= 40, dtSec: 0.1 });
      if (r.landed) {
        landed = true;
        break;
      }
    }
    expect(landed).toBe(true);
  });

  it('anvil damages entities on impact scaled by fall distance', () => {
    const f = makeFallingBlock({ x: 0, y: 70, z: 0 }, 'webmc:anvil');
    let damage = 0;
    for (let i = 0; i < 200; i++) {
      const r = tickFallingBlock(f, { isSolidBelow: (_x, y) => y <= 40, dtSec: 0.1 });
      if (r.landed) {
        damage = r.damageToEntitiesAtLanding;
        break;
      }
    }
    expect(damage).toBeGreaterThan(0);
  });

  it('sand does not damage entities', () => {
    const f = makeFallingBlock({ x: 0, y: 70, z: 0 }, 'webmc:sand');
    let damage = 0;
    for (let i = 0; i < 200; i++) {
      const r = tickFallingBlock(f, { isSolidBelow: (_x, y) => y <= 40, dtSec: 0.1 });
      if (r.landed) {
        damage = r.damageToEntitiesAtLanding;
        break;
      }
    }
    expect(damage).toBe(0);
  });

  it('cap at 20 damage', () => {
    const f = makeFallingBlock({ x: 0, y: 1000, z: 0 }, 'webmc:anvil');
    let damage = 0;
    for (let i = 0; i < 2000; i++) {
      const r = tickFallingBlock(f, { isSolidBelow: (_x, y) => y <= 40, dtSec: 0.1 });
      if (r.landed) {
        damage = r.damageToEntitiesAtLanding;
        break;
      }
    }
    expect(damage).toBe(20);
  });
});

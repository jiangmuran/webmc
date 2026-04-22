import { describe, it, expect } from 'vitest';
import { makeRocket, rocketLifetime, tickRocket } from './firework';

describe('firework', () => {
  it('rocket lifetime scales with gunpowder count', () => {
    const one = rocketLifetime({ gunpowderCount: 1 });
    const three = rocketLifetime({ gunpowderCount: 3 });
    expect(three).toBeGreaterThan(one);
  });

  it('rocket travels upward', () => {
    const r = makeRocket({ gunpowderCount: 1 }, { x: 0, y: 60, z: 0 });
    for (let i = 0; i < 10; i++) tickRocket(r, 1 / 20);
    expect(r.position.y).toBeGreaterThan(60);
  });

  it('detonates after lifetime', () => {
    const r = makeRocket({ gunpowderCount: 1 }, { x: 0, y: 60, z: 0 });
    let detonated = false;
    for (let i = 0; i < 100; i++) {
      const res = tickRocket(r, 0.1);
      if (res.detonated) detonated = true;
    }
    expect(detonated).toBe(true);
  });

  it('boost velocity only present when attached to an elytra player', () => {
    const noPlayer = makeRocket({ gunpowderCount: 1 }, { x: 0, y: 60, z: 0 }, null);
    const withPlayer = makeRocket({ gunpowderCount: 1 }, { x: 0, y: 60, z: 0 }, 42);
    expect(tickRocket(noPlayer, 1 / 20).boostVelocity).toBeNull();
    expect(tickRocket(withPlayer, 1 / 20).boostVelocity).not.toBeNull();
  });
});

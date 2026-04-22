import { describe, it, expect } from 'vitest';
import { makeLingeringCloud, tickCloud } from './lingering_cloud';

describe('lingering cloud', () => {
  it('applies effects to entities inside radius', () => {
    const c = makeLingeringCloud({ x: 0, y: 0, z: 0 }, [
      { id: 'poison', amplifier: 0, durationSec: 12 },
    ]);
    const r = tickCloud(c, 0.5, [{ id: 1, position: { x: 1, y: 0, z: 0 } }]);
    expect(r.applied[0]?.entityId).toBe(1);
  });

  it('skips entities outside the radius', () => {
    const c = makeLingeringCloud({ x: 0, y: 0, z: 0 }, []);
    const r = tickCloud(c, 0.5, [{ id: 1, position: { x: 10, y: 0, z: 0 } }]);
    expect(r.applied.length).toBe(0);
  });

  it('cooldown prevents continuous spamming', () => {
    const c = makeLingeringCloud({ x: 0, y: 0, z: 0 }, [
      { id: 'poison', amplifier: 0, durationSec: 10 },
    ]);
    tickCloud(c, 0.5, [{ id: 1, position: { x: 0, y: 0, z: 0 } }]);
    const r = tickCloud(c, 0.05, [{ id: 1, position: { x: 0, y: 0, z: 0 } }]);
    expect(r.applied.length).toBe(0);
  });

  it('expires after lifetime', () => {
    const c = makeLingeringCloud({ x: 0, y: 0, z: 0 }, [], 1);
    const r = tickCloud(c, 2, []);
    expect(r.expired).toBe(true);
  });

  it('radius shrinks over time', () => {
    const c = makeLingeringCloud({ x: 0, y: 0, z: 0 }, [], 10);
    const initial = c.radius;
    tickCloud(c, 5, []);
    expect(c.radius).toBeLessThan(initial);
  });
});

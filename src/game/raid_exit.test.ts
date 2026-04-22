import { describe, it, expect } from 'vitest';
import {
  addRaider,
  makeRaidState,
  pickTeleportPoint,
  RAID_RADIUS,
  tickRaidBoundary,
} from './raid_exit';

describe('raid boundary', () => {
  it('stray raider accumulates out-of-bounds time', () => {
    const s = makeRaidState({ x: 0, y: 64, z: 0 });
    addRaider(s, {
      id: 1,
      position: { x: 200, y: 64, z: 0 },
      secondsOutOfBounds: 0,
    });
    tickRaidBoundary(s, 10);
    expect(s.raiders.get(1)?.secondsOutOfBounds).toBe(10);
  });

  it('30s stray triggers teleport', () => {
    const s = makeRaidState({ x: 0, y: 64, z: 0 });
    addRaider(s, {
      id: 1,
      position: { x: 200, y: 64, z: 0 },
      secondsOutOfBounds: 25,
    });
    const r = tickRaidBoundary(s, 10);
    expect(r.teleportBack).toContain(1);
  });

  it('near raider resets counter', () => {
    const s = makeRaidState({ x: 0, y: 64, z: 0 });
    addRaider(s, {
      id: 1,
      position: { x: 5, y: 64, z: 0 },
      secondsOutOfBounds: 20,
    });
    tickRaidBoundary(s, 5);
    expect(s.raiders.get(1)?.secondsOutOfBounds).toBe(0);
  });

  it('empty raid declared defeated', () => {
    const s = makeRaidState({ x: 0, y: 64, z: 0 });
    const r = tickRaidBoundary(s, 1);
    expect(r.defeated).toBe(true);
  });

  it('teleport point inside radius', () => {
    const p = pickTeleportPoint({ x: 0, y: 64, z: 0 }, () => 0.5);
    expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(RAID_RADIUS * 0.6 + 1);
  });
});

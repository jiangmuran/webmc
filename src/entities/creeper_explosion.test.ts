import { describe, it, expect } from 'vitest';
import {
  CREEPER_MAX_HEALTH,
  FUSE_DURATION_SEC,
  IGNITE_RANGE,
  CANCEL_RANGE,
  makeCreeper,
  tickCreeper,
  tryChargeByLightning,
} from './creeper_explosion';

describe('creeper', () => {
  it('starts at max HP, uncharged', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    expect(c.health).toBe(CREEPER_MAX_HEALTH);
    expect(c.charged).toBe(false);
  });

  it('explodes after fuse', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    tickCreeper(c, { playerDistance: 1, catNearby: false, dtSec: 1, escape: false });
    const r = tickCreeper(c, {
      playerDistance: 1,
      catNearby: false,
      dtSec: FUSE_DURATION_SEC,
      escape: false,
    });
    expect(r.explode).toBe(true);
    expect(r.power).toBe(3);
  });

  it('charged doubles power', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 }, true);
    c.fuseSec = FUSE_DURATION_SEC;
    const r = tickCreeper(c, {
      playerDistance: 1,
      catNearby: false,
      dtSec: 0.1,
      escape: false,
    });
    expect(r.explode).toBe(true);
    expect(r.power).toBe(6);
  });

  it('cat makes it flee + cancel fuse', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    c.fuseSec = 1;
    tickCreeper(c, { playerDistance: 1, catNearby: true, dtSec: 0.1, escape: false });
    expect(c.fleeing).toBe(true);
    expect(c.fuseSec).toBe(0);
  });

  it('escape resets fuse', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    c.fuseSec = 1;
    tickCreeper(c, { playerDistance: 10, catNearby: false, dtSec: 0.1, escape: true });
    expect(c.fuseSec).toBe(0);
  });

  it('lightning charges a nearby creeper', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    expect(tryChargeByLightning(c, { x: 2, y: 0, z: 0 })).toBe(true);
    expect(c.charged).toBe(true);
  });

  it('lightning too far does nothing', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    expect(tryChargeByLightning(c, { x: 10, y: 0, z: 0 })).toBe(false);
  });

  it('fuse sustains in the 3-7 block band per wiki', () => {
    // minecraft.wiki/w/Creeper: ignite ≤ 3, cancel only beyond 7.
    // Distances 4-7 should keep the fuse counting down once ignited.
    expect(IGNITE_RANGE).toBe(3);
    expect(CANCEL_RANGE).toBe(7);
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    // Ignite at 2 blocks.
    tickCreeper(c, { playerDistance: 2, catNearby: false, dtSec: 0.5, escape: false });
    expect(c.fuseSec).toBeGreaterThan(0);
    // Step to 5 blocks — within cancel range, should keep ticking.
    tickCreeper(c, { playerDistance: 5, catNearby: false, dtSec: 0.5, escape: false });
    expect(c.fuseSec).toBeCloseTo(1.0, 5);
    // Hit threshold and explode.
    const r = tickCreeper(c, { playerDistance: 6, catNearby: false, dtSec: 0.6, escape: false });
    expect(r.explode).toBe(true);
  });

  it('fuse cancels when player crosses 7-block threshold', () => {
    const c = makeCreeper(1, { x: 0, y: 0, z: 0 });
    tickCreeper(c, { playerDistance: 1, catNearby: false, dtSec: 0.5, escape: false });
    expect(c.fuseSec).toBeGreaterThan(0);
    tickCreeper(c, {
      playerDistance: CANCEL_RANGE + 0.1,
      catNearby: false,
      dtSec: 0.1,
      escape: false,
    });
    expect(c.fuseSec).toBe(0);
  });
});

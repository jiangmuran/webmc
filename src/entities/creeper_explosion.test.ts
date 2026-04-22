import { describe, it, expect } from 'vitest';
import {
  CREEPER_MAX_HEALTH,
  FUSE_DURATION_SEC,
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
});

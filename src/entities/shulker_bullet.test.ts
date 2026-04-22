import { describe, it, expect } from 'vitest';
import {
  LEVITATION_ON_HIT_SEC,
  SHULKER_BULLET_DAMAGE,
  makeShulkerBullet,
  tickShulkerBullet,
} from './shulker_bullet';

describe('shulker bullet', () => {
  it('tracks target via right-angle redirects', () => {
    const b = makeShulkerBullet({ x: 0, y: 0, z: 0 }, 42);
    for (let i = 0; i < 10; i++) {
      tickShulkerBullet(b, { targetPos: { x: 10, y: 0, z: 0 }, dtSec: 0.1 });
    }
    expect(b.position.x).toBeGreaterThan(0);
  });

  it('hits target when close', () => {
    const b = makeShulkerBullet({ x: 5, y: 0, z: 0 }, 42);
    const r = tickShulkerBullet(b, { targetPos: { x: 5, y: 0, z: 0 }, dtSec: 0.1 });
    expect(r.hitTarget).toBe(true);
  });

  it('expires after lifetime', () => {
    const b = makeShulkerBullet({ x: 0, y: 0, z: 0 }, 42);
    let expired = false;
    for (let i = 0; i < 600; i++) {
      if (tickShulkerBullet(b, { targetPos: null, dtSec: 0.1 }).expired) expired = true;
    }
    expect(expired).toBe(true);
  });

  it('damage + levitation constants set', () => {
    expect(SHULKER_BULLET_DAMAGE).toBe(4);
    expect(LEVITATION_ON_HIT_SEC).toBe(10);
  });
});

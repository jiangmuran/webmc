import { describe, it, expect } from 'vitest';
import {
  MOUNT_STATS,
  dismount,
  driveMount,
  equipSaddle,
  makeMount,
  mount,
  useCarrotOnStick,
} from './mount';

describe('mount', () => {
  it('stats table has all kinds', () => {
    expect(MOUNT_STATS.horse.baseSpeed).toBeGreaterThan(MOUNT_STATS.pig.baseSpeed);
    expect(MOUNT_STATS.camel.dashVelocity).toBeGreaterThan(0);
  });

  it('pig needs a saddle to mount', () => {
    const p = makeMount('pig');
    expect(mount(p, 1)).toBe(false);
    equipSaddle(p);
    expect(mount(p, 1)).toBe(true);
  });

  it('strider mounts without saddle', () => {
    const s = makeMount('strider');
    expect(mount(s, 1)).toBe(true);
  });

  it('dismount returns the rider id', () => {
    const m = makeMount('horse');
    equipSaddle(m);
    mount(m, 42);
    expect(dismount(m)).toBe(42);
    expect(m.riderId).toBeNull();
  });

  it('carrot on stick boosts pig speed', () => {
    const p = makeMount('pig');
    equipSaddle(p);
    useCarrotOnStick(p);
    const boosted = driveMount(p, { forward: 1, turn: 0, jump: false, dash: false }, 0, 0.1);
    p.carrotBoostSec = 0;
    const normal = driveMount(p, { forward: 1, turn: 0, jump: false, dash: false }, 0, 0.1);
    expect(Math.abs(boosted.velocity.z)).toBeGreaterThan(Math.abs(normal.velocity.z));
  });

  it('camel dash adds to velocity once per 8s', () => {
    const c = makeMount('camel');
    equipSaddle(c);
    const first = driveMount(c, { forward: 1, turn: 0, jump: false, dash: true }, 0, 0.1);
    const second = driveMount(c, { forward: 1, turn: 0, jump: false, dash: true }, 0, 0.1);
    expect(Math.abs(first.velocity.z)).toBeGreaterThan(Math.abs(second.velocity.z));
  });
});

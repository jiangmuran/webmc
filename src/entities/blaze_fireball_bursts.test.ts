import { describe, it, expect } from 'vitest';
import {
  shouldShoot,
  recordShot,
  tick,
  BURST_SHOT_COUNT,
  BURST_SHOT_INTERVAL,
  COOLDOWN_AFTER_BURST,
  type BlazeAttackState,
} from './blaze_fireball_bursts';

const idle: BlazeAttackState = {
  ticksSinceLastShot: COOLDOWN_AFTER_BURST,
  inBurst: false,
  shotsInBurst: 0,
};

describe('blaze fireball bursts', () => {
  it('no target no shoot', () => {
    expect(shouldShoot(idle, false)).toBe(false);
  });

  it('first shot after cooldown', () => {
    expect(shouldShoot(idle, true)).toBe(true);
  });

  it('mid-burst fires quickly', () => {
    const mid: BlazeAttackState = {
      ticksSinceLastShot: BURST_SHOT_INTERVAL,
      inBurst: true,
      shotsInBurst: 1,
    };
    expect(shouldShoot(mid, true)).toBe(true);
  });

  it('recordShot advances burst', () => {
    const next = recordShot(idle);
    expect(next.inBurst).toBe(true);
  });

  it('burst completes back to idle', () => {
    let s = idle;
    for (let i = 0; i < BURST_SHOT_COUNT; i++) s = recordShot(s);
    expect(s.inBurst).toBe(false);
  });

  it('tick progresses timer', () => {
    expect(tick(idle).ticksSinceLastShot).toBe(COOLDOWN_AFTER_BURST + 1);
  });
});

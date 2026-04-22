import { describe, it, expect } from 'vitest';
import {
  makeBlaze,
  tryFire,
  SHOT_INTERVAL_MS,
  SHOTS_PER_VOLLEY,
  VOLLEYS_PER_ATTACK,
} from './blaze_fireball_spray';

describe('blaze', () => {
  it('first shot fires', () => {
    const b = makeBlaze();
    const r = tryFire(b, { nowMs: 0, targetInRange: true });
    expect(r.fired).toBe(true);
  });

  it('respect shot interval', () => {
    const b = makeBlaze();
    tryFire(b, { nowMs: 0, targetInRange: true });
    expect(tryFire(b, { nowMs: 100, targetInRange: true }).fired).toBe(false);
    expect(tryFire(b, { nowMs: SHOT_INTERVAL_MS + 1, targetInRange: true }).fired).toBe(true);
  });

  it('volley complete', () => {
    const b = makeBlaze();
    for (let i = 0; i < SHOTS_PER_VOLLEY; i++) {
      tryFire(b, { nowMs: i * (SHOT_INTERVAL_MS + 1), targetInRange: true });
    }
    // The SHOTS_PER_VOLLEY-th call above completes the volley
    // (check last result via state change)
    expect(b.volleysFiredThisAttack).toBeGreaterThanOrEqual(1);
  });

  it('attack complete after N volleys', () => {
    const b = makeBlaze();
    let t = 0;
    for (let i = 0; i < SHOTS_PER_VOLLEY * VOLLEYS_PER_ATTACK; i++) {
      t += SHOT_INTERVAL_MS + 1;
      tryFire(b, { nowMs: t, targetInRange: true });
    }
    expect(b.volleysFiredThisAttack).toBe(0);
  });

  it('no target = no fire', () => {
    const b = makeBlaze();
    expect(tryFire(b, { nowMs: 0, targetInRange: false }).fired).toBe(false);
  });
});

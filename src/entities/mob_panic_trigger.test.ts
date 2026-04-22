import { describe, it, expect } from 'vitest';
import {
  makePanicState,
  updatePanic,
  isPanicking,
  speedMultiplier,
  PANIC_DURATION_MS,
  HOSTILE_PANIC_RADIUS,
} from './mob_panic_trigger';

describe('mob panic', () => {
  it('damage triggers', () => {
    const s = makePanicState();
    updatePanic(s, {
      nowMs: 0,
      tookDamage: true,
      nearestHostileDistance: null,
      nearestFireDistance: null,
    });
    expect(isPanicking(s, 100)).toBe(true);
  });

  it('hostile triggers', () => {
    const s = makePanicState();
    updatePanic(s, {
      nowMs: 0,
      tookDamage: false,
      nearestHostileDistance: HOSTILE_PANIC_RADIUS,
      nearestFireDistance: null,
    });
    expect(s.panicSource).toBe('hostile');
  });

  it('no threat = no panic', () => {
    const s = makePanicState();
    updatePanic(s, {
      nowMs: 0,
      tookDamage: false,
      nearestHostileDistance: 100,
      nearestFireDistance: 100,
    });
    expect(isPanicking(s, 0)).toBe(false);
  });

  it('expires', () => {
    const s = makePanicState();
    updatePanic(s, {
      nowMs: 0,
      tookDamage: true,
      nearestHostileDistance: null,
      nearestFireDistance: null,
    });
    expect(isPanicking(s, PANIC_DURATION_MS + 1)).toBe(false);
  });

  it('speed boost while panicking', () => {
    const s = makePanicState();
    updatePanic(s, {
      nowMs: 0,
      tookDamage: true,
      nearestHostileDistance: null,
      nearestFireDistance: null,
    });
    expect(speedMultiplier(s, 100)).toBeGreaterThan(1);
  });
});

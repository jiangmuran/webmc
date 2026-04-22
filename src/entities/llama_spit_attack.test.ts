import { describe, it, expect } from 'vitest';
import {
  makeLlama,
  trySpit,
  spitVelocity,
  SPIT_COOLDOWN_MS,
  SPIT_RANGE,
} from './llama_spit_attack';

describe('llama spit', () => {
  it('untamed spits when attacked', () => {
    const l = makeLlama();
    expect(
      trySpit(l, {
        nowMs: 0,
        targetId: 'p',
        targetDistance: 5,
        attackedRecently: true,
      }),
    ).toBe(true);
  });

  it('untamed peaceful no spit', () => {
    const l = makeLlama();
    expect(
      trySpit(l, {
        nowMs: 0,
        targetId: 'p',
        targetDistance: 5,
        attackedRecently: false,
      }),
    ).toBe(false);
  });

  it('tamed spits anywhere', () => {
    const l = makeLlama(true);
    expect(
      trySpit(l, {
        nowMs: 0,
        targetId: 'mob',
        targetDistance: 5,
        attackedRecently: false,
      }),
    ).toBe(true);
  });

  it('range check', () => {
    const l = makeLlama(true);
    expect(
      trySpit(l, {
        nowMs: 0,
        targetId: 'mob',
        targetDistance: SPIT_RANGE + 1,
        attackedRecently: false,
      }),
    ).toBe(false);
  });

  it('cooldown', () => {
    const l = makeLlama(true);
    trySpit(l, { nowMs: 0, targetId: 'm', targetDistance: 5, attackedRecently: false });
    expect(
      trySpit(l, { nowMs: 500, targetId: 'm', targetDistance: 5, attackedRecently: false }),
    ).toBe(false);
    expect(
      trySpit(l, {
        nowMs: SPIT_COOLDOWN_MS + 1,
        targetId: 'm',
        targetDistance: 5,
        attackedRecently: false,
      }),
    ).toBe(true);
  });

  it('velocity aimed', () => {
    const v = spitVelocity(3, 0, 4);
    expect(Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)).toBeCloseTo(1.5);
  });
});

import { describe, it, expect } from 'vitest';
import {
  ANGER_MAX_SEC,
  ANGER_MIN_SEC,
  beeAngered,
  beePollinate,
  depositAtNest,
  makeBee,
  rollAngerSec,
  sting,
  tickBee,
} from './bee';

describe('bee', () => {
  it('pollination marks the bee and sets return mood if home set', () => {
    const b = makeBee({ x: 0, y: 80, z: 0 });
    beePollinate(b);
    expect(b.pollinated).toBe(true);
    expect(b.mood).toBe('return_home');
  });

  it('depositAtNest clears pollination', () => {
    const b = makeBee({ x: 0, y: 80, z: 0 });
    beePollinate(b);
    expect(depositAtNest(b)).toBe(true);
    expect(b.pollinated).toBe(false);
  });

  it('angered bee stings and dies', () => {
    const b = makeBee();
    beeAngered(b, 1);
    const s = sting(b);
    expect(s.damageDealt).toBe(2);
    expect(s.beeDies).toBe(true);
  });

  it('anger expires over time', () => {
    const b = makeBee();
    beeAngered(b, 1);
    tickBee(b, 30);
    expect(b.mood).toBe('wander');
    expect(b.angerSec).toBe(0);
  });

  it('pollinated bee without home wanders', () => {
    const b = makeBee();
    beePollinate(b);
    expect(b.mood).toBe('wander');
  });

  it('rollAngerSec stays within wiki [20,39] (inclusive)', () => {
    expect(rollAngerSec(() => 0)).toBe(ANGER_MIN_SEC);
    expect(rollAngerSec(() => 0.999999)).toBe(ANGER_MAX_SEC);
    for (let i = 0; i < 100; i++) {
      const v = rollAngerSec(Math.random);
      expect(v).toBeGreaterThanOrEqual(ANGER_MIN_SEC);
      expect(v).toBeLessThanOrEqual(ANGER_MAX_SEC);
    }
  });

  it('beeAngered with rand uses wiki random duration', () => {
    const b = makeBee();
    beeAngered(b, 1, () => 0);
    expect(b.angerSec).toBe(ANGER_MIN_SEC);
    beeAngered(b, 1, () => 0.999);
    expect(b.angerSec).toBe(ANGER_MAX_SEC);
  });
});

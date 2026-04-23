import { describe, it, expect } from 'vitest';
import {
  canPhantomSpawn,
  resetOnSleep,
  tickNightlyRollover,
  PHANTOM_THRESHOLD_NIGHTS,
} from './sleep_phantom_counter';

describe('sleep phantom counter', () => {
  it('below threshold safe', () => {
    expect(canPhantomSpawn({ nightsWithoutSleep: 1 })).toBe(false);
  });

  it('threshold triggers', () => {
    expect(canPhantomSpawn({ nightsWithoutSleep: PHANTOM_THRESHOLD_NIGHTS })).toBe(true);
  });

  it('sleep resets', () => {
    expect(resetOnSleep({ nightsWithoutSleep: 10 }).nightsWithoutSleep).toBe(0);
  });

  it('rollover increments', () => {
    expect(tickNightlyRollover({ nightsWithoutSleep: 2 }).nightsWithoutSleep).toBe(3);
  });
});

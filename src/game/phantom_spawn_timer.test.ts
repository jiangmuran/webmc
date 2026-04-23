import { describe, it, expect } from 'vitest';
import {
  awakeDays,
  eligibleToSpawn,
  spawnChance,
  resetOnSleep,
  tick,
  TICKS_PER_DAY,
  PHANTOM_INSOMNIA_DAYS_THRESHOLD,
} from './phantom_spawn_timer';

describe('phantom spawn timer', () => {
  it('days from ticks', () => {
    expect(awakeDays({ ticksSinceLastSleep: TICKS_PER_DAY * 3 })).toBe(3);
  });

  it('eligible after 3 days', () => {
    expect(
      eligibleToSpawn({ ticksSinceLastSleep: TICKS_PER_DAY * PHANTOM_INSOMNIA_DAYS_THRESHOLD }),
    ).toBe(true);
  });

  it('not eligible under threshold', () => {
    expect(eligibleToSpawn({ ticksSinceLastSleep: TICKS_PER_DAY })).toBe(false);
  });

  it('spawn chance grows', () => {
    const a = spawnChance({ ticksSinceLastSleep: TICKS_PER_DAY * 3 });
    const b = spawnChance({ ticksSinceLastSleep: TICKS_PER_DAY * 10 });
    expect(b).toBeGreaterThan(a);
  });

  it('sleep resets', () => {
    expect(resetOnSleep().ticksSinceLastSleep).toBe(0);
  });

  it('tick increments', () => {
    expect(tick({ ticksSinceLastSleep: 5 }).ticksSinceLastSleep).toBe(6);
  });
});

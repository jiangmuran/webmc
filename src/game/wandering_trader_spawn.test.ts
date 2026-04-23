import { describe, it, expect } from 'vitest';
import {
  shouldSpawnTrader,
  shouldDespawn,
  MIN_SPAWN_INTERVAL_TICKS,
  TRADER_DESPAWN_TICKS,
} from './wandering_trader_spawn';

describe('wandering trader spawn', () => {
  it('too soon rejected', () => {
    expect(shouldSpawnTrader({ ticksSinceLast: 100, basePopulated: true, rng: () => 0.001 })).toBe(
      false,
    );
  });

  it('no village rejected', () => {
    expect(
      shouldSpawnTrader({
        ticksSinceLast: MIN_SPAWN_INTERVAL_TICKS,
        basePopulated: false,
        rng: () => 0.001,
      }),
    ).toBe(false);
  });

  it('eligible + lucky spawns', () => {
    expect(
      shouldSpawnTrader({
        ticksSinceLast: MIN_SPAWN_INTERVAL_TICKS,
        basePopulated: true,
        rng: () => 0.001,
      }),
    ).toBe(true);
  });

  it('unlucky rejected', () => {
    expect(
      shouldSpawnTrader({
        ticksSinceLast: MIN_SPAWN_INTERVAL_TICKS,
        basePopulated: true,
        rng: () => 0.99,
      }),
    ).toBe(false);
  });

  it('despawns after 2 days', () => {
    expect(shouldDespawn(TRADER_DESPAWN_TICKS, false)).toBe(true);
  });

  it('stays near player', () => {
    expect(shouldDespawn(TRADER_DESPAWN_TICKS, true)).toBe(false);
  });
});

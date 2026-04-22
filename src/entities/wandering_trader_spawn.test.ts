import { describe, it, expect } from 'vitest';
import {
  initState,
  attemptSpawn,
  despawnIfExpired,
  MAX_SPAWN_CHANCE,
  TRADER_LIFE_TICKS,
} from './wandering_trader_spawn';

describe('wandering trader', () => {
  it('spawns on low roll', () => {
    const s = initState();
    expect(attemptSpawn(s, { nowTick: 0, rand: () => 0.001 })).toBe('spawned');
    expect(s.activeTraderId).not.toBeNull();
  });

  it('chance escalates on fail', () => {
    const s = initState();
    attemptSpawn(s, { nowTick: 0, rand: () => 0.99 });
    attemptSpawn(s, { nowTick: 1, rand: () => 0.99 });
    expect(s.spawnChance).toBeGreaterThan(0.025);
  });

  it('chance capped', () => {
    const s = initState();
    for (let i = 0; i < 100; i++) attemptSpawn(s, { nowTick: i, rand: () => 0.99 });
    expect(s.spawnChance).toBeLessThanOrEqual(MAX_SPAWN_CHANCE);
  });

  it('blocked while active', () => {
    const s = initState();
    attemptSpawn(s, { nowTick: 0, rand: () => 0 });
    expect(attemptSpawn(s, { nowTick: 10, rand: () => 0 })).toBe('already_active');
  });

  it('despawns after lifetime', () => {
    const s = initState();
    attemptSpawn(s, { nowTick: 0, rand: () => 0 });
    expect(despawnIfExpired(s, TRADER_LIFE_TICKS - 1)).toBe(false);
    expect(despawnIfExpired(s, TRADER_LIFE_TICKS + 1)).toBe(true);
    expect(s.activeTraderId).toBeNull();
  });
});

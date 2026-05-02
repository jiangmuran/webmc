import { describe, it, expect } from 'vitest';
import {
  canSpawnPhantom,
  spawnChanceFromDays,
  tickSun,
  afterSleep,
  membraneDrop,
  SPAWN_THRESHOLD_DAYS,
  SUN_DAMAGE_PER_SECOND,
} from './phantom_day_despawn';

describe('phantom', () => {
  it('no spawn under threshold', () => {
    expect(
      canSpawnPhantom({
        daysSinceSleep: 1,
        worldTick: 15000,
        playerInSkyView: true,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('exactly at threshold yields 0 chance per wiki', () => {
    // (3·24000 − 72000)/72000 = 0; spawn-attempt always fails.
    expect(
      canSpawnPhantom({
        daysSinceSleep: SPAWN_THRESHOLD_DAYS,
        worldTick: 15000,
        playerInSkyView: true,
        rand: () => 0,
      }),
    ).toBe(false);
    expect(spawnChanceFromDays(SPAWN_THRESHOLD_DAYS)).toBe(0);
  });

  it('past threshold matches wiki formula 1 - 3/D', () => {
    // minecraft.wiki/w/Phantom: day 4 = 25%, day 5 = 40%, day 6 = 50%.
    expect(spawnChanceFromDays(4)).toBeCloseTo(0.25, 5);
    expect(spawnChanceFromDays(5)).toBeCloseTo(0.4, 5);
    expect(spawnChanceFromDays(6)).toBeCloseTo(0.5, 5);
    expect(spawnChanceFromDays(7)).toBeCloseTo(4 / 7, 5);
    // Past day 6, chance keeps growing — no cap (old code capped at 0.5).
    expect(spawnChanceFromDays(100)).toBeGreaterThan(0.9);
  });

  it('rand below chance yields spawn at night past threshold', () => {
    expect(
      canSpawnPhantom({
        daysSinceSleep: 4, // 25% chance per wiki
        worldTick: 15000,
        playerInSkyView: true,
        rand: () => 0.1,
      }),
    ).toBe(true);
    expect(
      canSpawnPhantom({
        daysSinceSleep: 4,
        worldTick: 15000,
        playerInSkyView: true,
        rand: () => 0.99, // > 25%
      }),
    ).toBe(false);
  });

  it('no daylight spawn', () => {
    expect(
      canSpawnPhantom({
        daysSinceSleep: 5,
        worldTick: 5000,
        playerInSkyView: true,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('sun tick damages', () => {
    const p = { hp: 20, burningInSun: false, ticksInDirectSun: 19 };
    expect(tickSun(p, true)).toBe(SUN_DAMAGE_PER_SECOND);
  });

  it('shade resets', () => {
    const p = { hp: 20, burningInSun: true, ticksInDirectSun: 50 };
    tickSun(p, false);
    expect(p.ticksInDirectSun).toBe(0);
  });

  it('afterSleep resets', () => {
    expect(afterSleep(100)).toBe(0);
  });

  it('membrane 0..1', () => {
    expect(membraneDrop(() => 0)).toBe(1);
    expect(membraneDrop(() => 0.9)).toBe(0);
  });
});

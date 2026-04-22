import { describe, it, expect } from 'vitest';
import {
  canSpawnPhantom,
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

  it('spawn over threshold at night', () => {
    expect(
      canSpawnPhantom({
        daysSinceSleep: SPAWN_THRESHOLD_DAYS,
        worldTick: 15000,
        playerInSkyView: true,
        rand: () => 0,
      }),
    ).toBe(true);
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

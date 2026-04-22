import { describe, it, expect } from 'vitest';
import { canSleep, respawnLocation, wake } from './sleep';

describe('sleep', () => {
  it('cannot sleep during the day', () => {
    const r = canSleep({ timeOfDay: 6000, monstersNearby: false, bedValid: true });
    expect(r.canSleep).toBe(false);
    expect(r.reason).toBe('not_night');
  });

  it('can sleep at night', () => {
    const r = canSleep({ timeOfDay: 15000, monstersNearby: false, bedValid: true });
    expect(r.canSleep).toBe(true);
  });

  it('cannot sleep with monsters nearby', () => {
    const r = canSleep({ timeOfDay: 15000, monstersNearby: true, bedValid: true });
    expect(r.canSleep).toBe(false);
    expect(r.reason).toBe('monsters_nearby');
  });

  it('cannot sleep if bed obstructed', () => {
    const r = canSleep({ timeOfDay: 15000, monstersNearby: false, bedValid: false });
    expect(r.canSleep).toBe(false);
    expect(r.reason).toBe('bed_obstructed');
  });

  it('can sleep through thunder during the day', () => {
    const r = canSleep({
      timeOfDay: 6000,
      monstersNearby: false,
      bedValid: true,
      isThunder: true,
    });
    expect(r.canSleep).toBe(true);
  });

  it('wake clears weather and advances to dawn', () => {
    const r = wake(15000);
    expect(r.clearWeather).toBe(true);
    expect(r.newTime).toBe(0);
  });

  it('respawnLocation prefers bed when present', () => {
    const r = respawnLocation({
      bedPos: { x: 100, y: 64, z: 100 },
      bedExists: true,
      worldSpawn: { x: 0, y: 64, z: 0 },
    });
    expect(r).toEqual({ x: 100, y: 64, z: 100 });
  });

  it('respawnLocation falls back to world spawn if bed is gone', () => {
    const r = respawnLocation({
      bedPos: { x: 100, y: 64, z: 100 },
      bedExists: false,
      worldSpawn: { x: 0, y: 64, z: 0 },
    });
    expect(r).toEqual({ x: 0, y: 64, z: 0 });
  });
});

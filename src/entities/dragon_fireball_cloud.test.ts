import { describe, it, expect } from 'vitest';
import {
  spawnCloud,
  tick,
  damageAt,
  bottleable,
  DEFAULT_DRAGON_CLOUD_DURATION,
} from './dragon_fireball_cloud';

describe('dragon fireball cloud', () => {
  it('spawns at duration', () => {
    expect(spawnCloud().remainingTicks).toBe(DEFAULT_DRAGON_CLOUD_DURATION);
  });

  it('tick decreases', () => {
    const c = spawnCloud();
    const n = tick(c);
    expect(n?.remainingTicks).toBe(DEFAULT_DRAGON_CLOUD_DURATION - 1);
  });

  it('expires at 1', () => {
    expect(tick({ radius: 3, remainingTicks: 1, damagePerTick: 0.3 })).toBeNull();
  });

  it('damages in radius', () => {
    const c = spawnCloud();
    expect(damageAt(c, 1)).toBeGreaterThan(0);
  });

  it('no damage beyond radius', () => {
    const c = spawnCloud();
    expect(damageAt(c, c.radius + 1)).toBe(0);
  });

  it('bottleable', () => {
    expect(bottleable()).toBe(true);
  });
});

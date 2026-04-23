import { describe, it, expect } from 'vitest';
import { shouldPickNew, pickCooldown, MIN_COOLDOWN, MAX_COOLDOWN } from './music_queue';

describe('music queue', () => {
  it('picks new after cooldown', () => {
    expect(shouldPickNew({ cooldownTicks: 100, lastPlayedAtTick: 0 }, 200)).toBe(true);
  });

  it('waits during cooldown', () => {
    expect(shouldPickNew({ cooldownTicks: 100, lastPlayedAtTick: 0 }, 50)).toBe(false);
  });

  it('not if one playing', () => {
    expect(
      shouldPickNew(
        {
          now: { id: 'x', biome: 'plains', durationTicks: 1000 },
          cooldownTicks: 0,
          lastPlayedAtTick: 0,
        },
        100,
      ),
    ).toBe(false);
  });

  it('cooldown in range', () => {
    const c = pickCooldown(() => 0.5);
    expect(c).toBeGreaterThanOrEqual(MIN_COOLDOWN);
    expect(c).toBeLessThan(MAX_COOLDOWN);
  });
});

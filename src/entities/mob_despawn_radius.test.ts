import { describe, it, expect } from 'vitest';
import { shouldDespawn, madePersistent, HARD_DESPAWN } from './mob_despawn_radius';

describe('mob despawn radius', () => {
  it('close no despawn', () => {
    expect(
      shouldDespawn({
        distanceToNearestPlayer: 10,
        ticksSinceLastPlayerClose: 1000,
        persistent: false,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('hard despawn beyond 128', () => {
    expect(
      shouldDespawn({
        distanceToNearestPlayer: HARD_DESPAWN + 1,
        ticksSinceLastPlayerClose: 0,
        persistent: false,
        rand: () => 1,
      }),
    ).toBe(true);
  });

  it('persistent never despawns', () => {
    expect(
      shouldDespawn({
        distanceToNearestPlayer: 1000,
        ticksSinceLastPlayerClose: 100000,
        persistent: true,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('made persistent shortcut', () => {
    expect(madePersistent().persistent).toBe(true);
  });

  it('soft despawn chance', () => {
    expect(
      shouldDespawn({
        distanceToNearestPlayer: 50,
        ticksSinceLastPlayerClose: 2000,
        persistent: false,
        rand: () => 0,
      }),
    ).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  trackRadius,
  isInRange,
  shouldDespawn,
  HARD_DESPAWN_DISTANCE,
} from './entity_tracker_radius';

describe('entity tracker radius', () => {
  it('player 128', () => {
    expect(trackRadius('player')).toBe(128);
  });

  it('xp orb smallest', () => {
    expect(trackRadius('xp_orb')).toBeLessThan(trackRadius('player'));
  });

  it('inRange inside', () => {
    expect(isInRange({ x: 0, z: 0 }, { x: 10, z: 0 }, 'mob')).toBe(true);
  });

  it('out of range mob', () => {
    expect(isInRange({ x: 0, z: 0 }, { x: 200, z: 0 }, 'mob')).toBe(false);
  });

  it('hard despawn beyond 128', () => {
    expect(shouldDespawn(HARD_DESPAWN_DISTANCE + 1, 0)).toBe(true);
  });

  it('soft despawn after long absence', () => {
    expect(shouldDespawn(40, 700)).toBe(true);
  });

  it('no despawn within soft radius', () => {
    expect(shouldDespawn(20, 10000)).toBe(false);
  });
});

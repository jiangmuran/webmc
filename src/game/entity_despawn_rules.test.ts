import { describe, it, expect } from 'vitest';
import {
  isProtected,
  shouldDespawnImmediately,
  eligibleForRandomDespawn,
} from './entity_despawn_rules';

const base = {
  type: 'zombie',
  playerDistance: 200,
  ticksSincePlayerNearby: 10000,
  isPersistent: false,
  isNamed: false,
  isLeashed: false,
};

describe('entity despawn rules', () => {
  it('named is protected', () => {
    expect(isProtected({ ...base, isNamed: true })).toBe(true);
  });

  it('far unprotected despawns immediately', () => {
    expect(shouldDespawnImmediately(base)).toBe(true);
  });

  it('named far survives', () => {
    expect(shouldDespawnImmediately({ ...base, isNamed: true })).toBe(false);
  });

  it('random despawn after age + distance', () => {
    expect(eligibleForRandomDespawn({ ...base, playerDistance: 50 })).toBe(true);
  });

  it('close never random-despawns', () => {
    expect(eligibleForRandomDespawn({ ...base, playerDistance: 5 })).toBe(false);
  });
});

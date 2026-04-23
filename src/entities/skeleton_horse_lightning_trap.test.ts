import { describe, it, expect } from 'vitest';
import {
  spawnsSkeletonsOnApproach,
  strikesLightning,
  skeletonsOnHorsesCount,
  SKELETON_SPAWN_COUNT,
} from './skeleton_horse_lightning_trap';

describe('skeleton horse lightning trap', () => {
  it('triggers on approach', () => {
    expect(spawnsSkeletonsOnApproach({ isTrapped: true, approachedByPlayer: true })).toBe(true);
  });

  it('not if not trapped', () => {
    expect(spawnsSkeletonsOnApproach({ isTrapped: false, approachedByPlayer: true })).toBe(false);
  });

  it('lightning syncs', () => {
    expect(strikesLightning({ isTrapped: true, approachedByPlayer: true })).toBe(true);
  });

  it('3 skeletons', () => {
    expect(skeletonsOnHorsesCount()).toBe(SKELETON_SPAWN_COUNT);
  });
});

import { describe, it, expect } from 'vitest';
import {
  makeTrap,
  triggerTrap,
  shouldSpawnTrap,
  TRAP_SKELETONS,
  TRAP_SPAWN_CHANCE,
} from './skeleton_horse_trap';

describe('skeleton horse trap', () => {
  it('triggers during thunderstorm by lightning', () => {
    const t = makeTrap();
    expect(triggerTrap(t, { thunderstorm: true, struckByLightning: true })).toBe(true);
    expect(t.skeletonCount).toBe(TRAP_SKELETONS);
  });

  it('ignores no storm', () => {
    const t = makeTrap();
    expect(triggerTrap(t, { thunderstorm: false, struckByLightning: true })).toBe(false);
  });

  it('only once', () => {
    const t = makeTrap();
    triggerTrap(t, { thunderstorm: true, struckByLightning: true });
    expect(triggerTrap(t, { thunderstorm: true, struckByLightning: true })).toBe(false);
  });

  it('spawn chance gated by storm', () => {
    expect(shouldSpawnTrap(false, () => 0)).toBe(false);
    expect(shouldSpawnTrap(true, () => 0)).toBe(true);
    expect(shouldSpawnTrap(true, () => TRAP_SPAWN_CHANCE + 0.01)).toBe(false);
  });

  it('spawn chance scales with regional difficulty per wiki', () => {
    // minecraft.wiki/w/Skeleton_Horse#Trap: 0.75% to 1.5% range.
    // At regionalDifficulty 0 → 0% (impossible).
    expect(shouldSpawnTrap(true, () => 0, 0)).toBe(false);
    // At regionalDifficulty 2 → 1.5% (max). rand 0.014 < 0.015 → true.
    expect(shouldSpawnTrap(true, () => 0.014, 2)).toBe(true);
    // At regionalDifficulty 2 → 1.5% (max). rand 0.016 > 0.015 → false.
    expect(shouldSpawnTrap(true, () => 0.016, 2)).toBe(false);
  });
});

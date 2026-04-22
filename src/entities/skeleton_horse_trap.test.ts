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
});

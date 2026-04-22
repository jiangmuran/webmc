import { describe, it, expect } from 'vitest';
import {
  appliesWitherTo,
  spawnsFromMobKilledByWither,
  requiresGrassyBlock,
  WITHER_ROSE_DAMAGE_TICKS,
} from './wither_rose_damage';

describe('wither rose damage', () => {
  it('applies to cow', () => {
    expect(appliesWitherTo('cow')).toBe(true);
  });

  it('undead immune', () => {
    expect(appliesWitherTo('zombie')).toBe(false);
    expect(appliesWitherTo('skeleton')).toBe(false);
  });

  it('iron golem immune', () => {
    expect(appliesWitherTo('iron_golem')).toBe(false);
  });

  it('spawns from normal mobs', () => {
    expect(spawnsFromMobKilledByWither('cow')).toBe(true);
  });

  it('does not spawn from wither/dragon kills', () => {
    expect(spawnsFromMobKilledByWither('wither')).toBe(false);
    expect(spawnsFromMobKilledByWither('ender_dragon')).toBe(false);
  });

  it('needs grassy block', () => {
    expect(requiresGrassyBlock()).toBe(true);
  });

  it('duration 2s', () => {
    expect(WITHER_ROSE_DAMAGE_TICKS).toBe(40);
  });
});

import { describe, it, expect } from 'vitest';
import { DIFFICULTY_SETTINGS, GAMEMODE_SETTINGS, mobDamageAfterDifficulty } from './difficulty';

describe('difficulty', () => {
  it('peaceful mobs deal 0 damage', () => {
    expect(mobDamageAfterDifficulty(5, 'peaceful')).toBe(0);
  });

  it('hard multiplies damage by 1.5x', () => {
    expect(mobDamageAfterDifficulty(4, 'hard')).toBeCloseTo(6, 3);
  });

  it('peaceful disables hostile spawns', () => {
    expect(DIFFICULTY_SETTINGS.peaceful.hostileSpawnRate).toBe(0);
  });

  it('only hard starves to death', () => {
    expect(DIFFICULTY_SETTINGS.peaceful.starvationCanKill).toBe(false);
    expect(DIFFICULTY_SETTINGS.easy.starvationCanKill).toBe(false);
    expect(DIFFICULTY_SETTINGS.normal.starvationCanKill).toBe(false);
    expect(DIFFICULTY_SETTINGS.hard.starvationCanKill).toBe(true);
  });
});

describe('gamemode', () => {
  it('creative is damage-immune + has flight', () => {
    expect(GAMEMODE_SETTINGS.creative.canTakeDamage).toBe(false);
    expect(GAMEMODE_SETTINGS.creative.flyingEnabled).toBe(true);
  });

  it('spectator has noclip + no inventory', () => {
    expect(GAMEMODE_SETTINGS.spectator.noclip).toBe(true);
    expect(GAMEMODE_SETTINGS.spectator.inventoryVisible).toBe(false);
  });

  it('survival is the harsh default', () => {
    expect(GAMEMODE_SETTINGS.survival.canTakeDamage).toBe(true);
    expect(GAMEMODE_SETTINGS.survival.infiniteBlocks).toBe(false);
    expect(GAMEMODE_SETTINGS.survival.flyingEnabled).toBe(false);
  });
});

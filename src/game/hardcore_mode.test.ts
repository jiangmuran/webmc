import { describe, it, expect } from 'vitest';
import {
  becomesSpectatorOnDeath,
  canRespawn,
  worldDifficultyLocked,
  heartSkinIsHardcore,
} from './hardcore_mode';

describe('hardcore mode', () => {
  it('death in hardcore → spectator', () => {
    expect(becomesSpectatorOnDeath({ hardcore: true, playerDied: true })).toBe(true);
  });

  it('alive does not become spectator', () => {
    expect(becomesSpectatorOnDeath({ hardcore: true, playerDied: false })).toBe(false);
  });

  it('cannot respawn after death', () => {
    expect(canRespawn({ hardcore: true, playerDied: true })).toBe(false);
  });

  it('non-hardcore respawns fine', () => {
    expect(canRespawn({ hardcore: false, playerDied: true })).toBe(true);
  });

  it('difficulty locked in hardcore', () => {
    expect(worldDifficultyLocked({ hardcore: true, playerDied: false })).toBe(true);
  });

  it('hardcore heart skin', () => {
    expect(heartSkinIsHardcore({ hardcore: true, playerDied: false })).toBe(true);
  });
});

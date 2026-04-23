import { describe, it, expect } from 'vitest';
import { grantsHeroEffect, villagerGiftsOffered, finalWaveWasCaptain } from './raid_reward';

describe('raid reward', () => {
  it('victory grants hero', () => {
    expect(
      grantsHeroEffect({ wavesCleared: 5, difficulty: 'normal', heroOfVillageApplied: false }),
    ).toBe(true);
  });

  it('already hero, no regrant', () => {
    expect(
      grantsHeroEffect({ wavesCleared: 5, difficulty: 'normal', heroOfVillageApplied: true }),
    ).toBe(false);
  });

  it('gifts offered to hero', () => {
    expect(
      villagerGiftsOffered({ wavesCleared: 1, difficulty: 'easy', heroOfVillageApplied: true }),
    ).toBe(true);
  });

  it('final wave count scales with difficulty', () => {
    expect(
      finalWaveWasCaptain({ wavesCleared: 7, difficulty: 'hard', heroOfVillageApplied: false }),
    ).toBe(true);
    expect(
      finalWaveWasCaptain({ wavesCleared: 3, difficulty: 'easy', heroOfVillageApplied: false }),
    ).toBe(true);
    expect(
      finalWaveWasCaptain({ wavesCleared: 3, difficulty: 'hard', heroOfVillageApplied: false }),
    ).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { canBreed, inLoveMode, BREED_COOLDOWN_TICKS } from './breeding_cooldown';

describe('breeding cooldown', () => {
  it('baby cannot', () => {
    expect(canBreed({ lastBreedTick: 0, currentTick: 100000, isBaby: true })).toBe(false);
  });

  it('cooldown passed', () => {
    expect(canBreed({ lastBreedTick: 0, currentTick: BREED_COOLDOWN_TICKS, isBaby: false })).toBe(
      true,
    );
  });

  it('cooldown not passed', () => {
    expect(canBreed({ lastBreedTick: 0, currentTick: 100, isBaby: false })).toBe(false);
  });

  it('love mode requires cooldown', () => {
    expect(
      inLoveMode({ lastBreedTick: 0, currentTick: BREED_COOLDOWN_TICKS, isBaby: false }, 100),
    ).toBe(true);
    expect(inLoveMode({ lastBreedTick: 0, currentTick: 100, isBaby: false }, 100)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import {
  feed,
  isInLove,
  canBreed,
  onBreedComplete,
  LOVE_DURATION_TICKS,
} from './animal_breed_love';

const base = { inLoveUntilTick: 0, breedCooldownUntilTick: 0 };

describe('animal breed love', () => {
  it('feed sets love', () => {
    const a = feed(base, 100);
    expect(isInLove(a, 200)).toBe(true);
  });

  it('cooldown blocks feed', () => {
    const a = feed({ ...base, breedCooldownUntilTick: 1000 }, 500);
    expect(isInLove(a, 600)).toBe(false);
  });

  it('expires', () => {
    const a = feed(base, 0);
    expect(isInLove(a, LOVE_DURATION_TICKS + 1)).toBe(false);
  });

  it('canBreed requires both + range', () => {
    const a = feed(base, 0);
    const b = feed(base, 0);
    expect(canBreed(a, b, 3, 100)).toBe(true);
    expect(canBreed(a, b, 20, 100)).toBe(false);
  });

  it('onBreed sets cooldown', () => {
    const r = onBreedComplete(feed(base, 0), 100);
    expect(r.breedCooldownUntilTick).toBeGreaterThan(100);
    expect(r.inLoveUntilTick).toBe(0);
  });
});

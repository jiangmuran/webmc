import { describe, it, expect } from 'vitest';
import {
  enterLoveMode,
  canBreed,
  onBreedComplete,
  LOVE_MODE_TICKS,
  BREEDING_COOLDOWN_TICKS,
  type BreedableState,
} from './breeding_love_mode';

function adult(id: string): BreedableState {
  return { id, entityType: 'cow', loveModeTicks: 0, lastBredAt: -999999, isBaby: false };
}

describe('breeding love mode', () => {
  it('adult enters love mode', () => {
    expect(enterLoveMode(adult('a')).loveModeTicks).toBe(LOVE_MODE_TICKS);
  });

  it('baby stays out of love mode', () => {
    const baby = { ...adult('a'), isBaby: true };
    expect(enterLoveMode(baby).loveModeTicks).toBe(0);
  });

  it('two adults in love can breed', () => {
    const a = enterLoveMode(adult('a'));
    const b = enterLoveMode(adult('b'));
    expect(canBreed(a, b, 0)).toBe(true);
  });

  it('different species cannot breed', () => {
    const a = enterLoveMode({ ...adult('a'), entityType: 'cow' });
    const b = enterLoveMode({ ...adult('b'), entityType: 'pig' });
    expect(canBreed(a, b, 0)).toBe(false);
  });

  it('cooldown blocks', () => {
    const a = enterLoveMode({ ...adult('a'), lastBredAt: 1000 });
    const b = enterLoveMode({ ...adult('b'), lastBredAt: 1000 });
    expect(canBreed(a, b, 1500)).toBe(false);
  });

  it('onComplete records breed time', () => {
    const a = enterLoveMode(adult('a'));
    const b = enterLoveMode(adult('b'));
    const after = onBreedComplete(a, b, 12345);
    expect(after.a.lastBredAt).toBe(12345);
  });

  it('post-breed no love mode', () => {
    const a = enterLoveMode(adult('a'));
    expect(onBreedComplete(a, a, 100).a.loveModeTicks).toBe(0);
  });

  it('enters cooldown window', () => {
    expect(BREEDING_COOLDOWN_TICKS).toBeGreaterThan(0);
  });
});

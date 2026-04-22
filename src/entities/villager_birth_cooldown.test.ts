import { describe, it, expect } from 'vitest';
import { canBreed, breed, feed, BIRTH_COOLDOWN_MS } from './villager_birth_cooldown';

function adult(): { isAdult: boolean; willingness: number; lastBirthMs: number } {
  return { isAdult: true, willingness: 0, lastBirthMs: -Infinity };
}

describe('villager breed', () => {
  it('child blocks breed', () => {
    const a = adult();
    const b = adult();
    a.isAdult = false;
    feed(a);
    feed(b);
    expect(canBreed(a, b, 0, 1)).toBe(false);
  });

  it('willingness needed', () => {
    const a = adult();
    const b = adult();
    expect(canBreed(a, b, 0, 1)).toBe(false);
    feed(a);
    feed(b);
    expect(canBreed(a, b, 0, 1)).toBe(true);
  });

  it('needs bed', () => {
    const a = adult();
    const b = adult();
    feed(a);
    feed(b);
    expect(canBreed(a, b, 0, 0)).toBe(false);
  });

  it('cooldown blocks', () => {
    const a = adult();
    const b = adult();
    feed(a);
    feed(b);
    breed(a, b, 0);
    feed(a);
    feed(b);
    expect(canBreed(a, b, BIRTH_COOLDOWN_MS - 1, 1)).toBe(false);
    expect(canBreed(a, b, BIRTH_COOLDOWN_MS + 1, 1)).toBe(true);
  });
});

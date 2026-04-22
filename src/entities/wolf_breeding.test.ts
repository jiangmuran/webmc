import { describe, it, expect } from 'vitest';
import { feedMeat, inLoveMode, makeWolfBreeding, tryBreed } from './wolf_breeding';

describe('wolf breeding', () => {
  it('feed puts tamed wolf in love mode', () => {
    const w = makeWolfBreeding(true, 'p1', 'pale');
    feedMeat(w, 0, true);
    expect(inLoveMode(w, 10)).toBe(true);
  });

  it('untamed refuses', () => {
    const w = makeWolfBreeding(false, null, 'pale');
    expect(feedMeat(w, 0, true)).toBe(false);
  });

  it('hurt wolf refuses feed', () => {
    const w = makeWolfBreeding(true, 'p1', 'pale');
    expect(feedMeat(w, 0, false)).toBe(false);
  });

  it('both in love mode = puppy', () => {
    const a = makeWolfBreeding(true, 'p1', 'pale');
    const b = makeWolfBreeding(true, 'p1', 'black');
    feedMeat(a, 0, true);
    feedMeat(b, 0, true);
    const puppy = tryBreed({ a, b, nowSec: 5, rng: () => 0.3 });
    expect(puppy).not.toBeNull();
    expect(['pale', 'black']).toContain(puppy?.variant);
  });

  it('single lover = no puppy', () => {
    const a = makeWolfBreeding(true, 'p1', 'pale');
    const b = makeWolfBreeding(true, 'p1', 'black');
    feedMeat(a, 0, true);
    expect(tryBreed({ a, b, nowSec: 5, rng: () => 0.3 })).toBeNull();
  });

  it('breeding ends love mode', () => {
    const a = makeWolfBreeding(true, 'p1', 'pale');
    const b = makeWolfBreeding(true, 'p1', 'black');
    feedMeat(a, 0, true);
    feedMeat(b, 0, true);
    tryBreed({ a, b, nowSec: 5, rng: () => 0.3 });
    expect(inLoveMode(a, 5)).toBe(false);
  });
});

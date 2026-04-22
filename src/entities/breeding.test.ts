import { describe, it, expect } from 'vitest';
import {
  attemptBreed,
  canBreedWith,
  enterLoveMode,
  makeBreedable,
  tickBreedable,
} from './breeding';

describe('breeding', () => {
  it('cows breed with wheat', () => {
    const c = makeBreedable('cow');
    expect(canBreedWith(c, 'webmc:wheat')).toBe(true);
    expect(canBreedWith(c, 'webmc:carrot')).toBe(false);
  });

  it('babies cannot breed', () => {
    const c = makeBreedable('cow', false);
    expect(canBreedWith(c, 'webmc:wheat')).toBe(false);
  });

  it('two in love produce a baby', () => {
    const a = makeBreedable('pig');
    const b = makeBreedable('pig');
    enterLoveMode(a);
    enterLoveMode(b);
    const r = attemptBreed(a, b);
    expect(r.produced).toBe(true);
    expect(r.babyKind).toBe('pig');
  });

  it("different kinds don't breed", () => {
    const a = makeBreedable('cow');
    const b = makeBreedable('pig');
    enterLoveMode(a);
    enterLoveMode(b);
    const r = attemptBreed(a, b);
    expect(r.produced).toBe(false);
  });

  it('breed cooldown prevents immediate re-breed', () => {
    const a = makeBreedable('cow');
    const b = makeBreedable('cow');
    enterLoveMode(a);
    enterLoveMode(b);
    attemptBreed(a, b);
    expect(enterLoveMode(a)).toBe(false);
  });

  it('baby grows up after ~20 min', () => {
    const c = makeBreedable('sheep', false);
    tickBreedable(c, 1201);
    expect(c.isAdult).toBe(true);
  });
});

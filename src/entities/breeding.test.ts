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

  it('cats + ocelots breed with cod and salmon (wiki, not legacy raw_fish)', () => {
    // Wiki (minecraft.wiki/w/Cat + /w/Ocelot): "tamed/bred with raw cod
    // and raw salmon." `raw_fish` was the pre-1.13 generic name and
    // doesn't exist in modern MC.
    const c = makeBreedable('cat');
    expect(canBreedWith(c, 'webmc:cod')).toBe(true);
    expect(canBreedWith(c, 'webmc:salmon')).toBe(true);
    expect(canBreedWith(c, 'webmc:raw_fish')).toBe(false);
    const o = makeBreedable('ocelot');
    expect(canBreedWith(o, 'webmc:cod')).toBe(true);
    expect(canBreedWith(o, 'webmc:salmon')).toBe(true);
  });
});

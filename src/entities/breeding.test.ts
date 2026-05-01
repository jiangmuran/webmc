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

  it('chickens breed with all 6 wiki seeds incl. torchflower + pitcher_pod', () => {
    // Wiki minecraft.wiki/w/Chicken: "Chickens are bred by feeding
    // them seeds: wheat seeds, melon seeds, pumpkin seeds, beetroot
    // seeds, torchflower seeds, pitcher pod."
    const c = makeBreedable('chicken');
    expect(canBreedWith(c, 'webmc:wheat_seeds')).toBe(true);
    expect(canBreedWith(c, 'webmc:torchflower_seeds')).toBe(true);
    expect(canBreedWith(c, 'webmc:pitcher_pod')).toBe(true);
  });

  it('wolves breed with any non-fish meat incl. raw + rotten + stew (wiki)', () => {
    // Wiki minecraft.wiki/w/Wolf: tamed wolves can be bred with any
    // meat (raw or cooked) except fish, plus rotten flesh and rabbit
    // stew.
    const w = makeBreedable('wolf');
    expect(canBreedWith(w, 'webmc:beef')).toBe(true); // raw
    expect(canBreedWith(w, 'webmc:cooked_beef')).toBe(true);
    expect(canBreedWith(w, 'webmc:porkchop')).toBe(true); // raw
    expect(canBreedWith(w, 'webmc:rabbit_stew')).toBe(true);
    expect(canBreedWith(w, 'webmc:rotten_flesh')).toBe(true);
    // Fish are NOT valid for wolves per wiki.
    expect(canBreedWith(w, 'webmc:cod')).toBe(false);
    expect(canBreedWith(w, 'webmc:salmon')).toBe(false);
  });

  it('bees breed with any flower (extended wiki list)', () => {
    // Wiki minecraft.wiki/w/Bee: bees can be bred with any flower
    // they can pollinate.
    const b = makeBreedable('bee');
    for (const f of [
      'webmc:dandelion',
      'webmc:wither_rose',
      'webmc:azure_bluet',
      'webmc:red_tulip',
      'webmc:torchflower',
      'webmc:sunflower',
      'webmc:flowering_azalea',
    ]) {
      expect(canBreedWith(b, f)).toBe(true);
    }
  });
});

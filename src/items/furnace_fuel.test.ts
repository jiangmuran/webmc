import { describe, it, expect } from 'vitest';
import {
  burnSecondsFor,
  igniteFurnace,
  isFuel,
  makeBurn,
  smeltsPerUnit,
  tickBurn,
} from './furnace_fuel';

describe('furnace fuel', () => {
  it('coal burns 80s', () => {
    expect(burnSecondsFor('webmc:coal')).toBe(80);
  });

  it('stone is not fuel', () => {
    expect(isFuel('webmc:stone')).toBe(false);
  });

  it('lava bucket is the longest fuel', () => {
    expect(burnSecondsFor('webmc:lava_bucket')).toBe(1000);
  });

  it('coal smelts 8 items', () => {
    expect(smeltsPerUnit('webmc:coal')).toBe(8);
  });

  it('ignite sets burn time and consumes fuel', () => {
    const s = makeBurn();
    expect(igniteFurnace(s, 'webmc:coal')).toBe(true);
    expect(s.burnSecondsRemaining).toBe(80);
  });

  it('cannot ignite already-burning furnace', () => {
    const s = makeBurn();
    igniteFurnace(s, 'webmc:coal');
    expect(igniteFurnace(s, 'webmc:coal')).toBe(false);
  });

  it('cannot ignite with non-fuel', () => {
    const s = makeBurn();
    expect(igniteFurnace(s, 'webmc:stone')).toBe(false);
  });

  it('tick reduces burn time', () => {
    const s = makeBurn();
    igniteFurnace(s, 'webmc:coal');
    tickBurn(s, 5);
    expect(s.burnSecondsRemaining).toBe(75);
  });

  it('all wood types burn — not just oak (wiki #minecraft:logs)', () => {
    // Wiki canon: every wood-family planks/log/wood/etc burns for
    // 1.5 smelts = 15 s. Old table only had oak; spruce/birch/etc.
    // were treated as non-fuel.
    for (const id of [
      'webmc:spruce_planks',
      'webmc:birch_log',
      'webmc:jungle_wood',
      'webmc:acacia_stairs',
      'webmc:dark_oak_fence',
      'webmc:mangrove_pressure_plate',
      'webmc:cherry_trapdoor',
      'webmc:pale_oak_planks',
      'webmc:crimson_stem',
      'webmc:warped_hyphae',
      'webmc:bamboo_block',
    ]) {
      expect(burnSecondsFor(id)).toBe(15);
    }
    // Slabs are half-thickness = 7.5 s
    expect(burnSecondsFor('webmc:spruce_slab')).toBe(7.5);
    // Doors = 10 s
    expect(burnSecondsFor('webmc:cherry_door')).toBe(10);
    // Buttons + saplings = 5 s
    expect(burnSecondsFor('webmc:birch_button')).toBe(5);
    expect(burnSecondsFor('webmc:spruce_sapling')).toBe(5);
  });

  it('scaffolding burns 2.5 s per wiki (was 2 — off by 0.5)', () => {
    expect(burnSecondsFor('webmc:scaffolding')).toBe(2.5);
  });

  it('any colored wool burns 5 s per wiki', () => {
    for (const id of ['webmc:white_wool', 'webmc:black_wool', 'webmc:wool_red', 'webmc:wool']) {
      expect(burnSecondsFor(id)).toBe(5);
    }
  });
});

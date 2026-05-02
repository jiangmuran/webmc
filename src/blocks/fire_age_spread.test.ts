import { describe, it, expect } from 'vitest';
import { isFlammable, tickFire, tryIgniteNeighbor, FIRE_AGE_MAX } from './fire_age_spread';

describe('fire', () => {
  it('flammable list', () => {
    expect(isFlammable('webmc:oak_log')).toBe(true);
    expect(isFlammable('webmc:stone')).toBe(false);
  });

  it('rain burns out', () => {
    expect(tickFire({ age: 0, rand: () => 0, isRaining: true, humidityIsHigh: false })).toBe(
      'burn_out',
    );
  });

  it('old fire burns out', () => {
    expect(
      tickFire({ age: FIRE_AGE_MAX, rand: () => 0, isRaining: false, humidityIsHigh: false }),
    ).toBe('burn_out');
  });

  it('normal ages up', () => {
    expect(tickFire({ age: 0, rand: () => 0.99, isRaining: false, humidityIsHigh: false })).toBe(
      'age_up',
    );
  });

  it('non-flammable neighbor rejected', () => {
    expect(tryIgniteNeighbor({ targetBlockId: 'webmc:stone', fireAge: 5, rand: () => 0 })).toBe(
      false,
    );
  });

  it('flammable neighbor ignites', () => {
    expect(tryIgniteNeighbor({ targetBlockId: 'webmc:oak_log', fireAge: 5, rand: () => 0 })).toBe(
      true,
    );
  });

  it('all wood types are flammable per wiki (not just oak)', () => {
    // Wiki minecraft.wiki/w/Fire: every wood-family log/planks/leaves
    // burns. Old table only had oak.
    for (const id of [
      'webmc:spruce_log',
      'webmc:birch_planks',
      'webmc:jungle_leaves',
      'webmc:acacia_log',
      'webmc:dark_oak_planks',
      'webmc:mangrove_leaves',
      'webmc:cherry_log',
      'webmc:pale_oak_planks',
      'webmc:stripped_spruce_log',
    ]) {
      expect(isFlammable(id)).toBe(true);
    }
    // Crimson/warped are explicitly non-flammable per wiki.
    expect(isFlammable('webmc:crimson_planks')).toBe(false);
    expect(isFlammable('webmc:warped_log')).toBe(false);
  });

  it('bamboo + vines + grass are flammable per wiki', () => {
    expect(isFlammable('webmc:bamboo')).toBe(true);
    expect(isFlammable('webmc:vine')).toBe(true);
    expect(isFlammable('webmc:short_grass')).toBe(true);
  });
});

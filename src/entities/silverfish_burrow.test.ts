import { describe, it, expect } from 'vitest';
import { tryBurrow, infestedFor, BURROW_CHANCE } from './silverfish_burrow';

describe('silverfish burrow', () => {
  it('burrows on hit + stone + roll', () => {
    expect(
      tryBurrow({
        damageReceived: true,
        adjacentStoneFamilyId: 'webmc:stone',
        rand: () => 0,
      }),
    ).toBe('webmc:infested_stone');
  });

  it('no damage = no burrow', () => {
    expect(
      tryBurrow({
        damageReceived: false,
        adjacentStoneFamilyId: 'webmc:stone',
        rand: () => 0,
      }),
    ).toBeNull();
  });

  it('high roll misses', () => {
    expect(
      tryBurrow({
        damageReceived: true,
        adjacentStoneFamilyId: 'webmc:stone',
        rand: () => BURROW_CHANCE + 0.01,
      }),
    ).toBeNull();
  });

  it('unknown host null', () => {
    expect(infestedFor('webmc:dirt')).toBeNull();
  });

  it('deepslate maps', () => {
    expect(infestedFor('webmc:deepslate')).toBe('webmc:infested_deepslate');
  });
});

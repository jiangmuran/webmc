import { describe, it, expect } from 'vitest';
import { canDig, rollFind, validSoil } from './sniffer_seed_dig';

describe('sniffer seed dig', () => {
  it('can dig when cool + valid', () => {
    expect(canDig({ onValidSoil: true, cooldownRemaining: 0, rand: Math.random })).toBe(true);
  });

  it('cooldown blocks', () => {
    expect(canDig({ onValidSoil: true, cooldownRemaining: 100, rand: Math.random })).toBe(false);
  });

  it('invalid soil blocks', () => {
    expect(canDig({ onValidSoil: false, cooldownRemaining: 0, rand: Math.random })).toBe(false);
  });

  it('roll torchflower below 0.5 (wiki: 50/50)', () => {
    expect(rollFind(() => 0)).toBe('torchflower_seeds');
    expect(rollFind(() => 0.4)).toBe('torchflower_seeds');
  });

  it('roll pitcher above 0.5 (wiki: 50/50)', () => {
    expect(rollFind(() => 0.6)).toBe('pitcher_pod');
    expect(rollFind(() => 0.99)).toBe('pitcher_pod');
  });

  it('validSoil list (wiki: includes mud, moss, mycelium)', () => {
    expect(validSoil('grass_block')).toBe(true);
    expect(validSoil('mud')).toBe(true);
    expect(validSoil('moss_block')).toBe(true);
    expect(validSoil('muddy_mangrove_roots')).toBe(true);
    expect(validSoil('mycelium')).toBe(true);
    expect(validSoil('stone')).toBe(false);
  });
});

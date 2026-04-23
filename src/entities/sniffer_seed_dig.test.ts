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

  it('roll rare pitcher', () => {
    expect(rollFind(() => 0)).toBe('pitcher_pod');
  });

  it('roll common torchflower', () => {
    expect(rollFind(() => 0.2)).toBe('torchflower_seeds');
  });

  it('roll null', () => {
    expect(rollFind(() => 0.9)).toBeNull();
  });

  it('validSoil list', () => {
    expect(validSoil('grass_block')).toBe(true);
    expect(validSoil('stone')).toBe(false);
  });
});

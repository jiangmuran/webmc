import { describe, it, expect } from 'vitest';
import { cookedResult, canPlaceItem, COOK_TICKS } from './campfire_smelt_food';

describe('campfire smelt food', () => {
  it('cooks after threshold', () => {
    expect(cookedResult({ input: 'beef', ticksOnCampfire: COOK_TICKS })).toBe('cooked_beef');
  });

  it('undercooked', () => {
    expect(cookedResult({ input: 'beef', ticksOnCampfire: 100 })).toBeUndefined();
  });

  it('inedible input', () => {
    expect(cookedResult({ input: 'stone', ticksOnCampfire: COOK_TICKS })).toBeUndefined();
  });

  it('placement check', () => {
    expect(canPlaceItem('potato')).toBe(true);
    expect(canPlaceItem('diamond')).toBe(false);
  });
});

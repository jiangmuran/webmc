import { describe, it, expect } from 'vitest';
import { milk, milkRemovesEffects, goatMilksEqualToCow } from './cow_milk';

describe('cow milk', () => {
  it('cow + bucket = milk', () => {
    expect(milk({ bucketKind: 'empty', mobType: 'cow' }).kind).toBe('milk_bucket');
  });
  it('mooshroom + bowl = stew', () => {
    expect(milk({ bucketKind: 'bowl', mobType: 'mooshroom' }).kind).toBe('mushroom_stew');
  });
  it('wrong container = none', () => {
    expect(milk({ bucketKind: 'other', mobType: 'cow' }).kind).toBe('none');
  });
  it('goat = milk', () => {
    expect(milk({ bucketKind: 'empty', mobType: 'goat' }).kind).toBe('milk_bucket');
  });
  it('milk clears effects', () => {
    expect(milkRemovesEffects()).toBe(true);
  });
  it('goat equivalent', () => {
    expect(goatMilksEqualToCow()).toBe(true);
  });
});

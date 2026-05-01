import { describe, it, expect } from 'vitest';
import { milk, milkRemovesEffects, goatMilksEqualToCow } from './cow_milk';

describe('cow milk', () => {
  it('cow + bucket = milk', () => {
    expect(milk({ bucketKind: 'empty', mobType: 'cow' }).kind).toBe('milk_bucket');
  });
  it('mooshroom + bowl = stew', () => {
    expect(milk({ bucketKind: 'bowl', mobType: 'mooshroom' }).kind).toBe('mushroom_stew');
  });

  it('mooshroom + empty bucket = milk (wiki: same as cow)', () => {
    // Wiki (minecraft.wiki/w/Mooshroom): "Mooshrooms can be milked
    // the same way as a normal cow with an empty bucket."
    expect(milk({ bucketKind: 'empty', mobType: 'mooshroom' }).kind).toBe('milk_bucket');
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

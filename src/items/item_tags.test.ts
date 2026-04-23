import { describe, it, expect } from 'vitest';
import { makeItemTags, addTag, inTag, seedDefaultItemTags } from './item_tags';

describe('item tags', () => {
  it('add + query', () => {
    const r = makeItemTags();
    addTag(r, 'heavy', ['iron_block']);
    expect(inTag(r, 'iron_block', 'heavy')).toBe(true);
  });

  it('unknown not in tag', () => {
    expect(inTag(makeItemTags(), 'stick', 'heavy')).toBe(false);
  });

  it('defaults: fishes', () => {
    const r = makeItemTags();
    seedDefaultItemTags(r);
    expect(inTag(r, 'cod', 'fishes')).toBe(true);
  });

  it('defaults: piglin loves gold', () => {
    const r = makeItemTags();
    seedDefaultItemTags(r);
    expect(inTag(r, 'gold_ingot', 'piglin_loved')).toBe(true);
  });

  it('defaults: arrows covers tipped', () => {
    const r = makeItemTags();
    seedDefaultItemTags(r);
    expect(inTag(r, 'tipped_arrow', 'arrows')).toBe(true);
  });
});

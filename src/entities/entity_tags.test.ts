import { describe, it, expect } from 'vitest';
import { makeEntityTags, tagEntity, hasTag, seedDefaults } from './entity_tags';

describe('entity tags', () => {
  it('add + query', () => {
    const r = makeEntityTags();
    tagEntity(r, 'friendly', ['cow']);
    expect(hasTag(r, 'cow', 'friendly')).toBe(true);
  });

  it('defaults: undead zombie', () => {
    const r = makeEntityTags();
    seedDefaults(r);
    expect(hasTag(r, 'zombie', 'undead')).toBe(true);
  });

  it('defaults: bogged undead', () => {
    const r = makeEntityTags();
    seedDefaults(r);
    expect(hasTag(r, 'bogged', 'undead')).toBe(true);
  });

  it('defaults: skeleton_horse + zombie_horse undead (wiki: 1.9+)', () => {
    const r = makeEntityTags();
    seedDefaults(r);
    expect(hasTag(r, 'skeleton_horse', 'undead')).toBe(true);
    expect(hasTag(r, 'zombie_horse', 'undead')).toBe(true);
  });

  it('defaults: raiders include ravager', () => {
    const r = makeEntityTags();
    seedDefaults(r);
    expect(hasTag(r, 'ravager', 'raiders')).toBe(true);
  });

  it('unknown false', () => {
    expect(hasTag(makeEntityTags(), 'cow', 'missing')).toBe(false);
  });
});

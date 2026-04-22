import { describe, it, expect } from 'vitest';
import { TagRegistry, registerStandardTags } from './tags';

describe('tag registry', () => {
  it('define + contains', () => {
    const r = new TagRegistry();
    r.define('x', ['webmc:a', 'webmc:b']);
    expect(r.contains('x', 'webmc:a')).toBe(true);
    expect(r.contains('x', 'webmc:c')).toBe(false);
  });

  it('nested tags resolve', () => {
    const r = new TagRegistry();
    r.define('wood', ['webmc:oak_planks']);
    r.define('crafting', ['#wood', 'webmc:stick']);
    expect(r.contains('crafting', 'webmc:oak_planks')).toBe(true);
    expect(r.contains('crafting', 'webmc:stick')).toBe(true);
  });

  it('standard tags populate planks', () => {
    const r = new TagRegistry();
    registerStandardTags(r);
    expect(r.contains('planks', 'webmc:oak_planks')).toBe(true);
    expect(r.contains('planks', 'webmc:cherry_planks')).toBe(true);
  });

  it('all() flattens nested tags', () => {
    const r = new TagRegistry();
    r.define('a', ['webmc:x', '#b']);
    r.define('b', ['webmc:y']);
    const members = r.all('a');
    expect(members).toContain('webmc:x');
    expect(members).toContain('webmc:y');
  });
});

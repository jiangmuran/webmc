import { describe, it, expect } from 'vitest';
import { makeRegistry, registerTag, hasTag, idsIn, tagsFor, seedDefaults } from './block_tags';

describe('block tags', () => {
  it('registers ids', () => {
    const r = makeRegistry();
    registerTag(r, 'my_tag', ['stone', 'dirt']);
    expect(hasTag(r, 'stone', 'my_tag')).toBe(true);
  });

  it('unknown tag false', () => {
    expect(hasTag(makeRegistry(), 'stone', 'none')).toBe(false);
  });

  it('append adds', () => {
    const r = makeRegistry();
    registerTag(r, 't', ['a']);
    registerTag(r, 't', ['b']);
    expect(idsIn(r, 't').sort()).toEqual(['a', 'b']);
  });

  it('tagsFor lists', () => {
    const r = makeRegistry();
    registerTag(r, 'logs', ['oak_log']);
    registerTag(r, 'flammable', ['oak_log']);
    expect(tagsFor(r, 'oak_log').sort()).toEqual(['flammable', 'logs']);
  });

  it('defaults seed logs', () => {
    const r = makeRegistry();
    seedDefaults(r);
    expect(hasTag(r, 'oak_log', 'logs')).toBe(true);
  });
});

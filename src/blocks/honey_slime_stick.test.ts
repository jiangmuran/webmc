import { describe, it, expect } from 'vitest';
import { collectPushGroup, sticksTo, stickyKindOf } from './honey_slime_stick';

describe('honey/slime adhesion', () => {
  it('slime and honey do not stick to each other', () => {
    expect(sticksTo('webmc:slime_block', 'webmc:honey_block')).toBe(false);
    expect(sticksTo('webmc:honey_block', 'webmc:slime_block')).toBe(false);
  });

  it('slime sticks to stone', () => {
    expect(sticksTo('webmc:slime_block', 'webmc:stone')).toBe(true);
  });

  it('honey sticks to stone', () => {
    expect(sticksTo('webmc:honey_block', 'webmc:stone')).toBe(true);
  });

  it('stone does not stick to stone', () => {
    expect(sticksTo('webmc:stone', 'webmc:stone')).toBe(false);
  });

  it('stickyKindOf classifies', () => {
    expect(stickyKindOf('webmc:slime_block')).toBe('slime');
    expect(stickyKindOf('webmc:honey_block')).toBe('honey');
    expect(stickyKindOf('webmc:dirt')).toBe('neither');
  });

  it('push group traverses sticky chain', () => {
    const graph = {
      neighborsOf: (key: string): string[] => {
        if (key === 'a') return ['b'];
        if (key === 'b') return ['a', 'c'];
        if (key === 'c') return ['b', 'd'];
        if (key === 'd') return ['c'];
        return [];
      },
      blockAt: (key: string): string => {
        if (key === 'a') return 'webmc:slime_block';
        if (key === 'b') return 'webmc:stone';
        if (key === 'c') return 'webmc:slime_block';
        if (key === 'd') return 'webmc:honey_block';
        return 'webmc:air';
      },
    };
    const g = collectPushGroup('a', graph);
    expect(g.has('a')).toBe(true);
    expect(g.has('b')).toBe(true);
    expect(g.has('c')).toBe(true);
    expect(g.has('d')).toBe(false);
  });
});

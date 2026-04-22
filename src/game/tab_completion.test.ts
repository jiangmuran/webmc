import { describe, it, expect } from 'vitest';
import { arg, complete, lit, type CommandNode } from './tab_completion';

const ROOT: CommandNode = {
  name: '',
  children: [lit('help'), lit('tp', arg('player')), lit('give', arg('player'), arg('item'))],
  argKind: 'literal',
};

const CTX = {
  players: ['alice', 'bob', 'charlie'],
  blockIds: ['webmc:stone', 'webmc:dirt'],
  itemIds: ['webmc:diamond', 'webmc:iron_ingot'],
};

describe('tab completion', () => {
  it('lists commands on empty', () => {
    const r = complete('/', ROOT, CTX);
    expect(r.map((c) => c.completion)).toEqual(['give', 'help', 'tp']);
  });

  it('prefix filters commands', () => {
    const r = complete('/t', ROOT, CTX);
    expect(r.map((c) => c.completion)).toEqual(['tp']);
  });

  it('completes players after /tp', () => {
    const r = complete('/tp ', ROOT, CTX);
    expect(r.map((c) => c.completion)).toEqual(['alice', 'bob', 'charlie']);
  });

  it('filters player names by prefix', () => {
    const r = complete('/tp b', ROOT, CTX);
    expect(r.map((c) => c.completion)).toEqual(['bob']);
  });

  it('non-command input returns no completions', () => {
    expect(complete('hi there', ROOT, CTX)).toEqual([]);
  });
});

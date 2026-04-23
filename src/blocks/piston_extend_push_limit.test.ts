import { describe, it, expect } from 'vitest';
import { canPush, isImmovable, MAX_PUSH_BLOCKS } from './piston_extend_push_limit';

describe('piston push limit', () => {
  it('obsidian immovable', () => {
    expect(isImmovable('obsidian')).toBe(true);
  });

  it('furnace immovable', () => {
    expect(isImmovable('blast_furnace')).toBe(true);
  });

  it('stone push ok', () => {
    expect(canPush(['stone', 'cobblestone'])).toBe(true);
  });

  it('chain too long fails', () => {
    expect(canPush(Array<string>(MAX_PUSH_BLOCKS + 1).fill('stone'))).toBe(false);
  });

  it('immovable in chain blocks', () => {
    expect(canPush(['stone', 'obsidian'])).toBe(false);
  });
});

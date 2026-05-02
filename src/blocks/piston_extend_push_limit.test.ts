import { describe, it, expect } from 'vitest';
import { canPush, isImmovable, MAX_PUSH_BLOCKS } from './piston_extend_push_limit';

describe('piston push limit', () => {
  it('obsidian immovable', () => {
    expect(isImmovable('obsidian')).toBe(true);
  });

  it('furnace family is MOVABLE in Java 1.13+ (wiki)', () => {
    expect(isImmovable('blast_furnace')).toBe(false);
    expect(isImmovable('furnace')).toBe(false);
    expect(isImmovable('smoker')).toBe(false);
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

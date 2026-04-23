import { describe, it, expect } from 'vitest';
import {
  canGrow,
  isBrokenByAdjacentBlock,
  damageToTouchingEntities,
  MAX_AGE,
  MAX_HEIGHT,
} from './cactus_grow_damage';

describe('cactus grow damage', () => {
  it('grows when free + mature', () => {
    expect(canGrow({ age: MAX_AGE, adjacentToBlock: false }, 0)).toBe(true);
  });

  it('blocked by neighbor', () => {
    expect(canGrow({ age: MAX_AGE, adjacentToBlock: true }, 0)).toBe(false);
  });

  it('caps at max height', () => {
    expect(canGrow({ age: MAX_AGE, adjacentToBlock: false }, MAX_HEIGHT)).toBe(false);
  });

  it('break when adjacent', () => {
    expect(isBrokenByAdjacentBlock({ age: 0, adjacentToBlock: true })).toBe(true);
  });

  it('damages entities', () => {
    expect(damageToTouchingEntities()).toBe(1);
  });
});

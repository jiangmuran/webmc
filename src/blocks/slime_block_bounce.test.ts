import { describe, it, expect } from 'vitest';
import {
  landVelocity,
  preventsFallDamage,
  pistonMovesAdjacent,
  incompatibleWithHoneyDrag,
} from './slime_block_bounce';

describe('slime block bounce', () => {
  it('inverts velocity', () => {
    expect(landVelocity({ velocityY: -1, sneaking: false })).toBe(1);
  });

  it('sneak absorbs', () => {
    expect(landVelocity({ velocityY: -2, sneaking: true })).toBe(0);
  });

  it('prevents fall damage regardless of sneak (wiki, since 1.21.2)', () => {
    expect(preventsFallDamage(false)).toBe(true);
    expect(preventsFallDamage(true)).toBe(true);
  });

  it('piston drags adjacent', () => {
    expect(pistonMovesAdjacent()).toBe(true);
  });

  it('no drag to honey', () => {
    expect(incompatibleWithHoneyDrag()).toBe(true);
  });
});

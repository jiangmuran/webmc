import { describe, it, expect } from 'vitest';
import { bubbleColumnAbove, columnPushVy, tickMagmaDamage } from './magma_damage';

const BASE = {
  onMagma: true,
  sneaking: false,
  fireResistance: false,
  frostWalker: false,
  levitating: false,
  riding: false,
  secondsAccumulated: 0,
};

describe('magma damage', () => {
  it('takes 1 damage per 0.5s', () => {
    const r = tickMagmaDamage(BASE, 0.5);
    expect(r.damage).toBe(1);
  });

  it('sneaking bypasses', () => {
    expect(tickMagmaDamage({ ...BASE, sneaking: true }, 2).damage).toBe(0);
  });

  it('fire resistance bypasses', () => {
    expect(tickMagmaDamage({ ...BASE, fireResistance: true }, 2).damage).toBe(0);
  });

  it('frost walker bypasses', () => {
    expect(tickMagmaDamage({ ...BASE, frostWalker: true }, 2).damage).toBe(0);
  });

  it('no magma = no damage', () => {
    expect(tickMagmaDamage({ ...BASE, onMagma: false }, 2).damage).toBe(0);
  });

  it('accumulates into second tick', () => {
    const r = tickMagmaDamage(BASE, 1);
    expect(r.damage).toBe(2);
  });
});

describe('bubble columns', () => {
  it('magma → downward', () => {
    expect(bubbleColumnAbove('magma_block')).toBe('downward');
  });

  it('soul sand → upward', () => {
    expect(bubbleColumnAbove('soul_sand')).toBe('upward');
  });

  it('upward push is positive', () => {
    expect(columnPushVy('upward')).toBeGreaterThan(0);
  });

  it('downward push is negative', () => {
    expect(columnPushVy('downward')).toBeLessThan(0);
  });
});

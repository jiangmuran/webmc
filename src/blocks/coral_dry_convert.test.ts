import { describe, it, expect } from 'vitest';
import { shouldDie, deadName, breakDrops, type Coral } from './coral_dry_convert';

function coral(over: Partial<Coral> = {}): Coral {
  return { color: 'tube', shape: 'block', dead: false, waterlogged: false, ...over };
}

describe('coral', () => {
  it('dies without water', () => {
    expect(shouldDie(coral(), { adjacentWater: false })).toBe(true);
  });

  it('lives with adjacent water', () => {
    expect(shouldDie(coral(), { adjacentWater: true })).toBe(false);
  });

  it('waterlogged stays', () => {
    expect(shouldDie(coral({ waterlogged: true }), { adjacentWater: false })).toBe(false);
  });

  it('already dead', () => {
    expect(shouldDie(coral({ dead: true }), { adjacentWater: false })).toBe(false);
  });

  it('dead name', () => {
    expect(deadName(coral({ color: 'fire' }))).toBe('webmc:dead_fire_coral_block');
  });

  it('silk touch drops coral', () => {
    expect(breakDrops(coral(), true)).toBe('webmc:tube_coral_block');
    expect(breakDrops(coral(), false)).toBeNull();
  });
});

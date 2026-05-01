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

  it('silk touch drops live coral; without silk drops dead (wiki)', () => {
    expect(breakDrops(coral(), true)).toBe('webmc:tube_coral_block');
    // Wiki: "if mined with a pickaxe not enchanted with Silk Touch,
    // they drop the respective dead coral block."
    expect(breakDrops(coral(), false)).toBe('webmc:dead_tube_coral_block');
    expect(breakDrops(coral({ dead: true }), false)).toBe('webmc:dead_tube_coral_block');
  });

  it('coral fans drop nothing without silk touch (wiki)', () => {
    // Wiki (minecraft.wiki/w/Coral_Fan): "Breaking coral fans without
    // Silk Touch destroys the coral fan." Unlike coral blocks, there
    // is no dead-fan dropped fallback.
    expect(breakDrops(coral({ shape: 'fan' }), false)).toBeNull();
    expect(breakDrops(coral({ shape: 'wall_fan' }), false)).toBeNull();
    expect(breakDrops(coral({ shape: 'fan' }), true)).toBe('webmc:tube_coral_fan');
  });
});

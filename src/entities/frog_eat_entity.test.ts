import { describe, it, expect } from 'vitest';
import { canEat, dropFromFrogEat, tongueRange } from './frog_eat_entity';

describe('frog eat entity', () => {
  it('eats small slime', () => {
    expect(canEat('slime_small')).toBe(true);
  });

  it('does not eat large slime', () => {
    expect(canEat('slime')).toBe(false);
  });

  it('temperate frog drops pearlescent (wiki)', () => {
    expect(dropFromFrogEat('magma_cube_small', 'temperate')).toBe('pearlescent_froglight');
  });

  it('warm frog drops ochre (wiki)', () => {
    expect(dropFromFrogEat('magma_cube_small', 'warm')).toBe('ochre_froglight');
  });

  it('cold frog drops verdant', () => {
    expect(dropFromFrogEat('magma_cube_small', 'cold')).toBe('verdant_froglight');
  });

  it('no drop from slime', () => {
    expect(dropFromFrogEat('slime_small', 'warm')).toBeUndefined();
  });

  it('tongue range 10', () => {
    expect(tongueRange()).toBe(10);
  });
});

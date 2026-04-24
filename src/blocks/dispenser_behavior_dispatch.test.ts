import { describe, it, expect } from 'vitest';
import { behaviorFor } from './dispenser_behavior_dispatch';

describe('dispenser behavior dispatch', () => {
  it('arrow shoots', () => {
    expect(behaviorFor('arrow')).toBe('shoot_arrow');
  });

  it('flint and steel ignites', () => {
    expect(behaviorFor('flint_and_steel')).toBe('ignite_fire');
  });

  it('splash potion throws', () => {
    expect(behaviorFor('splash_potion')).toBe('throw_splash_potion');
  });

  it('water bucket pours', () => {
    expect(behaviorFor('water_bucket')).toBe('pour_bucket');
  });

  it('empty bucket fills', () => {
    expect(behaviorFor('bucket')).toBe('fill_bucket');
  });

  it('TNT primed', () => {
    expect(behaviorFor('tnt')).toBe('use_tnt');
  });

  it('seeds drop', () => {
    expect(behaviorFor('wheat_seeds')).toBe('drop_item');
  });

  it('default places block', () => {
    expect(behaviorFor('stone')).toBe('place_block');
  });
});

import { describe, it, expect } from 'vitest';
import { damageEntitiesWithin, healsDragon, bottomIsObsidianOrBedrock } from './end_crystal_explode';

describe('end crystal explode', () => {
  it('full damage at zero', () => {
    expect(damageEntitiesWithin(0)).toBe(20);
  });

  it('falls off with distance', () => {
    expect(damageEntitiesWithin(6)).toBeLessThan(damageEntitiesWithin(2));
  });

  it('zero far', () => {
    expect(damageEntitiesWithin(20)).toBe(0);
  });

  it('heals dragon within 24', () => {
    expect(healsDragon(10)).toBeGreaterThan(0);
    expect(healsDragon(50)).toBe(0);
  });

  it('grows pedestal', () => {
    expect(bottomIsObsidianOrBedrock()).toBe(true);
  });
});

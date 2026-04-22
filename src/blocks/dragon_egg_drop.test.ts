import { describe, it, expect } from 'vitest';
import { willDropAsItem, breaksCellOnLanding } from './dragon_egg_drop';

describe('dragon egg drop', () => {
  it('drops on fall', () => {
    expect(willDropAsItem({ fallDistance: 2, pushedByPiston: false, hitByExplosion: false })).toBe(
      true,
    );
  });

  it('drops on piston push', () => {
    expect(willDropAsItem({ fallDistance: 0, pushedByPiston: true, hitByExplosion: false })).toBe(
      true,
    );
  });

  it('drops on explosion', () => {
    expect(willDropAsItem({ fallDistance: 0, pushedByPiston: false, hitByExplosion: true })).toBe(
      true,
    );
  });

  it('small fall no-op', () => {
    expect(
      willDropAsItem({ fallDistance: 0.5, pushedByPiston: false, hitByExplosion: false }),
    ).toBe(false);
  });

  it('breaks torch on landing', () => {
    expect(breaksCellOnLanding('webmc:torch')).toBe(true);
    expect(breaksCellOnLanding('webmc:stone')).toBe(false);
  });
});

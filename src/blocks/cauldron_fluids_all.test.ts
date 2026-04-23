import { describe, it, expect } from 'vitest';
import { canPutBucket, afterBucketPoured, cooksDamage } from './cauldron_fluids_all';

describe('cauldron fluids', () => {
  it('empty accepts water', () => {
    expect(canPutBucket({ fluid: 'empty', level: 0 }, 'water')).toBe(true);
  });

  it('full rejected', () => {
    expect(canPutBucket({ fluid: 'water', level: 3 }, 'water')).toBe(false);
  });

  it('pour sets full', () => {
    expect(afterBucketPoured({ fluid: 'empty', level: 0 }, 'lava')).toEqual({
      fluid: 'lava',
      level: 3,
    });
  });

  it('lava damages', () => {
    expect(cooksDamage({ fluid: 'lava', level: 3 })).toBe(true);
    expect(cooksDamage({ fluid: 'water', level: 3 })).toBe(false);
  });
});

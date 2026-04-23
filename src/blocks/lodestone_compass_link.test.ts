import { describe, it, expect } from 'vitest';
import { isLinked, bearingTo, spinsOutOfDimension } from './lodestone_compass_link';

describe('lodestone compass link', () => {
  it('unlinked detection', () => {
    expect(isLinked({})).toBe(false);
  });

  it('linked with coords', () => {
    expect(isLinked({ targetX: 0, targetY: 0, targetZ: 0, targetDim: 'overworld' })).toBe(true);
  });

  it('bearing east', () => {
    const b = bearingTo(
      { targetX: 10, targetY: 64, targetZ: 0, targetDim: 'overworld' },
      0,
      0,
    );
    expect(b).toBeCloseTo(0);
  });

  it('bearing undefined unlinked', () => {
    expect(bearingTo({}, 0, 0)).toBeUndefined();
  });

  it('spins across dim', () => {
    expect(
      spinsOutOfDimension(
        { targetX: 0, targetY: 0, targetZ: 0, targetDim: 'nether' },
        'overworld',
      ),
    ).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  boneMealPaleMoss,
  convertedName,
  hangingMossDrops,
  HANGING_MOSS_MAX_LENGTH,
  paleMossCarpetDrops,
} from './pale_moss';

describe('pale moss', () => {
  it('stone converts to pale moss block', () => {
    expect(convertedName('stone')).toBe('webmc:pale_moss_block');
  });

  it('gravel does not convert', () => {
    expect(convertedName('gravel')).toBeNull();
  });

  it('bone meal converts nearby stone', () => {
    const events = boneMealPaleMoss({
      at: { x: 0, y: 60, z: 0 },
      lookup: {
        topNonAir: () => ({ y: 59, block: 'webmc:stone' }),
      },
      radius: 1,
    });
    expect(events.length).toBe(9); // 3×3 ring
    for (const e of events) expect(e.to).toBe('webmc:pale_moss_block');
  });

  it('bone meal ignores non-convertible blocks', () => {
    const events = boneMealPaleMoss({
      at: { x: 0, y: 60, z: 0 },
      lookup: {
        topNonAir: () => ({ y: 59, block: 'webmc:sand' }),
      },
    });
    expect(events).toEqual([]);
  });

  it('carpet drops itself', () => {
    expect(paleMossCarpetDrops()[0]?.item).toBe('webmc:pale_moss_carpet');
  });

  it('hanging moss needs shears to drop', () => {
    expect(hangingMossDrops(true).length).toBe(1);
    expect(hangingMossDrops(false).length).toBe(0);
  });

  it('hanging moss max length is 8', () => {
    expect(HANGING_MOSS_MAX_LENGTH).toBe(8);
  });
});

import { describe, it, expect } from 'vitest';
import { canPlaceTall, onBreak } from './tall_plants_place';

describe('tall plants', () => {
  it('needs air clearance', () => {
    expect(
      canPlaceTall({ lowerCellAir: true, upperCellAir: false, groundBlockId: 'webmc:grass_block' }),
    ).toBe(false);
  });

  it('needs valid ground', () => {
    expect(
      canPlaceTall({ lowerCellAir: true, upperCellAir: true, groundBlockId: 'webmc:stone' }),
    ).toBe(false);
  });

  it('ok on dirt', () => {
    expect(
      canPlaceTall({ lowerCellAir: true, upperCellAir: true, groundBlockId: 'webmc:dirt' }),
    ).toBe(true);
  });

  it('break removes both', () => {
    const r = onBreak({ plantId: 'webmc:sunflower', wasHalf: 'upper' });
    expect(r.removeLower).toBe(true);
    expect(r.removeUpper).toBe(true);
    expect(r.drop?.id).toBe('webmc:sunflower');
  });
});

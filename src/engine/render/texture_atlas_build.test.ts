import { describe, it, expect } from 'vitest';
import { packShelves } from './texture_atlas_build';

describe('texture atlas build', () => {
  it('places all', () => {
    const r = packShelves(
      [
        { id: 'a', width: 16, height: 16 },
        { id: 'b', width: 16, height: 16 },
      ],
      32,
    );
    expect(r.placements).toHaveLength(2);
  });

  it('wraps to new shelf', () => {
    const r = packShelves(
      [
        { id: 'a', width: 20, height: 10 },
        { id: 'b', width: 20, height: 10 },
      ],
      25,
    );
    expect(r.totalHeight).toBeGreaterThan(10);
  });

  it('tallest stays first', () => {
    const r = packShelves(
      [
        { id: 'a', width: 8, height: 4 },
        { id: 'b', width: 8, height: 32 },
      ],
      64,
    );
    expect(r.placements[0]?.id).toBe('b');
  });
});

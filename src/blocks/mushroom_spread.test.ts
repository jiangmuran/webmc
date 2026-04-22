import { describe, it, expect } from 'vitest';
import { canSpread, hugeMushroomBlockCount, isValidSoil, CLUSTER_MAX } from './mushroom_spread';

describe('mushroom spread', () => {
  it('needs low light', () => {
    expect(
      canSpread({
        lightAtHere: 15,
        lightAtNeighbor: 5,
        neighborValidSoil: true,
        nearbyMushroomCount: 0,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('density cap', () => {
    expect(
      canSpread({
        lightAtHere: 5,
        lightAtNeighbor: 5,
        neighborValidSoil: true,
        nearbyMushroomCount: CLUSTER_MAX,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('spreads on low roll', () => {
    expect(
      canSpread({
        lightAtHere: 5,
        lightAtNeighbor: 5,
        neighborValidSoil: true,
        nearbyMushroomCount: 0,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('huge mushroom block count', () => {
    const n = hugeMushroomBlockCount({ mushroomId: 'webmc:red_mushroom', rand: () => 0 });
    expect(n).toBeGreaterThan(4);
  });

  it('mycelium always valid soil', () => {
    expect(isValidSoil('webmc:mycelium', 15)).toBe(true);
    expect(isValidSoil('webmc:stone', 15)).toBe(false);
  });
});

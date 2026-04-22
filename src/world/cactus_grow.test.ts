import { describe, it, expect } from 'vitest';
import { CACTUS_MAX_HEIGHT, cactusContactDamage, tickCactus, tickSugarCane } from './cactus_grow';

describe('cactus', () => {
  it('grows at low roll', () => {
    expect(
      tickCactus({
        height: 1,
        sandBelow: true,
        sideNeighborSolid: false,
        roll: 0.01,
      }),
    ).toBe('grew');
  });

  it('breaks with side neighbor', () => {
    expect(
      tickCactus({
        height: 1,
        sandBelow: true,
        sideNeighborSolid: true,
        roll: 0.5,
      }),
    ).toBe('broke');
  });

  it('breaks off non-sand base', () => {
    expect(
      tickCactus({
        height: 1,
        sandBelow: false,
        sideNeighborSolid: false,
        roll: 0.5,
      }),
    ).toBe('broke');
  });

  it('max height caps growth', () => {
    expect(
      tickCactus({
        height: CACTUS_MAX_HEIGHT,
        sandBelow: true,
        sideNeighborSolid: false,
        roll: 0.001,
      }),
    ).toBe('none');
  });

  it('contact damage scales with dt', () => {
    expect(cactusContactDamage(0.5)).toBe(1);
  });
});

describe('sugar cane', () => {
  it('needs water', () => {
    expect(
      tickSugarCane({
        height: 1,
        baseOnSandOrDirt: true,
        waterAdjacent: false,
        roll: 0.5,
      }),
    ).toBe('broke');
  });

  it('grows with water and dirt', () => {
    expect(
      tickSugarCane({
        height: 1,
        baseOnSandOrDirt: true,
        waterAdjacent: true,
        roll: 0.01,
      }),
    ).toBe('grew');
  });
});

import { describe, it, expect } from 'vitest';
import { connectsTo, FENCE_COLLISION_HEIGHT } from './fence_connect';

describe('fence connect', () => {
  it('same material fences connect', () => {
    expect(
      connectsTo('wood', { isSolid: false, fenceMaterial: 'wood', isFenceGate: false }, 'north'),
    ).toBe(true);
  });

  it('different materials do not', () => {
    expect(
      connectsTo(
        'wood',
        { isSolid: false, fenceMaterial: 'nether_brick', isFenceGate: false },
        'north',
      ),
    ).toBe(false);
  });

  it('connects to solid block', () => {
    expect(
      connectsTo('wood', { isSolid: true, fenceMaterial: null, isFenceGate: false }, 'north'),
    ).toBe(true);
  });

  it('fence gate connects along axis', () => {
    expect(
      connectsTo(
        'wood',
        { isSolid: false, fenceMaterial: null, isFenceGate: true, fenceGateFacing: 'east' },
        'east',
      ),
    ).toBe(true);
    expect(
      connectsTo(
        'wood',
        { isSolid: false, fenceMaterial: null, isFenceGate: true, fenceGateFacing: 'north' },
        'east',
      ),
    ).toBe(false);
  });

  it('collision height 1.5', () => {
    expect(FENCE_COLLISION_HEIGHT).toBe(1.5);
  });
});

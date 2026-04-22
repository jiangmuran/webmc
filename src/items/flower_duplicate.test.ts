import { describe, it, expect } from 'vitest';
import { boneMealFlower, canDuplicateFlower } from './flower_duplicate';

describe('flower duplicate', () => {
  it('normal flowers can duplicate', () => {
    expect(canDuplicateFlower('webmc:poppy')).toBe(true);
    expect(canDuplicateFlower('webmc:dandelion')).toBe(true);
  });

  it('tall flowers cannot duplicate', () => {
    expect(canDuplicateFlower('webmc:sunflower')).toBe(false);
    expect(canDuplicateFlower('webmc:lilac')).toBe(false);
  });

  it('places up to 4 copies on grass', () => {
    const placements = boneMealFlower(
      { x: 0, y: 64, z: 0 },
      'webmc:poppy',
      {
        isReplaceable: () => true,
        hasGrassBelow: () => true,
      },
      () => 0.5,
    );
    expect(placements.length).toBeGreaterThan(0);
    expect(placements.length).toBeLessThanOrEqual(4);
    for (const p of placements) expect(p.block).toBe('webmc:poppy');
  });

  it('tall flowers produce no placements', () => {
    const placements = boneMealFlower({ x: 0, y: 64, z: 0 }, 'webmc:sunflower', {
      isReplaceable: () => true,
      hasGrassBelow: () => true,
    });
    expect(placements.length).toBe(0);
  });

  it('non-grass ground skipped', () => {
    const placements = boneMealFlower({ x: 0, y: 64, z: 0 }, 'webmc:poppy', {
      isReplaceable: () => true,
      hasGrassBelow: () => false,
    });
    expect(placements.length).toBe(0);
  });
});

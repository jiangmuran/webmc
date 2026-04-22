import { describe, it, expect } from 'vitest';
import { boneMealNylium, hoeNylium } from './nylium_spread';

describe('nylium spread', () => {
  it('converts nearby netherrack to crimson nylium', () => {
    const events = boneMealNylium({
      nyliumKind: 'crimson',
      anchor: { x: 0, y: 40, z: 0 },
      neighbors: [
        { x: 1, y: 40, z: 0, block: 'webmc:netherrack' },
        { x: -1, y: 40, z: 0, block: 'webmc:netherrack' },
      ],
      rng: () => 0.1,
    });
    const nyliumPlacements = events.filter((e) => e.block.includes('crimson_nylium'));
    expect(nyliumPlacements.length).toBeGreaterThan(0);
  });

  it('warped kind places warped decorations', () => {
    const events = boneMealNylium({
      nyliumKind: 'warped',
      anchor: { x: 0, y: 40, z: 0 },
      neighbors: [{ x: 1, y: 40, z: 0, block: 'webmc:netherrack' }],
      rng: () => 0.01,
    });
    const decorations = events.filter((e) => e.block.includes('warped'));
    expect(decorations.length).toBeGreaterThan(0);
  });

  it('ignores non-netherrack blocks', () => {
    const events = boneMealNylium({
      nyliumKind: 'crimson',
      anchor: { x: 0, y: 40, z: 0 },
      neighbors: [{ x: 1, y: 40, z: 0, block: 'webmc:stone' }],
      rng: () => 0.01,
    });
    expect(events).toEqual([]);
  });

  it('hoe returns netherrack', () => {
    expect(hoeNylium('warped').newBlock).toBe('webmc:netherrack');
  });
});

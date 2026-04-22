import { describe, it, expect } from 'vitest';
import { blockId, CORAL_COLORS, makeCoral, planReef, tickCoral } from './coral_reef';

describe('coral', () => {
  it('starts alive in water', () => {
    const c = makeCoral('fire');
    expect(c.alive).toBe(true);
  });

  it('dies after 3s out of water', () => {
    const c = makeCoral('fire');
    expect(tickCoral(c, false, 4)).toBe(true);
    expect(c.alive).toBe(false);
  });

  it('recovers when put back in water', () => {
    const c = makeCoral('fire');
    tickCoral(c, false, 1);
    tickCoral(c, true, 1);
    expect(c.secondsOutOfWater).toBe(0);
  });

  it('dead block id prefix', () => {
    const c = makeCoral('tube');
    c.alive = false;
    expect(blockId(c)).toBe('webmc:dead_tube_coral_block');
  });

  it('5 coral colors', () => {
    expect(CORAL_COLORS.length).toBe(5);
  });
});

describe('reef', () => {
  it('blocks fit inside radius', () => {
    const r = planReef({
      origin: { x: 0, y: 60, z: 0 },
      radius: 3,
      rng: () => 0.1,
    });
    for (const b of r.blocks) {
      const d = Math.hypot(b.pos.x, b.pos.z);
      expect(d).toBeLessThanOrEqual(3);
    }
  });

  it('sparse reef with high rng', () => {
    const r = planReef({
      origin: { x: 0, y: 60, z: 0 },
      radius: 3,
      rng: () => 0.99,
    });
    expect(r.blocks.length).toBeLessThan(5);
  });
});

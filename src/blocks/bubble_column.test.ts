import { describe, it, expect } from 'vitest';
import { bubbleColumnAt, columnVelocity, type BubbleColumnLookup } from './bubble_column';

function lookup(opts: { waterTo: number; magma?: number; soul?: number }): BubbleColumnLookup {
  return {
    isWater: (_x, y) => y >= opts.waterTo && y < 64,
    isMagma: (_x, y) => opts.magma !== undefined && y === opts.magma,
    isSoulSand: (_x, y) => opts.soul !== undefined && y === opts.soul,
  };
}

describe('bubble column', () => {
  it('magma under water makes a down column', () => {
    const l = lookup({ waterTo: 10, magma: 9 });
    expect(bubbleColumnAt(0, 20, 0, l)).toBe('down');
  });

  it('soul sand under water makes an up column', () => {
    const l = lookup({ waterTo: 10, soul: 9 });
    expect(bubbleColumnAt(0, 20, 0, l)).toBe('up');
  });

  it('plain water column returns null', () => {
    const l = lookup({ waterTo: 10 });
    expect(bubbleColumnAt(0, 20, 0, l)).toBeNull();
  });

  it('non-water top returns null', () => {
    const l = lookup({ waterTo: 100 });
    expect(bubbleColumnAt(0, 20, 0, l)).toBeNull();
  });

  it('velocity is +y for up, -y for down', () => {
    expect(columnVelocity('up').y).toBeGreaterThan(0);
    expect(columnVelocity('down').y).toBeLessThan(0);
  });
});

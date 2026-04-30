import { describe, it, expect } from 'vitest';
import { bundleTooltip, cycleTooltipWindow } from './bundle_tooltip';

describe('bundle tooltip', () => {
  it('empty bundle = empty preview', () => {
    const r = bundleTooltip({ contents: [] });
    expect(r.slots.every((s) => s.item === null)).toBe(true);
    expect(r.fillFraction).toBe(0);
  });

  it('single stack — half-full bundle (wiki)', () => {
    // Wiki: 32 stone (maxStack 64) takes 32/64 = 0.5 of bundle capacity.
    const r = bundleTooltip({
      contents: [{ item: 'webmc:stone', count: 32, maxStack: 64 }],
    });
    expect(r.slots[0]?.item).toBe('webmc:stone');
    expect(r.fillFraction).toBeCloseTo(0.5);
  });

  it('caps at 12 slots preview', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      item: `webmc:item${i.toString()}`,
      count: 1,
      maxStack: 64,
    }));
    const r = bundleTooltip({ contents: many });
    expect(r.slots.length).toBe(12);
  });

  it('overfull warning', () => {
    const huge = Array.from({ length: 200 }, () => ({
      item: 'webmc:stone',
      count: 64,
      maxStack: 64,
    }));
    const r = bundleTooltip({ contents: huge });
    expect(r.overfullWarning).toBe(true);
  });

  it('cycle shifts the window', () => {
    const many = Array.from({ length: 15 }, (_, i) => ({
      item: `webmc:item${i.toString()}`,
      count: 1,
      maxStack: 64,
    }));
    const normal = bundleTooltip({ contents: many });
    const cycled = cycleTooltipWindow({ contents: many }, 5);
    expect(cycled.slots[0]?.item).not.toBe(normal.slots[0]?.item);
  });
});

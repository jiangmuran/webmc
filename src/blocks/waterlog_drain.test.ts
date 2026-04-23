import { describe, it, expect } from 'vitest';
import { canWaterlog, placeInWater, bucketDrain, bucketFill } from './waterlog_drain';

describe('waterlog drain', () => {
  it('slab waterlogs', () => {
    expect(canWaterlog('oak_slab')).toBe(true);
  });

  it('stone block not', () => {
    expect(canWaterlog('stone')).toBe(false);
  });

  it('placeInWater sets', () => {
    const b = placeInWater({ blockId: 'oak_slab', waterlogged: false });
    expect(b.waterlogged).toBe(true);
  });

  it('bucket drains', () => {
    const r = bucketDrain({ blockId: 'oak_slab', waterlogged: true });
    expect(r.picked).toBe(true);
    expect(r.block.waterlogged).toBe(false);
  });

  it('drain no-op when dry', () => {
    expect(bucketDrain({ blockId: 'oak_slab', waterlogged: false }).picked).toBe(false);
  });

  it('bucket fills', () => {
    const r = bucketFill({ blockId: 'oak_slab', waterlogged: false });
    expect(r.used).toBe(true);
    expect(r.block.waterlogged).toBe(true);
  });

  it('fill rejects non-waterloggable', () => {
    expect(bucketFill({ blockId: 'stone', waterlogged: false }).used).toBe(false);
  });
});

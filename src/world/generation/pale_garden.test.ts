import { describe, it, expect } from 'vitest';
import {
  EYEBLOSSOM_NAUSEA_DURATION_SEC,
  planPaleGarden,
  playersToApplyNausea,
  tickEyeblossom,
} from './pale_garden';

describe('pale garden', () => {
  it('scales with area', () => {
    const small = planPaleGarden({ rng: () => 0.5, areaBlocks: 500 });
    const big = planPaleGarden({ rng: () => 0.5, areaBlocks: 5000 });
    expect(big.paleOakCount).toBeGreaterThan(small.paleOakCount);
  });

  it('eyeblossom opens by day', () => {
    const e = { open: false };
    expect(tickEyeblossom(e, true)).toBe('opened');
    expect(e.open).toBe(true);
  });

  it('eyeblossom closes by night', () => {
    const e = { open: true };
    expect(tickEyeblossom(e, false)).toBe('closed');
  });

  it('idempotent transitions', () => {
    const e = { open: true };
    expect(tickEyeblossom(e, true)).toBe('none');
  });

  it('nausea affects nearby players', () => {
    const ids = playersToApplyNausea({ x: 0, y: 0, z: 0 }, [
      { id: 'p1', pos: { x: 2, y: 0, z: 0 } },
      { id: 'p2', pos: { x: 100, y: 0, z: 0 } },
    ]);
    expect(ids).toEqual(['p1']);
  });

  it('nausea duration = 7 sec', () => {
    expect(EYEBLOSSOM_NAUSEA_DURATION_SEC).toBe(7);
  });
});

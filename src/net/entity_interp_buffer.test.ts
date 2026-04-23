import { describe, it, expect } from 'vitest';
import { renderPos, pruneOld, type Snapshot, INTERP_DELAY_MS } from './entity_interp_buffer';

const buf: Snapshot[] = [
  { t: 0, x: 0, y: 0, z: 0, yaw: 0 },
  { t: 100, x: 10, y: 0, z: 0, yaw: 0 },
  { t: 200, x: 20, y: 0, z: 0, yaw: 0 },
];

describe('entity interp buffer', () => {
  it('interpolates between snapshots', () => {
    const p = renderPos(buf, 150 + INTERP_DELAY_MS);
    expect(p?.x).toBeCloseTo(15);
  });

  it('returns first if too early', () => {
    const p = renderPos(buf, 0);
    expect(p?.x).toBe(0);
  });

  it('returns last if past tail', () => {
    const p = renderPos(buf, 9999);
    expect(p?.x).toBe(20);
  });

  it('empty buffer undefined', () => {
    expect(renderPos([], 100)).toBeUndefined();
  });

  it('prune removes old', () => {
    const old: Snapshot[] = [{ t: 0, x: 0, y: 0, z: 0, yaw: 0 }];
    expect(pruneOld(old, 10000)).toEqual([]);
  });

  it('prune keeps recent', () => {
    const recent: Snapshot[] = [{ t: 9000, x: 0, y: 0, z: 0, yaw: 0 }];
    expect(pruneOld(recent, 9000)).toHaveLength(1);
  });
});

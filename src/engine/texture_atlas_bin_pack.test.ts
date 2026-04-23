import { describe, it, expect } from 'vitest';
import { shelfPack } from './texture_atlas_bin_pack';

describe('texture atlas bin pack', () => {
  it('empty pack', () => {
    const r = shelfPack([], 256);
    expect(r.placements.length).toBe(0);
    expect(r.atlasHeight).toBe(0);
  });

  it('fits on one shelf', () => {
    const r = shelfPack(
      [
        { id: 'a', w: 64, h: 64 },
        { id: 'b', w: 64, h: 64 },
      ],
      256,
    );
    expect(r.atlasHeight).toBe(64);
  });

  it('wraps to next shelf', () => {
    const r = shelfPack(
      [
        { id: 'a', w: 128, h: 64 },
        { id: 'b', w: 128, h: 64 },
        { id: 'c', w: 128, h: 64 },
      ],
      256,
    );
    expect(r.atlasHeight).toBe(128);
  });

  it('no overlap', () => {
    const r = shelfPack(
      [
        { id: 'a', w: 64, h: 64 },
        { id: 'b', w: 64, h: 32 },
        { id: 'c', w: 96, h: 16 },
      ],
      256,
    );
    for (let i = 0; i < r.placements.length; i++) {
      for (let j = i + 1; j < r.placements.length; j++) {
        const A = r.placements[i];
        const B = r.placements[j];
        if (!A || !B) throw new Error('unreachable');
        const overlap = A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y;
        expect(overlap).toBe(false);
      }
    }
  });
});

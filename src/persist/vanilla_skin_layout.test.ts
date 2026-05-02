import { describe, it, expect } from 'vitest';
import { SKIN_LAYOUT_64X64, SKIN_LAYOUT_64X32, pickSkinLayout } from './vanilla_skin_layout';

function inBounds(rect: readonly [number, number, number, number], w: number, h: number): boolean {
  return rect[0] >= 0 && rect[1] >= 0 && rect[0] + rect[2] <= w && rect[1] + rect[3] <= h;
}

describe('vanilla skin layout', () => {
  it('64×64 layout has all 8 body parts × 6 faces', () => {
    const expectedParts = [
      'head',
      'hat',
      'body',
      'right_arm',
      'left_arm',
      'right_leg',
      'left_leg',
    ] as const;
    const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'] as const;
    for (const part of expectedParts) {
      for (const face of faces) {
        const key = `${part}_${face}`;
        expect(SKIN_LAYOUT_64X64[key], `missing ${key}`).toBeDefined();
      }
    }
  });

  it('64×64 layout regions are all within bounds', () => {
    for (const [name, rect] of Object.entries(SKIN_LAYOUT_64X64)) {
      expect(inBounds(rect, 64, 64), `${name} oob`).toBe(true);
    }
  });

  it('64×32 layout regions are all within bounds', () => {
    for (const [name, rect] of Object.entries(SKIN_LAYOUT_64X32)) {
      expect(inBounds(rect, 64, 32), `${name} oob`).toBe(true);
    }
  });

  it('pickSkinLayout dispatches based on dimensions', () => {
    expect(pickSkinLayout(64, 64)).toBe(SKIN_LAYOUT_64X64);
    expect(pickSkinLayout(64, 32)).toBe(SKIN_LAYOUT_64X32);
    expect(pickSkinLayout(128, 128)).toBeNull();
    expect(pickSkinLayout(32, 32)).toBeNull();
  });

  it('head_front and body_front have the canonical Steve coordinates', () => {
    expect(SKIN_LAYOUT_64X64['head_front']).toEqual([8, 8, 8, 8]);
    expect(SKIN_LAYOUT_64X64['body_front']).toEqual([20, 20, 8, 12]);
  });
});

import { describe, it, expect } from 'vitest';
import { rectFor, normalize, SKIN_PIXEL_SIZE } from './player_skin_uv';

describe('player skin uv', () => {
  it('head front rect', () => {
    expect(rectFor('head_front', false)).toEqual({ u: 8, v: 8, w: 8, h: 8 });
  });

  it('slim arm narrower', () => {
    expect(rectFor('arm_right_front', true).w).toBe(3);
    expect(rectFor('arm_right_front', false).w).toBe(4);
  });

  it('body size 8x12', () => {
    const r = rectFor('body_front', false);
    expect(r.w).toBe(8);
    expect(r.h).toBe(12);
  });

  it('normalize divides by 64', () => {
    const n = normalize(rectFor('head_front', false));
    expect(n.u).toBeCloseTo(8 / SKIN_PIXEL_SIZE);
  });

  it('64 px canvas constant', () => {
    expect(SKIN_PIXEL_SIZE).toBe(64);
  });
});

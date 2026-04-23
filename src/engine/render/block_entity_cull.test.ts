import { describe, it, expect } from 'vitest';
import {
  inRenderRange,
  cullList,
  visibleCount,
  RENDER_DISTANCE,
  type BlockEntity,
} from './block_entity_cull';

describe('block entity cull', () => {
  it('near in range', () => {
    expect(inRenderRange({ x: 1, y: 64, z: 1 }, 0, 64, 0)).toBe(true);
  });

  it('far out of range', () => {
    expect(inRenderRange({ x: RENDER_DISTANCE * 2, y: 64, z: 0 }, 0, 64, 0)).toBe(false);
  });

  it('cull filters list', () => {
    const list: BlockEntity[] = [
      { x: 0, y: 64, z: 0 },
      { x: 1000, y: 64, z: 0 },
    ];
    expect(cullList(list, 0, 64, 0)).toHaveLength(1);
  });

  it('visible count default true', () => {
    expect(visibleCount([{ x: 0, y: 0, z: 0 }])).toBe(1);
  });

  it('explicit invisible skipped', () => {
    expect(visibleCount([{ x: 0, y: 0, z: 0, visible: false }])).toBe(0);
  });
});

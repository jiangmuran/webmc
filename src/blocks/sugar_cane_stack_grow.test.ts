import { describe, it, expect } from 'vitest';
import {
  canPlace,
  shouldGrow,
  destroyOnUnsupported,
  MAX_HEIGHT,
  type Column,
} from './sugar_cane_stack_grow';

const ok: Column = { currentHeight: 0, supportedBy: 'dirt', adjacentWater: true };

describe('sugar cane stack grow', () => {
  it('needs water adjacent', () => {
    expect(canPlace('dirt', false)).toBe(false);
  });

  it('grass with water ok', () => {
    expect(canPlace('grass_block', true)).toBe(true);
  });

  it('wrong base rejected', () => {
    expect(canPlace('other', true)).toBe(false);
  });

  it('lucky roll grows', () => {
    expect(shouldGrow(ok, () => 0)).toBe(true);
  });

  it('max height stops', () => {
    expect(shouldGrow({ ...ok, currentHeight: MAX_HEIGHT }, () => 0)).toBe(false);
  });

  it('no support breaks', () => {
    expect(destroyOnUnsupported(ok, undefined)).toBe(true);
  });
});

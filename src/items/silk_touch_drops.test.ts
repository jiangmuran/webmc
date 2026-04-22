import { describe, it, expect } from 'vitest';
import { silkDropsBlockItself, incompatibleWithFortune, dropIdFor } from './silk_touch_drops';

describe('silk touch drops', () => {
  it('diamond ore silk', () => {
    expect(silkDropsBlockItself('diamond_ore')).toBe(true);
  });

  it('glass silk', () => {
    expect(silkDropsBlockItself('glass')).toBe(true);
  });

  it('grass block silk', () => {
    expect(silkDropsBlockItself('grass_block')).toBe(true);
  });

  it('dirt not silk-required', () => {
    expect(silkDropsBlockItself('dirt')).toBe(false);
  });

  it('incompatible with fortune', () => {
    expect(incompatibleWithFortune()).toBe(true);
  });

  it('dropId preserves grass_block', () => {
    expect(dropIdFor('grass_block')).toBe('grass_block');
  });
});

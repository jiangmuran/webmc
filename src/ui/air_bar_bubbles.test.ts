import { describe, it, expect } from 'vitest';
import { bubbleIcons, visible, MAX_AIR_TICKS } from './air_bar_bubbles';

describe('air bar bubbles', () => {
  it('full air → 10 full', () => {
    expect(bubbleIcons(MAX_AIR_TICKS).every((x) => x === 'full')).toBe(true);
  });

  it('half air → 5 full', () => {
    const i = bubbleIcons(MAX_AIR_TICKS / 2);
    expect(i.filter((x) => x === 'full').length).toBe(5);
  });

  it('zero air → pop last', () => {
    const i = bubbleIcons(0);
    expect(i[i.length - 1]).toBe('pop');
  });

  it('hidden when full air on land', () => {
    expect(visible(MAX_AIR_TICKS, false)).toBe(false);
  });

  it('visible when submerged', () => {
    expect(visible(MAX_AIR_TICKS, true)).toBe(true);
  });

  it('visible when losing air', () => {
    expect(visible(MAX_AIR_TICKS - 1, false)).toBe(true);
  });
});

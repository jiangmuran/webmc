import { describe, it, expect } from 'vitest';
import { armorIcons, visible, MAX_ARMOR } from './armor_bar_icons';

describe('armor bar icons', () => {
  it('full armor', () => {
    expect(armorIcons(MAX_ARMOR).every((x) => x === 'full')).toBe(true);
  });

  it('no armor hidden', () => {
    expect(visible(0)).toBe(false);
    expect(visible(1)).toBe(true);
  });

  it('odd point produces half', () => {
    const i = armorIcons(1);
    expect(i[0]).toBe('half');
  });

  it('mixed armor', () => {
    const i = armorIcons(7);
    expect(i.filter((x) => x === 'full').length).toBe(3);
    expect(i.filter((x) => x === 'half').length).toBe(1);
  });
});

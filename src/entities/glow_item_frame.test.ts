import { describe, it, expect } from 'vitest';
import {
  lightLevel,
  illuminatesItemTexture,
  brokenByArrowDropsItem,
  GLOW_LIGHT_LEVEL,
} from './glow_item_frame';

describe('glow item frame', () => {
  it('glow variant has light 14', () => {
    expect(lightLevel(true)).toBe(GLOW_LIGHT_LEVEL);
  });

  it('regular has no light', () => {
    expect(lightLevel(false)).toBe(0);
  });

  it('glow illuminates texture', () => {
    expect(illuminatesItemTexture(true)).toBe(true);
    expect(illuminatesItemTexture(false)).toBe(false);
  });

  it('arrow break drops item', () => {
    expect(brokenByArrowDropsItem()).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import {
  lightLevel,
  illuminatesItemTexture,
  brokenByArrowDropsItem,
  GLOW_LIGHT_LEVEL,
} from './glow_item_frame';

describe('glow item frame', () => {
  it('glow + regular emit 0 light (wiki: "Light: 0")', () => {
    // Wiki (minecraft.wiki/w/Glow_Item_Frame): "Light: 0 — the glow
    // item frame's contents are rendered with full brightness, but
    // the frame itself does not emit any block light." Old code
    // reported 14 for the glow variant, which would let the frame
    // satisfy crop-grow / mob-spawn light thresholds.
    expect(lightLevel(true)).toBe(0);
    expect(lightLevel(false)).toBe(0);
    expect(GLOW_LIGHT_LEVEL).toBe(0);
  });

  it('glow illuminates texture', () => {
    expect(illuminatesItemTexture(true)).toBe(true);
    expect(illuminatesItemTexture(false)).toBe(false);
  });

  it('arrow break drops item', () => {
    expect(brokenByArrowDropsItem()).toBe(true);
  });
});

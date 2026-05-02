import { describe, it, expect } from 'vitest';
import {
  emitsLight,
  droppedBySilkTouchOnly,
  hoeIsPreferredTool,
  SHROOMLIGHT_LIGHT_LEVEL,
} from './shroomlight_place';

describe('shroomlight place', () => {
  it('full 15 light', () => {
    expect(emitsLight()).toBe(15);
    expect(SHROOMLIGHT_LIGHT_LEVEL).toBe(15);
  });

  it('drops with any tool, no silk-touch needed (wiki)', () => {
    // Wiki (minecraft.wiki/w/Shroomlight): "Shroomlight blocks can
    // be broken with any tool, and always drop as an item."
    expect(droppedBySilkTouchOnly()).toBe(false);
  });

  it('hoe preferred', () => {
    expect(hoeIsPreferredTool()).toBe(true);
  });
});

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

  it('silk touch only for self-drop', () => {
    expect(droppedBySilkTouchOnly()).toBe(true);
  });

  it('hoe preferred', () => {
    expect(hoeIsPreferredTool()).toBe(true);
  });
});

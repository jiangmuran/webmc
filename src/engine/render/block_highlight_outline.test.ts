import { describe, it, expect } from 'vitest';
import {
  shouldShowOutline,
  outlineColor,
  outlineThicknessPx,
  type HighlightInput,
} from './block_highlight_outline';

const hover: HighlightInput = {
  hoveredBlockId: 'stone',
  hoveredX: 0,
  hoveredY: 64,
  hoveredZ: 0,
  reach: 5,
  distance: 3,
};

describe('block highlight outline', () => {
  it('shows on hovered block', () => {
    expect(shouldShowOutline(hover)).toBe(true);
  });

  it('hides on air', () => {
    expect(shouldShowOutline({ ...hover, hoveredBlockId: 'air' })).toBe(false);
  });

  it('hides out of reach', () => {
    expect(shouldShowOutline({ ...hover, distance: 10 })).toBe(false);
  });

  it('outline has positive alpha', () => {
    expect(outlineColor(hover)[3]).toBeGreaterThan(0);
  });

  it('invisible when hidden', () => {
    expect(outlineColor({ ...hover, hoveredBlockId: 'air' })[3]).toBe(0);
  });

  it('thickness set', () => {
    expect(outlineThicknessPx()).toBeGreaterThan(0);
  });
});

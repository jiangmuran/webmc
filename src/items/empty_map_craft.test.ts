import { describe, it, expect } from 'vitest';
import { canCraftEmptyMap, initialMapScale, PAPER_REQUIRED } from './empty_map_craft';

describe('empty map craft', () => {
  it('8 paper for plain map', () => {
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_REQUIRED, compassSlots: 0, useLocator: false }),
    ).toBe(true);
  });

  it('locator map needs compass', () => {
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_REQUIRED, compassSlots: 0, useLocator: true }),
    ).toBe(false);
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_REQUIRED, compassSlots: 1, useLocator: true }),
    ).toBe(true);
  });

  it('insufficient paper fails', () => {
    expect(canCraftEmptyMap({ paperSlots: 3, compassSlots: 0, useLocator: false })).toBe(false);
  });

  it('initial scale 1', () => {
    expect(initialMapScale()).toBe(1);
  });
});

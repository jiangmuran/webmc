import { describe, it, expect } from 'vitest';
import {
  canCraftEmptyMap,
  initialMapScale,
  PAPER_FOR_PLAIN_MAP,
  PAPER_FOR_LOCATOR_MAP,
} from './empty_map_craft';

describe('empty map craft', () => {
  it('plain map needs 9 paper (wiki)', () => {
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_FOR_PLAIN_MAP, compassSlots: 0, useLocator: false }),
    ).toBe(true);
    expect(canCraftEmptyMap({ paperSlots: 8, compassSlots: 0, useLocator: false })).toBe(false);
  });

  it('locator map needs 8 paper + 1 compass', () => {
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_FOR_LOCATOR_MAP, compassSlots: 0, useLocator: true }),
    ).toBe(false);
    expect(
      canCraftEmptyMap({ paperSlots: PAPER_FOR_LOCATOR_MAP, compassSlots: 1, useLocator: true }),
    ).toBe(true);
  });

  it('insufficient paper fails', () => {
    expect(canCraftEmptyMap({ paperSlots: 3, compassSlots: 0, useLocator: false })).toBe(false);
  });

  it('initial scale 1', () => {
    expect(initialMapScale()).toBe(1);
  });
});

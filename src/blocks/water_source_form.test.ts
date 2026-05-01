import { describe, it, expect } from 'vitest';
import { shouldBecomeSource, flowLevelFrom, canFlow, waterFalls } from './water_source_form';

describe('water source form', () => {
  it('two sources make one', () => {
    expect(
      shouldBecomeSource([
        { isSource: true, level: 0, solidBelow: true },
        { isSource: true, level: 0, solidBelow: true },
      ]),
    ).toBe(true);
  });

  it('one source not enough', () => {
    expect(shouldBecomeSource([{ isSource: true, level: 0, solidBelow: true }])).toBe(false);
  });

  it('cell over air cannot become a source per wiki', () => {
    // minecraft.wiki/w/Water#Source_blocks: "on top of an opaque
    // solid block" is a hard requirement — two sources in mid-air
    // do NOT yield infinite water.
    expect(
      shouldBecomeSource(
        [
          { isSource: true, level: 0, solidBelow: true },
          { isSource: true, level: 0, solidBelow: true },
        ],
        false,
      ),
    ).toBe(false);
  });

  it('flow level increments', () => {
    expect(flowLevelFrom(0)).toBe(1);
    expect(flowLevelFrom(6)).toBe(7);
    expect(flowLevelFrom(7)).toBe(7);
  });

  it('canFlow only non-source + non-dry', () => {
    expect(canFlow({ isSource: false, level: 5, solidBelow: true })).toBe(true);
    expect(canFlow({ isSource: true, level: 0, solidBelow: true })).toBe(false);
  });

  it('waterFalls on air below', () => {
    expect(waterFalls(true)).toBe(true);
    expect(waterFalls(false)).toBe(false);
  });
});

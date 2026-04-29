import { describe, it, expect } from 'vitest';
import { PLATE_DEFS, plateSignal } from './pressure_plate_variants';

describe('pressure plate variants', () => {
  it('wood triggers on any entity including items', () => {
    expect(plateSignal({ kind: 'wood', playerCount: 0, mobCount: 0, itemCount: 1 })).toBe(15);
  });

  it('stone ignores items', () => {
    expect(plateSignal({ kind: 'stone', playerCount: 0, mobCount: 0, itemCount: 1 })).toBe(0);
    expect(plateSignal({ kind: 'stone', playerCount: 0, mobCount: 1, itemCount: 0 })).toBe(15);
  });

  it('polished_blackstone triggers on living entities (mobs + players)', () => {
    // Wiki: polished_blackstone matches stone — mobs trigger.
    expect(
      plateSignal({
        kind: 'polished_blackstone',
        playerCount: 0,
        mobCount: 1,
        itemCount: 0,
      }),
    ).toBe(15);
    expect(
      plateSignal({
        kind: 'polished_blackstone',
        playerCount: 1,
        mobCount: 0,
        itemCount: 0,
      }),
    ).toBe(15);
    // Items don't trigger.
    expect(
      plateSignal({
        kind: 'polished_blackstone',
        playerCount: 0,
        mobCount: 0,
        itemCount: 10,
      }),
    ).toBe(0);
  });

  it('light_weighted scales 1..15 per entity', () => {
    expect(plateSignal({ kind: 'light_weighted', playerCount: 0, mobCount: 0, itemCount: 5 })).toBe(
      5,
    );
    expect(
      plateSignal({ kind: 'light_weighted', playerCount: 0, mobCount: 0, itemCount: 30 }),
    ).toBe(15);
  });

  it('heavy_weighted scales by ÷ 10', () => {
    expect(
      plateSignal({ kind: 'heavy_weighted', playerCount: 0, mobCount: 0, itemCount: 50 }),
    ).toBe(5);
  });

  it('plate defs exist for all 5 kinds', () => {
    expect(Object.keys(PLATE_DEFS).length).toBe(5);
  });
});

import { describe, it, expect } from 'vitest';
import { totalSlots, canAdd, fullnessFraction, BUNDLE_CAPACITY } from './bundle_open_inventory';

describe('bundle open inventory', () => {
  it('empty is 0 slots', () => {
    expect(totalSlots([])).toBe(0);
  });

  it('weight scales by stack-size (wiki: 64/stack-size per item)', () => {
    // 32 stones (stack 64) → weight 32 × (64/64) = 32, NOT 64.
    expect(totalSlots([{ id: 'stone', count: 32, stackSize: 64 }])).toBe(32);
    // 1 ender pearl (stack 16) → weight 1 × (64/16) = 4.
    expect(totalSlots([{ id: 'ender_pearl', count: 1, stackSize: 16 }])).toBe(4);
    // 1 non-stackable item (stack 1) → weight 1 × 64 = 64 (fills the bundle).
    expect(totalSlots([{ id: 'sword', count: 1, stackSize: 1 }])).toBe(64);
  });

  it('can add while under cap', () => {
    expect(canAdd([], 64, 1)).toBe(true);
  });

  it('reject overfill (1 sword fills bundle, no room for more)', () => {
    expect(canAdd([{ id: 'sword', count: 1, stackSize: 1 }], 64, 1)).toBe(false);
  });

  it('two half-stacks of stone fit (wiki: 32+32 = 64 weight)', () => {
    expect(canAdd([{ id: 'stone', count: 32, stackSize: 64 }], 64, 32)).toBe(true);
    expect(canAdd([{ id: 'stone', count: 32, stackSize: 64 }], 64, 33)).toBe(false);
  });

  it('fullness clamps to 1', () => {
    expect(fullnessFraction([{ id: 'sword', count: 1, stackSize: 1 }])).toBe(1);
    expect(fullnessFraction([])).toBe(0);
  });

  it('capacity 64', () => {
    expect(BUNDLE_CAPACITY).toBe(64);
  });
});

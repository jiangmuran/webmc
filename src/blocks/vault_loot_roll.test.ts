import { describe, it, expect } from 'vitest';
import { rollLoot } from './vault_loot_roll';

describe('vault loot roll', () => {
  it('empty returns undefined', () => {
    expect(rollLoot([], () => 0)).toBeUndefined();
  });

  it('single entry always picked', () => {
    expect(rollLoot([{ item: 'diamond', weight: 1 }], () => 0.9)).toBe('diamond');
  });

  it('first entry at rng=0', () => {
    expect(
      rollLoot(
        [
          { item: 'a', weight: 1 },
          { item: 'b', weight: 1 },
        ],
        () => 0,
      ),
    ).toBe('a');
  });

  it('last entry at rng≈1', () => {
    expect(
      rollLoot(
        [
          { item: 'a', weight: 1 },
          { item: 'b', weight: 1 },
        ],
        () => 0.99,
      ),
    ).toBe('b');
  });

  it('zero weights returns undefined', () => {
    expect(rollLoot([{ item: 'x', weight: 0 }], () => 0.5)).toBeUndefined();
  });
});

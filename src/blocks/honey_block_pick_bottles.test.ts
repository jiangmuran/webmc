import { describe, it, expect } from 'vitest';
import { canHarvest, afterHarvest, produces, FULL_LEVEL } from './honey_block_pick_bottles';

describe('beehive harvest', () => {
  it('full hive with bottle', () => {
    expect(canHarvest({ honeyLevel: FULL_LEVEL, maxLevel: 5 }, 'bottle')).toBe(true);
  });

  it('empty hive rejected', () => {
    expect(canHarvest({ honeyLevel: 0, maxLevel: 5 }, 'bottle')).toBe(false);
  });

  it('other tool rejected', () => {
    expect(canHarvest({ honeyLevel: FULL_LEVEL, maxLevel: 5 }, 'other')).toBe(false);
  });

  it('after harvest empty', () => {
    expect(afterHarvest({ honeyLevel: FULL_LEVEL, maxLevel: 5 }).honeyLevel).toBe(0);
  });

  it('produces correct item', () => {
    expect(produces('bottle')).toBe('honey_bottle');
    expect(produces('shears')).toBe('honeycomb');
  });
});

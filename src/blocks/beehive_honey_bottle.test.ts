import { describe, it, expect } from 'vitest';
import {
  harvestHoneyBottle,
  harvestHoneycomb,
  beesAngered,
  MAX_HONEY_LEVEL,
  type BeehiveState,
} from './beehive_honey_bottle';

const full: BeehiveState = { honeyLevel: MAX_HONEY_LEVEL, beesHoused: 3, isSmoked: false };

describe('beehive honey bottle', () => {
  it('full yields bottle', () => {
    expect(harvestHoneyBottle(full).output).toBe('honey_bottle');
  });

  it('empty no output', () => {
    expect(harvestHoneyBottle({ ...full, honeyLevel: 0 }).output).toBeUndefined();
  });

  it('honeycomb triple', () => {
    expect(harvestHoneycomb(full).output).toHaveLength(3);
  });

  it('bees anger on break', () => {
    expect(beesAngered(full, true)).toBe(true);
  });

  it('smoke calms bees', () => {
    expect(beesAngered({ ...full, isSmoked: true }, true)).toBe(false);
  });

  it('full but undisturbed hive does NOT anger (wiki)', () => {
    expect(beesAngered(full, false)).toBe(false);
  });

  it('harvest empties hive', () => {
    expect(harvestHoneyBottle(full).newHive.honeyLevel).toBe(0);
  });
});
